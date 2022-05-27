class InterpretationCallsController < ApplicationController
  before_filter :authenticate_user!

  before_filter :check_search, only: [:new, :create]
  before_filter :find_call, only: [:start, :show]

  def index
    stringify_json_parameters("#{ENV['API_BASE_URL']}/v1/call_searches/languages", 'get', auth_params)
    @calls = current_user.interpretation_calls_as_client.order("created_at" => :desc)
    @your_language = Language.find_by_locale(params[:locale])
  end

  def new
    @questionnaire = Questionnaire.find(params[:questionnaire_id])

    if @search.immediate_call
      post_params = auth_params.merge(interpretation_call: {
        interpreter_id: @questionnaire.id, call_search_id: @search.id
      })

      stringify_json_parameters("#{ENV['API_BASE_URL']}/v1/interpretation_calls", 'post', post_params)

      if @interpretation_call
        redirect_to interpretation_call_path(@interpretation_call.id)
      else 
        render "new"
      end
    end
  end

  def create
    stringify_json_parameters("#{ENV['API_BASE_URL']}/v1/interpretation_calls", 'post', auth_params)
    if @interpretation_call
      redirect_to interpretation_call_path(@interpretation_call.id)
    else 
      redirect_to new_interpretation_call_path(questionnaire_id: @interpretation_call.questionnaire)
    end
  end

  def start
    @call.start
    redirect_to @call
  end

  def show
    @questionnaire = @call.questionnaire
    render "call_in_progress" if @call.state == "in_progress"
    render "completed_call" if @call.state == "completed" || @call.state == "awaiting_payment"
  end

  def complete
    stringify_json_parameters("#{ENV['API_BASE_URL']}/v1/interpretation_calls/#{params[:id]}/complete", 'post', auth_params)
    redirect_to interpretation_calls_path
  end

  def process_payment
    stringify_json_parameters("#{ENV['API_BASE_URL']}/v1/interpretation_calls/#{params[:id]}/payment", 'post', auth_params)
    redirect_to interpretation_call_path(params[:id])
  end

  private 
    def check_search 
      redirect_to interpretation_calls_path unless (@search = current_user.newest_call_search)
    end

    def interpretation_call_params
      {interpreter_id: params[:interpreter_id], client_id: current_user.id}
    end

    def find_call
      @call = current_user.interpretation_calls_as_client.find(params[:id])
    end
end