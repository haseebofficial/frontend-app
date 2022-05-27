module ApplicationHelper
  include CurrencyConverter
  AVAILABLE_CURRENCIES = ["USD", "EUR"]
  def display_base_errors resource
    return '' if (resource.errors.empty?) or (resource.errors[:base].empty?)
    messages = resource.errors[:base].map { |msg| content_tag(:p, msg) }.join
    html = <<-HTML
    <div class="alert alert-error alert-block">
      <button type="button" class="close" data-dismiss="alert">&#215;</button>
      #{messages}
    </div>
    HTML
    html.html_safe
  end

  def yesno(bool)
    bool ? "Yes" : "No"
  end

  def available_currencies
    AVAILABLE_CURRENCIES
  end

  def period_collection
    [:day,:week, :month, :year]
  end
  def is_editing?
    params[:action] == "edit" or params[:action] == "update"
  end

  def full_title(page_title='', delimiter=nil)
    delimiter = "|" if delimiter.blank?
    default_title = 'Interpreters Travel'
    return default_title if page_title == default_title
    title = "#{page_title} #{delimiter} #{default_title}" unless page_title.blank?
    title || default_title
  end

  def content_name(content, default: nil, as_title: true)
    if content_for?(content)
      content
    elsif default and content_for?(default) 
      default
    else
      'Interpreters Travel'
    end
  end
end
