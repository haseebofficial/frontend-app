module InterpretationCalls
  class ExternalNumbersController < ApplicationController
    def create
      id = params[:id]
      stringify_json_parameters("#{ENV['API_BASE_URL']}/v1/interpretation_calls/#{id}/external_number", 
        'post', auth_params)
    end
  end
end