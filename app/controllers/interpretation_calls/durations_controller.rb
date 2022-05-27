module InterpretationCalls
  class DurationsController < ApplicationController
    def show
      id = params[:id]
      stringify_json_parameters("#{ENV['API_BASE_URL']}/v1/interpretation_calls/#{id}/duration", 
        'get', auth_params)
      render json: {duration: @duration}
    end
  end
end