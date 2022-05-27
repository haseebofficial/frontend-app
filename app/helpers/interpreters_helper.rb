module InterpretersHelper
  def questionnaire_stars_class(level)
    stars = convert_to_rating(level)
    stars = stars.to_s.gsub(/(\.0)|\./, '')
    "stars_#{stars}"
  end

  def shorten_surname(surname)
    ""
  end

  def convert_to_rating(level)
    stars = if level > 4.75
      5
    elsif level > 3
      level.floor + get_quarter(level)
    elsif level >= 2
      level.floor
    else
      2
    end
  end

  def get_quarter(level)
    decimals = level - level.floor
    (decimals/0.25).ceil * 0.25
  end

  def interpreters_api_url(path, questionnaire:)
    "#{ENV['API_BASE_URL']}/interpreters/#{questionnaire}/#{path}?locale=#{I18n.locale}"
  end
  def interpreters_api_url_with_json_response(path, questionnaire:)
    require 'net/http'
    require 'json'
    url = "#{ENV['API_BASE_URL']}/interpreters/#{questionnaire}/#{path}?locale=#{I18n.locale}"
    uri = URI(url)
    response = Net::HTTP.get(uri)
    JSON.parse(response)
  end
end
