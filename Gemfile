source 'https://rubygems.org'
gem 'rails', '4.0.13'
gem 'rest-client'
gem 'hashie'
gem 'sass-rails', '~> 5'
gem 'font-awesome-rails'
gem 'uglifier', '>= 1.3.0'
gem 'coffee-rails', '~> 4.0.0'
gem 'jquery-rails'
gem 'jquery-ui-rails', '~> 5.0.5'
gem 'turbolinks', "~> 2.5"
gem 'jbuilder', '~> 1.2'
#gem 'bootstrap-sass', '~> 2.3.2.2'
gem 'figaro'
gem 'haml-rails'
gem 'pg', '~> 0.20.0'
gem 'simple_form', '>= 3.0.0.rc'
gem 'will_paginate', '~> 3.0'
gem 'wkhtmltopdf-binary'
gem 'wicked_pdf'

gem "i18n-js" , :git => 'https://github.com/fnando/i18n-js.git' #github: "fnando/i18n-js"

# Images uploading
gem 'rmagick'     # sudo apt-get update
                  # sudo apt-get install libmagickwand-dev
gem 'carrierwave', "~> 1.1.0"

gem 'kaminari'
gem 'remotipart'
#gem "fog-google"
#gem "google-api-client", "> 0.8.5", "< 0.9"
gem "fog-google"
gem "google-api-client", "~> 0.19.0"
gem "mime-types"

#gem 'thin'
gem 'state_machine'
#gem 'rails_admin'
gem 'nprogress-rails'

gem 'rack-cors', :require => 'rack/cors'

gem 'geocoder', '~> 1.3.1'

gem "dynamic_sitemaps"

gem 'activerecord-session_store', :git => 'https://github.com/rails/activerecord-session_store.git' #github: 'rails/activerecord-session_store'

# Typeahead
gem 'hogan_assets'
gem 'active_model_serializers'

# Payments
gem 'activemerchant'
gem 'braintree'

gem 'whenever'

gem 'faraday', '~> 0.15.0'
gem 'faraday_middleware', '~> 0.14.0'

# # Currency converter
# gem 'money', :require => false
# gem 'eu_central_bank', :require => false

# Security
gem 'rolify'
gem 'authority'
gem 'devise', '3.1.0'

# Deployment
#gem 'lebops', github: 'jlebrijo/lebops'

# Commons from local path:
gem 'interpreters_common', path: '../interpreters_common'

# Commons from latest git repository:
# gem 'interpreters_common', git: 'git@git.interpreters.travel:root/interpreters_common.git', branch: 'alexey_dev', ref: 'f3b25ad12'

gem 'redis-rails', '~> 4'
gem 'connection_pool'
gem 'redis-namespace'
gem 'google-cloud-translate'
gem 'google_translate_diff'
gem 'ratelimit'


group :assets do
  gem 'therubyracer', :platform=>:ruby
end

group :development do
  gem 'pry'
  gem 'better_errors'
  gem 'binding_of_caller', :platforms=>[:mri_19, :mri_20, :rbx]
  gem 'guard', '>=2.1.0'
  gem 'guard-bundler'
  gem 'guard-rails'
  gem 'guard-rspec'
  gem 'html2haml'
  gem 'quiet_assets'
  gem 'rails_layout'
  gem 'rb-fchange', :require=>false
  gem 'rb-fsevent', :require=>false
  gem 'rb-inotify', :require=>false
  gem 'rack-reverse-proxy', require: "rack/reverse_proxy"

  # Documenting
  gem 'ruby-graphviz'  # apt-get install graphviz
  # gem 'debugger
end
group :development, :test do
  gem 'factory_girl_rails', require: false
  gem 'rspec-rails'
end
group :test do
  gem 'capybara'
  gem 'database_cleaner', '1.0.1'
  gem 'email_spec'
end
gem 'puma'
gem 'sprockets-image_compressor'
gem 'newrelic_rpm'
gem 'sentry-raven'
