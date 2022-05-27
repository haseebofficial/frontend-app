$("#new_ticket").replaceWith("<%= j render('shared/flash_messages', @vars) %>")
ga("send", "pageview", "#{location.pathname}/new_ticket")