include Rails.application.routes.url_helpers

namespace :nginx_map do 
  desc "Create nginx map of cacheable pages"
  task :generate => :environment do 
    file_path = Rails.root.join("public/map.conf")
    paths = []

    locales = LocaleUrlsHelper::AVAILABLE_LOCALES

    paths += locales.map {|l| "/#{l}"}

    Search.where(unmodifiable: true).each do |s| 
       paths << search_city_path(s.locale, s.url_city_name_escaped, s)

       ids = s.free_interpreters_ids.split(",") + s.busy_interpreters_ids.split(",") + s.another_interpreters_ids.split(",")
       User.where(id: ids).joins(:questionnaire).where("questionnaires.state = ?", :published).each do |u|
         paths << search_interpreter_city_path(s.locale, s.url_city_name_escaped, s.id, u.id)
       end
     end  

    [:about, :info, :for_clients, :terms_conditions, :services_guide, :escort_delegations, :interview, :clinic_consultation, :press_conferences, :support_individuals, :conversation, :presentation, :protocol_translation, :seminar_conference, :judicial_translation, :phone_talking, :celebrations, :exhibition, :privacy_policy].each do |p|
       paths += locales.map { |l| send("#{p}_path", l) }
    end
    
    File.open(file_path, 'w') do |file| 
      paths.each do |p|
        file.puts("#{p} 1;")
      end
    end
  end
end
