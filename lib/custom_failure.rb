class CustomFailure < Devise::FailureApp
  def redirect_url
    new_user_session_url(locale: params[:locale])
  end

  def respond
    if http_auth?
      http_auth
    else
      redirect
    end
  end
end