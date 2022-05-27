class PaymentsController < ApplicationController
  before_filter :load_order, only: [:new, :create]

  def payonline_approve
    text = if stringify_json_parameters("#{ENV['API_BASE_URL']}/interpreters_payments/payonline/approve", 'get', params)
      flash[:warning] = @message
      "<script>parent.location.href='#{order_complete_path(@order.id)}';</script>"
    else 
      "<script>parent.location.href='/';</script>"
    end
    if @is_commission_payment 
      redirect_to "#{ENV["BACKEND_URL"]}/orders/#{@order.id}"
    else
      render :text => text
    end
  end

  def payonline_decline
    if stringify_json_parameters("#{ENV['API_BASE_URL']}/interpreters_payments/payonline/decline", 'get', params)
      flash[:warning] = "Payment was declined. Please try again or contact support"

      if @is_commission_payment 
        redirect_to "#{ENV["BACKEND_URL"]}/orders/#{@order.id}/new_commission_payment?payment_failed=true"
      else
        render :text => "<script>parent.location.href='#{order_complete_path(@order.id)}';</script>"  
      end
    end
  end

  def paypal_express_checkout
    render nothing: true
    # params[:ip] = request.remote_ip
    # if stringify_json_parameters("#{ENV['API_BASE_URL']}/interpreters_payments/paypal/express_checkout", 'get', params)
    #   redirect_to @url  
    # end
  end

  def paypal_complete
    render nothing: true
    # if stringify_json_parameters("#{ENV['API_BASE_URL']}/interpreters_payments/paypal/complete", 'get', params)
    #   flash[:warning] = @success ? t("flash_messages.payment_success") : t("flash_messages.paypal_payment_declined")
    #   redirect_to order_complete_path(@order.id)
    # end
  end
  
  def bluesnap_sale
    load_order()
    path = if @order.can_change_payment_method?
      order_personal_account_path(@order.id)
    else
      order_complete_path(@order.id)
    end

    if stringify_json_parameters("#{ENV['API_BASE_URL']}/interpreters_payments/bluesnap/order_sale", 'get', params)
      flash[:warning] = @success ? t("flash_messages.payment_success") : t("flash_messages.payment_declined")

      redirect_to path
    end
  end

  def new
    if stringify_json_parameters("#{ENV['API_BASE_URL']}/payments/new", 'get', params)
      add_template_variables
      respond_to do |f|
        f.js 
        f.html { redirect_to @redirect_url }
      end
    end
  end

  def create
    if stringify_json_parameters("#{ENV['API_BASE_URL']}/payments.json", 'post', params)
      respond_to do |f|
        f.html { redirect_to order_complete_path(@order.id) }
      end
    end
  end

  private 

    def add_template_variables
      type = params[:payment_type]
      @partial, @partial_vars, @redirect_url = case type
      when 'card'
        amount, currency = get_amount_and_currency(@order)
        @amount, @currency = amount, currency

        ['payments/bluesnap_card_form', 
          { bluesnap_token: @bluesnap_token, order: @order, payment_amount: amount, payment_currency: currency }, 
          order_complete_path(@order.id)
        ]
      # when 'paypal'
      #   ['payments/paypal_button', {}, paypal_express_checkout_order_path(@order.id)]
      when 'invoice', 'cash'
        ["payments/#{type}", {order: @order}, order_complete_path(@order.id)]
      else 
        ['payments/not_ready', {}, order_complete_path(@order.id)]
      end

      if type == "invoice" and @order.client_currency_code == "RUB"
        @currency_changed_to_eur = true
        @order.client_currency_code = "EUR"
      end
    end 

    def load_order
      @order = Order.find(params[:order_id])
    end

    def generate_braintree_token
      session[:braintree_token] ||= Braintree::ClientToken.generate
      @braintree_token = session[:braintree_token]
    end

    def get_amount_and_currency(order) 
      if order.client_currency_code == "RUB"
        [order.amount_in("EUR"), "EUR"]
      else
        [order.amount_in_client_currency, order.client_currency_code]
      end
    end
end
