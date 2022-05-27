class TwilioTokensController < ApplicationController
  def show
    stringify_json_parameters("#{ENV['API_BASE_URL']}/v1/twilio_token", 'get', auth_params)
    render json: {twilio_token: @twilio_token}
  end
end