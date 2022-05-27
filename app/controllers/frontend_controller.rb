require 'ostruct'
class Bean < OpenStruct
end

class FrontendController < ApplicationController

  def language_selector
    city_id = params[:city_id]
    @search = Bean.new
    @search.city = Bean.new
    @search.city.languages = ["aaa", "bbb"]
    @search.language = Bean.new
    @search.language.id = '1'



    #@search = Search.new
    #@search.city = City.new.find(params[:city_id])
    #@search.language = @search.city.language
    render partial: 'searches/form/language_selector'
  end


  def index
    @search = Bean.new
    @search.city = Bean.new
    @search.city.id = 1
    @search.intervals = []
    @search.city.languages = []
    @search.your_language = Bean.new
    @search.your_language.name = "ru"



    render 'searches/new'
  end
end