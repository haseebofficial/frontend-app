class InterpreterClientTicketsController < InterpretersCommon::InterpreterClientTicketsController
  before_filter :add_amp_origin_headers

  private
    def ticket_created
      flash[:success] = t('flash_messages.interpreter_message_created')
      respond_to do |f|
        f.js { render "create" }
        f.json { render json: {} }
      end
    end

    def creation_fail
      respond_to do |f|
        f.js {render "creation_fail" }
        f.json { render(status: :bad_requeest) }
      end
    end

    def add_amp_origin_headers
      headers["Access-Control-Allow-Origin"] = request.headers["Origin"]
      headers["AMP-Access-Control-Allow-Source-Origin"] = params["__amp_source_origin"]
    end
end