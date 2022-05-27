# Interpreters Travel

## Architecture

- Ruby 2.3
- Rails 4.0
- Database PostgreSQL
- App Server: Puma
- Testing: Rspec/Capybara/Guard/Factory Girl
- Views: HAML/Twitter Bootstrap/Sass/SimpleForm
- Security: Devise/Authority/Rolify
- Debugging: better_errors

## Development Environment

1. Clone form Repository: `git clone -b develop git@gitlab.com/interpreters/frontend.git`
2. Clone form Repository: `git clone -b docker-test git@gitlab.com/interpreters/common.git interpreters_common`
3. Install RVM: `curl -L https://get.rvm.io | bash -s stable`
4. Install Ruby: `rvm install 2.3.7`
5. Open directory: `cd frontend`
6. Add local setup files: `cp config/application.yml.example config/application.yml && cp config/database.yml.example config/database.yml`
7. Install gems: `bundle install`
8. Wake up server: `rails s -b 0.0.0.0 -p 3000 -e development`

## Security

Roles: [admin, client, interpreter, senior_manager, manager, operator, expert, financial_controller, account_manager, promo_manager]
