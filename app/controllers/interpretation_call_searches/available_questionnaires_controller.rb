module InterpretationCallSearches
  class AvailableQuestionnairesController < ApplicationController
    before_filter :authenticate_user!

    def index
      @search = Search.find(params[:id])
      stringify_json_parameters("#{ENV['API_BASE_URL']}/v1/call_searches/#{@search.id}/available_interpreters", 'get', auth_params)
    end

    private

    def auth_params
      params.merge(internal_api_token: ENV["INTERNAL_API_TOKEN"], user_id: current_user.id)
    end
  end
end