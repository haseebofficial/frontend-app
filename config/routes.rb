InterpretersFrontend::Application.routes.draw do
  get "robots.txt" => "home#robots", format: :text, as: :robots
  get "sitemap.xml" => "home#sitemap", format: :xml, as: :sitemap
  get "/404", :to => "errors#error_404"
  get "/500", :to => "errors#error_500"
  put 'translated_review', to: 'client_reviews#translated_review'
  put 'original_review', to: 'client_reviews#original_review'
  
  get "/translations/:locale", to: "translations#show"

  scope "(:locale)", locale: /#{I18n.available_locales.join("|")}/ do
    spa_index = "spa#index"
    get "/spa_login", to: spa_index
    get "/translation", to: spa_index
    get "/translation_orders/new", to: spa_index
    get "/translation_orders/:id", to: spa_index
    get "/translation_orders/:id/completed", to: spa_index

    scope :spa, as: :spa do
      get "/", to: spa_index

      get "/searches", to: spa_index
      get "/searches/:id", to: spa_index
      get "/searches/:search_id/interpreters/:id", to: spa_index

      get "/orders", to: spa_index
      get "/orders/new", to: spa_index
      get "/orders/:id", to: spa_index
      get "/orders/:id/completed", to: spa_index

      get "/interpretation_calls", to: spa_index
      get "/interpretation_calls/new", to: spa_index
      get "/interpretation_calls/:id", to: spa_index

      get "/phone", to: spa_index
    end

    root :to => 'searches#new'

    # TODO: Move it to better place
    # get 'new_translation_order', to: 'translation_requests#new_translation_order', as: :new_translation_order
    # get 'show_translation_order', to: 'translation_requests#show_translation_order', as: :show_translation_order

    resource :personal_account, only: "show" do
      get "orders/:id", action: "show_order", as: :order
      get "orders/:id/voucher", action: :voucher, as: :voucher
      get "orders/:id/receipt", action: :receipt, as: :receipt
      get "orders/:id/invoice", action: :invoice, as: :invoice
      get "orders/:id/request_contacts", action: :request_contacts, as: :request_contacts
      get "searches", action: :searches, as: :searches
    end

    resource :jwt, only: "show"

    resources :call_promos, only: [:show]

    resources :interpretation_calls, only: [:index, :show, :new, :create] do
      member do
        get 'cancel'
        get 'start'
        get "complete"
        get "process_payment"
        scope module: :interpretation_calls do
          resource :duration, only: [:show]
          resource :external_numbers, only: [:create]
        end
      end
    end

    resource :twilio_token, only: [:show]

    resources :call_searches, controller: :interpretation_call_searches, only: [:new, :show, :create] do
      member do
        resources :available_questionnaires, only: [:index], module: :interpretation_call_searches
      end
    end

    resources :interpreter_inquiries, only: [:create]

    resources :partners, only: [:create]

    post 'orders/new', to: 'orders#new', as: :new_order
    get 'orders/new', to: 'orders#new'
    get 'orders/validate_email', to: 'orders#validate_email', as: :validate_email
    resources :orders, except: [:update, :destroy] do
      get 'complete', to: 'orders#complete', as: :complete
      get 'show_to_client', to: 'orders#show_to_client', as: :show_to_client
      member do
        post 'confirm_replacement'
        post 'cancel'
      end
    end

    scope :sms_service do
      post 'send_code', :to => 'orders#send_sms'
      post 'verification_code', :to => 'orders#verification_sms_code'
    end

    get '/searches/language_selector', to: 'searches#language_selector'
    get '/searches/your_language_selector', to: 'searches#your_language_selector'
    get '/searches', to: "searches#create"
    get '/new_partner_search', to: "searches#create"
    get '/amp/searches/update/:id', to: "searches#update", as: "amp_update_search"

    resources :searches do
      get 'partner_search_form', on: :collection
      post '/:id', action: :update, on: :collection
      get 'more_interpreters', to: 'searches#more_interpreters'
      get 'mini_more_interpreters', to: 'searches#mini_more_interpreters'
      get 'interpreter/:interpreter_id', to: 'searches#show_interpreter', as: :interpreter
    end

    resources :payments, only: [:new, :create]

    resources :client_reviews, only: [:update, :index]

    get 'payments/payonline/approve', to: 'payments#payonline_approve'
    get 'payments/payonline/decline', to: 'payments#payonline_decline'
    get 'payments/paypal/express_checkout/:order_id', to: "payments#paypal_express_checkout", as: :paypal_express_checkout_order
    get 'payments/paypal/complete/:order_id', to: 'payments#paypal_complete'
    get 'payments/braintree/sale/:order_id', to: 'payments#braintree_sale', as: :braintree_sale

    get 'payments/bluesnap/sale/:order_id', to: 'payments#bluesnap_sale', as: :bluesnap_sale
    #authenticated :user do
    #  root :to => 'home#dashboard', as: :authenticated_root
    #end

    # get 'dashboard', to: 'home#dashboard'
    get 'help', to: 'home#info'
    get 'help/about', to: 'home#about', as: :about
    get 'help/info', to: 'home#info', as: :info
    get 'help/help_interpreter', to: 'home#help_interpreter', as: :help_interpreter
    get 'interpreter_inquiries', to: 'home#help_interpreter'
    get 'help/for_clients', to: 'home#for_clients', as: :for_clients
    get 'help/for_affiliates', to: 'home#for_affiliates', as: :for_affiliates
    get 'help/terms_conditions', to: 'home#terms_conditions', as: :terms_conditions
    get 'help/services/guide', to: 'home#services_guide', as: :services_guide
    get 'help/services/escort_delegations', to: 'home#escort_delegations', as: :escort_delegations
    get 'help/services/interview', to: 'home#interview', as: :interview
    get 'help/services/clinic_consultation', to: 'home#clinic_consultation', as: :clinic_consultation
    get 'help/services/press_conferences', to: 'home#press_conferences', as: :press_conferences
    get 'help/services/support_individuals', to: 'home#support_individuals', as: :support_individuals
    get 'help/services/conversation', to: 'home#conversation', as: :conversation
    get 'help/services/presentation', to: 'home#presentation', as: :presentation
    get 'help/services/protocol_translation', to: 'home#protocol_translation', as: :protocol_translation
    get 'help/services/seminar_conference', to: 'home#seminar_conference', as: :seminar_conference
    get 'help/services/judicial_translation', to: 'home#judicial_translation', as: :judicial_translation
    get 'help/services/phone_talking', to: 'home#phone_talking', as: :phone_talking
    get 'help/services/celebrations', to: 'home#celebrations', as: :celebrations
    get 'help/services/exhibition', to: 'home#exhibition', as: :exhibition
    get 'help/privacy_policy', to: 'home#privacy_policy', as: :privacy_policy
    get 'help/support', to: 'client_support_tickets#new', as: :support
    get 'phone', to: 'home#phone', as: :phone

    get 'set_locale/:new_locale', to: "home#set_current_locale", as: :set_locale
    get 'set_current_currency/:currency', to: "home#set_current_currency", as: :set_current_currency

    resources :client_support_tickets, only: [:create]
    resources :interpreter_client_tickets, only: [:create]

    devise_for :users, controllers: { registrations: 'registrations', sessions: 'sessions'}

    resources :users
    post 'user_create_and_mail', to: 'users#create_and_mail'
    post 'interpreter_create_and_mail', to: 'interpreters#interpreter_create_and_mail'

    get ':city_name/:id', to: "searches#show", as: :search_city
    get ':city_name/:search_id/interpreter/:interpreter_id', to: "searches#show_interpreter", as: :search_interpreter_city
  end

  namespace :api do
    resources :tokens, only: [:create, :destroy]

    resources :countries, only: [:index] do
      get 'cities', to: 'countries#cities'
    end

    resources :cities do
      get 'interpreters', to: 'cities#interpreters'
    end
    get 'my_cities', to: 'cities#my_cities'


    # LISTS
    resources :service_types, only: [:index, :show]
    resources :languages, only: [:index, :show]
  end

  #get '/uploads/questionnaire/photo/:img/:img', to: redirect('/img/1.png')

end
