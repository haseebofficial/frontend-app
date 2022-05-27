CarrierWave.configure do |config|
  config.fog_provider = 'fog/google'                        # required
  config.fog_credentials = {
    provider: 'Google',
#    google_project: ENV["GCP_PROJECT"],
#    google_json_key_string: ENV["GCP_JSON_KEY"],
    google_storage_access_key_id: ENV["GCP_ACCESS_KEY_ID"],
    google_storage_secret_access_key: ENV["GCP_SECRET_ACCESS_KEY"]
  }
  config.fog_directory = ENV["GCP_BUCKET"]
end