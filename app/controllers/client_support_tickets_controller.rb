class ClientSupportTicketsController < ApplicationController
  def new
    @ticket = ClientSupportTicket.new
    @ticket.messages.build
  end

  def create
    @ticket = ClientSupportTicket.new(ticket_create_params)
    @ticket.messages.first.send_message_to_client = true
    @ticket.locale = I18n.locale

    captcha_passed = RecaptchaValidator.recaptcha_valid?(params['g-recaptcha-response'])

    if captcha_passed && @ticket.save 
      redirect_to support_path, notice: t('flash_messages.ticket_created')
    else 
      @error_alert = t('flash_messages.invalid_captcha') unless captcha_passed
      render 'new'
    end
  end

  def ticket_create_params
    result = params.require(:client_support_ticket).permit(:name, :city_name, :phone, :email, 
                                                  messages_attributes: [:content]) 
    if current_user
      result.merge!(email: current_user.email, phone: current_user.phone, name: current_user.full_name, city_name: current_user.city.to_s)
    end
    result
  end
end