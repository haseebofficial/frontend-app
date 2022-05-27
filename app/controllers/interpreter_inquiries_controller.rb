class InterpreterInquiriesController < ApplicationController
  skip_before_filter :set_locale
  before_filter :set_help_interpreter_page_locale
  def create
    if stringify_json_parameters("#{ENV['API_BASE_URL']}/interpreter_create_and_mail", 'post', params)
      if @creation_error.blank?
        redirect_to (help_interpreter_path anchor: "interpreter_form", questionnaire: @interpreter.questionnaire_id, token: @token), notice: t("flash_messages.new_interpreter", email: @interpreter.email)
      else
        redirect_to (help_interpreter_path anchor: "create_new_interpreter"), notice: @creation_error
      end
    end
  end
end