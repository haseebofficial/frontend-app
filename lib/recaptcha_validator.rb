module RecaptchaValidator
  Config = {
    site_key: ENV["RECAPTCHA_SITE_KEY"],
    secret_key: ENV["RECAPTCHA_SECRET_KEY"]
  }

  Connection = Faraday.new(url: 'https://www.google.com/recaptcha/api/siteverify') do |conn|
    conn.request :url_encoded
    conn.response :json, :content_type => /\bjson$/
    conn.adapter Faraday.default_adapter
  end

  def self.recaptcha_valid?(recaptcha_response)
    return false if recaptcha_response.blank?

    response = Connection.post('', { secret: Config[:secret_key], response: recaptcha_response })

    Rails.logger.info("Recaptcha response: #{response.status}, #{response.body}")

    if response.success?
      response.body['success']
    else
      false
    end
  end
end
