user = @interpreter.user
json.photo @interpreter.photo
json.full_name user.full_name
json.main_city do
  json.id @interpreter.main_city.id
  json.name @interpreter.main_city.name
end
json.selected_period @search.selected_period
json.summary @interpreter.summary
json.price user.main_service.calculate_price(@search.interval_hours)
json.currency user.main_service.currency
json.level @interpreter.level_to_s
json.url search_interpreter_url(@search, @interpreter, format: :json)
