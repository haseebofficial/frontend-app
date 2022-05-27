json.partial! 'search', search: @search

json.interpreters(@search_results) do |i|
  user = i.user
  json.photo i.photo
  json.full_name user.full_name
  json.summary i.summary
  json.price user.main_service.calculate_price(@search.interval_hours)
  json.currency user.main_service.currency
  json.level i.level_to_s
  json.url search_interpreter_url(@search, i, format: :json)
end