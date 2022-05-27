class Api::LanguagesController < ApplicationController
  def index
    render json: Language.search(params[:q])
  end
end