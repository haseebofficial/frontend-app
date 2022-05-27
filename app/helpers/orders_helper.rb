module OrdersHelper
  SERVICE_PATHS = {}
  mappings = {"Переводчик на презентации" => :presentation, "Переводчик на переговорах" => :conversation, "Переводчик на выставке" => :exhibition, "Переводчик на семинаре или конференции" => :seminar_conference, "Переводчик на торжествах" => :celebrations, "Перевод экскурсий, услуги гида" => :services_guide, "Сопровождение делегаций" => :escort_delegations, "Сопровождение частных лиц" => :support_individuals, "Переводчик по телефону" => :phone_talking, "Переводчик интервью" => :interview, "Переводчик пресс-конференций" => :press_conferences, "Протокольный переводчик" => :protocol_translation, "Судебный переводчик" => :judicial_translation, "Переводчик в клинике" => :clinic_consultation}
  ServiceType.all.each do |t| 
    if path = mappings[t.ru_name]
      SERVICE_PATHS[t.id] = path 
    end
  end

  def cancel_order_text(intervals, min_time)
    tmp = intervals.map{|i| (i.since.to_datetime.to_i - DateTime.now.to_i) / 3600 }.min

    if tmp < min_time
      '<span>Бесплатная отмена заказа:</span> не предусмотрено'.html_safe
    else
      tmp = intervals.map{|i| (i.since.to_datetime)}.min.to_datetime - min_time.hours
      date = l(tmp, format: 'до %d %B %H:%M')
      text = "Возможна бесплатная отмена заказа не позднее, чем до #{date} часов до начала встречи. Отмена заказа позднее этого срока и до начала встречи, возможна только с удержанием оплаты первых двух часов услуг переводчика."
      ("<span class='cancellation' data-text='#{text}'>Бесплатная отмена заказа:</span> #{date}").html_safe
    end

  end

  def service_link(service_type)
    name = l_object(:name, service_type)
    id = service_type.id
    if (path = SERVICE_PATHS[id])
      link_to(name, send("#{path}_path"), target: "_blank")
    else 
      name 
    end
  end

  def aviasales_script_id
    locale = params[:locale].to_s
    case locale 
    when 'en'
      "c5981d2787c4b5f744335eb0348beb0f"
    when 'ru'
      "ef509ad6cb688579bc01c6346675a52e"
    end
  end
end