class OrdersController < ApplicationController
  before_filter :authenticate_user!, except: [:new_payment, :new, :create, :complete, :send_sms, :verification_sms_code, :show_to_client, :validate_email]
  before_action :set_order, only: [:new_payment, :show, :edit, :update, :destroy, :cancel, :confirm_replacement]
  skip_before_filter :verify_authenticity_token, only: [:new, :create, :validate_email]
  before_filter :store_order_params, only: [:new, :create]
  before_action :set_default_response_format, only: [:new]

  def validate_email
    @email = params[:email]
    if @email.blank?
      render nothing: true
      return
    end
    @exists_user = User.find_by_email(params[:email])
  end

  # GET /orders
  # GET /orders.json
  def index
    @orders = current_user.orders.joins(:payment)
    render layout: "intranet"
  end

  def show_to_client
    @order = Order.unscoped.find(params[:order_id])
    @notice = 'Order details'
    render layout: "simple"
  end

  # GET /orders/1
  # GET /orders/1.json
  def show
    render layout: "intranet"
  end

  def store_order_params
    # session[:order_params] = params[:order] || session[:order_params]
  end

  # GET /orders/new
  def new
    order = Order.new(order_params)
    search = order.search
    interpreter = order.interpreter
    service = order.service
    if !service and search and interpreter
      return redirect_to search_interpreter_city_path(search.url_city_name_escaped, search.id, interpreter.id, locale: params[:locale])
    elsif (!service or !interpreter) and search
      return redirect_to search_city_path(search.url_city_name_escaped, search.id, locale: params[:locale])
    elsif !search
      return redirect_to root_path
    end

    return unless stringify_json_parameters("#{ENV['API_BASE_URL']}/orders/new_order.json", 'post', params)
    @user = current_user
  end

  # GET /orders/1/edit
  def edit
  end

  # POST /orders
  # POST /orders.json
  def create
    params[:phone_confirmed] = true#session[:phone_confirmed]
    params[:order][:client_currency_code] ||= session[:current_currency]
    params[:order][:locale] = params[:locale]
    params[:order][:partner_account_id] = cookies[:partner_id]

    if request.location
      params[:order][:city_name] ||= request.location.city 
    end

    if current_user
      params[:order][:client_id] = current_user.id
      params[:order].delete(:client_attributes)
    end
    submit_params = params.dup 
    submit_params.delete("X-Requested-With")
    submit_params.delete("X-Http-Accept")
    submit_params.delete('remotipart_submitted')
    return unless stringify_json_parameters("#{ENV['API_BASE_URL']}/orders.json", 'post', submit_params)
    params[:order][:file] = nil
    if @order_errors
      @error = ("Erorrs:<br/>" + @order_errors.join('<br/>')).html_safe
      # Reconstruct request order parameters:
      order_parameters = ActionController::Parameters.new order:
        {
          search_id: params[:order][:search_id],
          interpreter_id: params[:order][:interpreter_id],
          service_id: params[:order][:service_id]
        }
      respond_to do |format|
        format.js { flash.now[:error] = @error; render 'creation_error' }
        format.html { flash[:error] = @error; redirect_to(new_order_path(order_parameters), format: :js)}
      end
      return
    end
    # If success
    respond_to do |format|
      format.js 
      format.html { redirect_to new_payment_path(order_id: @order.id) }
    end
  end

  def complete
    @order = Order.unscoped.where(id: params[:order_id]).first
    if !@order.new?
      return redirect_to order_personal_account_path(@order)
    end
    @payment = @order.payment
    @interpreter = @order.interpreter
    @questionnaire = @interpreter.questionnaire
    @city_and_country = "#{@order.search.city}"
    @language_pair = "#{@order.search.your_language} - #{@order.search.language}"
  end

  # PATCH/PUT /orders/1
  # PATCH/PUT /orders/1.json
  # def update
  #   respond_to do |format|
  #     if @order.update(order_params)
  #       format.html { redirect_to @order, notice: 'Order was successfully updated.' }
  #       format.json { head :no_content }
  #     else
  #       format.html { render action: 'edit' }
  #       format.json { render json: @order.errors, status: :unprocessable_entity }
  #     end
  #   end
  # end

  # DELETE /orders/1
  # DELETE /orders/1.json
  # def destroy
  #   @order.destroy
  #   respond_to do |format|
  #     format.html { redirect_to orders_url }
  #     format.json { head :no_content }
  #   end
  # end

  def send_sms
    params[:sms_code] = session[:sms_code]
    return unless stringify_json_parameters("#{ENV['API_BASE_URL']}/orders/send_sms.json", 'get', params)
    session[:sms_code] = @sms_code  # @sms_code is api response
    session[:phone_number] = params[:number] # displayed on View
    render :json => { phone_number: session[:phone_number] }
  end

  def verification_sms_code
    is_code_valid = params[:verification_code].to_s == session[:sms_code].to_s
    session[:phone_confirmed] = is_code_valid
    render :json => { valid: is_code_valid }
  end

  def confirm_replacement
    if @order.awaiting_client_confirmation? and @order.client == current_user
      stringify_json_parameters("#{ENV['API_BASE_URL']}/orders/confirm_replacement.json", 'post', params)
      redirect_to order_personal_account_path(@order), notice: @message
    end
  end

  def cancel
    if @order.cancellation_possible? and @order.client == current_user
      stringify_json_parameters("#{ENV['API_BASE_URL']}/orders/cancel.json", 'post', params)
    end
    redirect_to order_personal_account_path(@order), notice: @message 
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_order
      @order = Order.unscoped.find(params[:id])
    end


    # Never trust parameters from the scary internet, only allow the white list through.
    def order_params
      params.require(:order).permit(:interpreter_id, :client_id, :operator_id, :search_id, :service_id, :name, :surname, :legal_form,
                                    :inn, :bank_name, :meeting_address, :detail_information, :since, :to, :phone, :company_activity,
                                    :company_address, :reporting_documents, :bik, :settlement_account, :correspondent_account,
                                    address_attributes: [:location, :city_id, :region, :zip],
                                    # card_attributes: [:first_name, :last_name, :brand, :number, :verification_value, :month, :year],
                                    client_attributes: [:name, :surname, :email, :phone, :assigned_full_name])
    end

    def set_default_response_format
      request.format = :html
    end
end
