# Change this to your host. See the readme at https://github.com/lassebunk/dynamic_sitemaps
# for examples of multiple hosts and folders.
host "www.interpreters.travel"

sitemap :site do

  protocol = "https"

  url root_url(protocol: protocol), priority: 1.0

  Search.where(unmodifiable: true).each do |s| 
    url(search_city_url(s.locale, s.url_city_name_escaped, s, protocol: protocol), last_mod: s.updated_at)
    ids = s.free_interpreters_ids.split(",") + s.busy_interpreters_ids.split(",") + s.another_interpreters_ids.split(",")
    User.where(id: ids).joins(:questionnaire).where("questionnaires.state = ?", :published).each do |u|
      int_path = search_interpreter_city_path(s.locale, s.url_city_name_escaped, s.id, u.id)
      int_url = search_interpreter_city_url(s.locale, s.url_city_name_escaped, s.id, u.id, protocol: protocol)

      url(int_url)
    end
  end

  locales = LocaleUrlsHelper::AVAILABLE_LOCALES
  [:about, :info, :help_interpreter, :for_clients, :terms_conditions, :services_guide, :escort_delegations, :interview, :clinic_consultation, :press_conferences, :support_individuals, :conversation, :presentation, :protocol_translation, :seminar_conference, :judicial_translation, :phone_talking, :celebrations, :exhibition, :privacy_policy, :support].each do |p|
    locales.each { |l| url(send "#{p}_url", l, protocol: protocol) }
  end

  url new_user_registration_url(protocol: protocol)
end

ping_with "https://#{host}/sitemap.xml"