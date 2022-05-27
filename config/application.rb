require File.expand_path('../boot', __FILE__)

require 'rails/all'

#require 'action_controller/railtie'
require 'sprockets/railtie'


# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(:default, Rails.env)

module InterpretersFrontend
  class Application < Rails::Application
    config.middleware.use I18n::JS::Middleware

    # don't generate RSpec tests for views and helpers
    config.generators do |g|

      g.test_framework :rspec, fixture: true
      g.fixture_replacement :factory_girl, dir: 'spec/factories'


      g.view_specs false
      g.helper_specs false
    end
    # Load own classes
    config.autoload_paths += %W(#{config.root}/lib)
    config.i18n.load_path += Dir[Rails.root.join('config', 'locales', '**', '*.{rb,yml}')]
    #I18n.load_path += Dir[Rails.root.join('config', 'locales','ru', '*.yml')]
    # Set default locale
    config.i18n.enforce_available_locales = false
    I18n.enforce_available_locales = false
    I18n.default_locale = :en

    if Rails.env.development?
      config.middleware.insert(0, Rack::ReverseProxy) do
        reverse_proxy_options preserve_host: true
        reverse_proxy '/api/v2', 'http://localhost:4000'
      end
    end

    # !!! Dont set available locales here, do it in LocaleUrlsHelper instead
    # I18n.available_locales = [:ru, :en, :de]

    config.assets.initialize_on_precompile = true
    config.exceptions_app = self.routes

    config.assets.precompile << 'amp/application.scss'

    # rails will fallback to en, no matter what is set as config.i18n.default_locale
    config.i18n.fallbacks = [:en]

    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    # Set Time.zone default to the specified zone and make Active Record auto-convert to this zone.
    # Run "rake -D time" for a list of tasks for finding time zone names. Default is UTC.
    # config.time_zone = 'Central Time (US & Canada)'

    # The default locale is :en and all translations from config/locales/*.rb,yml are auto loaded.
    # config.i18n.load_path += Dir[Rails.root.join('my', 'locales', '*.{rb,yml}').to_s]
    # config.i18n.default_locale = :de

    config.cache_store = :redis_store, "redis://redis:6379/15", { expires_in: 7.days }
  end
end
