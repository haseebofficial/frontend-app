# This file is used by Rack-based servers to start the application.

require ::File.expand_path('../config/environment',  __FILE__)
run Rails.application

use Rack::Cors do

  allow do
    origins 'https://assets.interpreters.travel', 'https://assets_cp.interpreters.travel'
    resource '*', :headers => :any, :methods => [:get, :post, :options]
  end
end