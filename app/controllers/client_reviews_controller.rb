class ClientReviewsController < ApplicationController
  before_filter :authenticate_user!, only: :update
  def update
    @review = current_user.client_reviews.requested.find(params[:id])
    if @review.update_attributes(review_params)
      @review.fill
      respond_to do |f|
        f.js
      end
    else
      respond_to do |f|
        f.js { render 'update_fail' }
      end
    end
  end

  def index
    @questionnaire = Questionnaire.find(params[:questionnaire_id])
    @client_reviews = @questionnaire.client_reviews.published.paginate(page: params[:page], per_page: 5)
    respond_to do |f|
      f.js
      f.html { @client_reviews = @questionnaire.client_reviews.published; @all_shown = true }
    end
  end

  def translated_review
    @review_id = params[:review_id]
    @review = ClientReview.find_by(id: @review_id)
    @translated_review = GoogleTranslateDiff.translate(@review.comment, from: @review.locale.to_s, to: I18n.locale.to_s)
    respond_to do |format|
      format.js { render 'translated_review' }
    end
  end

  def original_review
    @review_id = params[:review_id]
    @original_review = ClientReview.find_by(id: @review_id)
    respond_to do |format|
      format.js { render 'original_review' }
    end
  end

  private
    def review_params
      params.require(:client_review).permit(:score, :interpretation_score, :punctuality_score, :consultation_score, :comment)
    end
end
