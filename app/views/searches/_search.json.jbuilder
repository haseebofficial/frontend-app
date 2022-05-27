json.city do
  json.id search.city.id
  json.name search.city.name
end
json.extract! search, :since, :to
json.languages(search.languages) do |lang|
  json.id lang.id
  json.name lang.name
end
json.url search_url(search, format: :json)