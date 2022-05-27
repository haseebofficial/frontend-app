class SessionsController < Devise::SessionsController
  def create
    session[:redirect_url] = params[:redirect_url]
    super

    if current_user
      UserSignInIp.add_ip_to_user(current_user, current_user.current_sign_in_ip)
    end
  end
end