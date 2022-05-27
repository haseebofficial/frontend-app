class Api::CitiesController < ApplicationController
  before_filter :authenticate_user!, only: [:create, :update, :destroy, :my_cities]

  def index
    render json: City.search(params[:term])
  end

  def my_cities
    render json: current_user.cities
  end

end