class CallPromosController < ApplicationController
  before_filter :authenticate_user!

  def show
    stringify_json_parameters("#{ENV['API_BASE_URL']}/v1/client_balance_promo_codes/#{params[:id]}", 'get', auth_params)
    redirect_to interpretation_calls_path
  end
end