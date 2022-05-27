module SearchesHelper
  def interpreters_counter
    Questionnaire.count
  end
  def cities_counter
    Questionnaire.select(:main_city_id).distinct.count
  end
  def countries_counter
    Questionnaire.select("countries.id").joins(main_city: [:country]).distinct.count
  end
  # def searches_language_selector_path
  #   '/searches/language_selector'
  # end
  # def search_path(search_id)
  #   '/searches/' + search_id.to_s
  # end
  # def search_interpreter_path(search_id, interpreter_id)
  #   '/searches/' + search_id.to_s + '/interpreter/' + interpreter_id.to_s
  # end


end