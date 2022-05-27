class RegistrationsController < Devise::RegistrationsController
  before_filter :update_sanitized_params, if: :devise_controller?

  def update_sanitized_params
    devise_parameter_sanitizer.for(:sign_up) {|u| u.permit(:name, :surname, :middle_name, :email, :password, :password_confirmation)}
    devise_parameter_sanitizer.for(:account_update) {|u| u.permit(:email, :password, :password_confirmation, :current_password)}
  end

  def new
    super
  end

  def create
    build_resource(sign_up_params)

    if resource.save
      # By default user is registered as Client
      resource.add_role :client
      if resource.active_for_authentication?
        set_flash_message :notice, :signed_up if is_navigational_format?
        sign_up(resource_name, resource)

        if params[:is_phone_signup] 
          respond_with resource, :location => interpretation_calls_path
        else
          respond_with resource, :location => after_sign_up_path_for(resource)
        end
      else
        set_flash_message :notice, :"signed_up_but_#{resource.inactive_message}" if is_navigational_format?
        expire_session_data_after_sign_in!
        respond_with resource, :location => after_inactive_sign_up_path_for(resource)
      end
      RegistrationMailer.notify(resource, params[:user][:password]).deliver

    else
      clean_up_passwords resource
      respond_with resource
    end
  end

  def update
    super
  end
end
