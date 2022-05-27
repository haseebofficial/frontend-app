class TranslationsController < ActionController::Base
  def show
    locale = params[:locale]

    response.headers["Content-Type"] = "application/json"
    redirect_to ActionController::Base.helpers.asset_path("spa_assets/translations/raw/#{locale}.json")
  end
end