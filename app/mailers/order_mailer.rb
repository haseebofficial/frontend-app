class OrderMailer < ActionMailer::Base
  layout 'mailer'

  def client_order_notification(order)
    @order = order
    @client = @order.client
    @service = @order.service
    @interpreter = @order.interpreter
    @questionnaire = @interpreter.questionnaire

    mail(to: @client.email, subject: "Вы сделали заказ в interpreters.travel на услугу устного перевода")
  end

  def interpreter_order_notification(order)
    @order = order
    @client = @order.client
    @service = @order.service
    @interpreter = @order.interpreter
    @questionnaire = @interpreter.questionnaire

    if @order.attachment_file
      file_path = Rails.root.join(@order.attachment_file)
      file_name = file_path.basename.to_s.gsub(@order.id.to_s + "_", '')

      attachments[file_name] = File.read(file_path)
    end

    mail(to:@interpreter.email, subject: "Вам поступил заказ #{@order.id} в interpreters.travel на услугу устного перевода")
  end
end