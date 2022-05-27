class InterpretationCallSearchesController < ApplicationController
  before_filter :authenticate_user!
  before_filter :check_search, only: [:new]

  def new
    stringify_json_parameters("#{ENV['API_BASE_URL']}/v1/call_searches/languages", 'get', auth_params)
  end

  # def show
  #   stringify_json_parameters("#{ENV['API_BASE_URL']}/v1/call_searches/#{@search.id}/available_interpreters", 'get', auth_params)
  # end

  def create
    stringify_json_parameters("#{ENV['API_BASE_URL']}/v1/call_searches", 'post', auth_params)
    redirect_to new_call_search_path
  end

  private

    def search_params
      params.require(:search).permit(:call_date, :language_id, :your_language_id, :immediate_call, :call_date)
    end

    def check_search
      @search = current_user.newest_call_search
    end
end