$("#flash").html("<%= j render('shared/flash_messages') %>")
$("html, body").animate({ scrollTop: 100 }, "slow");