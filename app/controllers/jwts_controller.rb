class JwtsController < ApplicationController
  skip_before_filter :set_locale
  before_filter :authenticate_user!

  def show
    if stringify_json_parameters("#{ENV['API_BASE_URL']}/v1/users/sessions?refresh_jwt=true", 'post', auth_params)
      render json: { jwt: @jwt, user: @user }
    end
  end
end