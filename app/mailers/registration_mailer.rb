class RegistrationMailer < ActionMailer::Base
  default from: "no-reply@interpreters.travel"

  def notify(user, password)
    @user, @password = user, password

    mail(to: user.email, subject: I18n.t("registration_notify_subject"))
  end
end
