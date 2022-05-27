class PersonalAccountsController < ApplicationController
  before_filter :authenticate_user!

  def show
    @orders = current_user.orders
    if @orders.present?
      @orders = @orders.order(confirmation_date: :desc).includes({interpreter: :questionnaire}, :payment,:service_type, :currency)
                       .paginate(page: params[:page], per_page: 5)
    end 
  end

  def show_order
    @order = current_user.orders.find(params[:id])
    @search = @order.search
    @client_review = @order.client_review.try(:request?) ? @order.client_review : nil

    if @client_review and params[:review_score]
      @client_review.update_attribute(:score, params[:review_score]) if (1..5).include?(params[:review_score].to_i)
    end

    @interpreter = @order.interpreter
    @contacts_available = current_user.try(:interpreter_contacts_available?, @interpreter)
    @ticket = InterpreterClientTicket.new(search_id: @search.id)
    @ticket.messages.build
  end

  def request_contacts
    @order = current_user.orders.find(params[:id])
    if @order.can_request_contacts?
      @order.update_attribute(:free_cancellation_date, (Time.now - 1.minute))
    end
    redirect_to order_personal_account_path(@order), notice: t("flash_messages.contacts_requested")
  end

  def voucher
    @order = current_user.orders.find(params[:id])
    if @order.ready_for_presentation?
      respond_to do |format|
        format.pdf { render pdf: "Order ##{@order.id} voucher", template: "common_pdf_templates/voucher.html.erb", layout: false, encoding: "UTF-8" }
      end
    else
      redirect_to order_personal_account_path(@order), alert: I18n.t("voucher_not_ready", scope: :personal_account)
    end
  end

  def receipt
    @order = current_user.orders.find(params[:id])
    if @order.receipt_available?
      respond_to do |format|
        format.pdf { render pdf: "Order ##{@order.id} receipt", template: "common_pdf_templates/receipt.html.erb", layout: false}
      end
    else
      redirect_to order_personal_account_path(@order)
    end
  end

  def invoice
    @order = current_user.orders.find(params[:id])
    if @order.invoice_payment?
      respond_to do |f|
        f.pdf { render pdf: "#Order ##{@order.id} invoice", template: "common_pdf_templates/invoice.html.erb", layout: false}
      end
    else 
      redirect_to order_personal_account_path(@order)
    end
  end

  def searches
    return unless stringify_json_parameters("#{ENV['API_BASE_URL']}/searches/new.json", 'get', params)
    @searches = current_user.searches.order(created_at: :desc)
  end
end
