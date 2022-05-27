class PartnersController < ApplicationController

  def create
    if stringify_json_parameters("#{ENV['API_BASE_URL']}/partners", 'post', params)
      if @creation_error.blank?
        redirect_to (for_affiliates_path anchor: "affiliate_form", partner: @user.partner_account_id), notice: t("flash_messages.new_interpreter", email: @user.email)
      else
        redirect_to (for_affiliates_path anchor: "create_new_partner"), notice: @creation_error
      end
    end
  end

end