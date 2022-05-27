module HomeHelper
  # You can specify array of images which will be rendered in order or number of images to render. Make sure to add required files in assets/images/help/img/#{locale}/YourImageName#{number}.jpg
  # For example: Search1.jpg, Search2.jpg, Search3.jpg will be rendered for {search: 3} 
  # There are different images for each locale, you can see the translations in config/help_pages.locale.yml
  HELP_PAGE_IMAGES = {
    ru: {search: 3, filter: 5, view: 3, order: 7, payment: ['MastercardVISA.jpg', 'Payment1.jpg', 'bank.jpg', "Payment2.jpg", 'helper_ico_01.png', 'helper_ico_02.png', 'helper_ico_03.png', "Payment3.jpg", "Payment4.jpg", "Payment5.jpg"], cabinet: 2},
    en: {search: 3, filter: 5, view: 3, order: 6, payment: ['MastercardVISA.jpg', 'Payment1.jpg', 'bank.jpg', "Payment2.jpg", 'helper_ico_01.png', 'helper_ico_02.png'], cabinet: 2},
    de: {search: 3, filter: 5, view: 3, order: 6, payment: ['MastercardVISA.jpg', 'Payment1.png', 'bank.jpg', "Payment2.png", 'helper_ico_01.png', 'helper_ico_02.png'], cabinet: 2},
    zh: {search: 3, filter: 5, view: 3, order: 6, payment: ['MastercardVISA.jpg', 'Payment1.jpg', 'bank.jpg', "Payment2.jpg", 'helper_ico_01.png', 'helper_ico_02.png'], cabinet: 2},
    fr: {search: 3, filter: 5, view: 3, order: 6, payment: ['MastercardVISA.jpg', 'Payment1.jpg', 'bank.jpg', "Payment2.jpg", 'helper_ico_01.png', 'helper_ico_02.png'], cabinet: 2},
    es: {search: 3, filter: 5, view: 3, order: 6, payment: ['MastercardVISA.jpg', 'Payment1.jpg', 'bank.jpg', "Payment2.jpg", 'helper_ico_01.png', 'helper_ico_02.png'], cabinet: 2},
    it: {search: 3, filter: 5, view: 3, order: 6, payment: ['MastercardVISA.jpg', 'Payment1.jpg', 'bank.jpg', "Payment2.jpg", 'helper_ico_01.png', 'helper_ico_02.png'], cabinet: 2}

  }

  HELP_PAGE_IMAGES.each do |locale,hash| 
    directory = "help/img/#{locale}"
    hash.each do |k, v|
      new_value = if v.is_a?(Array)
        v.map {|img| "#{directory}/#{img}"}
      else 
        images = []
        img_path = "#{directory}/#{k.to_s.capitalize}"
        v.times {|t| images << "#{img_path}#{t+1}.jpg"}
        images
      end
      hash[k] = new_value
    end
  end

  def resource_name
    :user
  end

  def resource
    @resource ||= User.new
  end

  def devise_mapping
    @devise_mapping ||= Devise.mappings[:user]
  end

  def active_link_to(link_text, link_path, my_action_name)
    if action_name.eql? my_action_name
      content_tag :li, class: 'current' do
        link_to link_text, link_path
      end
    else
      content_tag :li do
        link_to link_text, link_path
      end
    end
  end

  def help_page_images
    HELP_PAGE_IMAGES[I18n.locale] || HELP_PAGE_IMAGES[:en]
  end

end