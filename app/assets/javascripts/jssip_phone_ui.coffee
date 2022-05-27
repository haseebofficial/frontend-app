#= require "interpreters_common/jssip3.min"
#= require "interpreters_common/jssip_phone"

window.JsSIPPhoneUI = (params) ->
  phone = params.phone
  messages = params.messages
  conferenceId = params.conferenceId

  interpreterConnectionID = params.interpreterConnectionID
  $callButton = $(".button-timer-wrapper .call-button.call")
  $hangupButton = $(".button-timer-wrapper .call-button.hangup")

  showNotification = (message, addition, duration=5000) ->
    if text = messages[message]
      text = text.call(addition) if typeof(text) is "function"
      $("div.jGrowl").jGrowl("close");
      $.jGrowl(text, {position: 'bottom-right', life: duration});   

  resetHangupButton = ->
    $callButton.hide().off()
    $hangupButton.off().show().click(terminateAllSessions)

  resetCallButton = ->
    $hangupButton.hide().off()

    $callButton.off().removeClass("shaking").show().click(callConferenceOnce)

  terminateAllSessions = ->
    phone.terminateAllSessions()
    resetCallButton()

  callConferenceOnce = ->
    phone.callConference(conferenceId)
    $callButton.off()

  getConnectionElem = (connectionID) ->
    console.log connectionID
    elem = null
    $(".connection-bar").each ->
      id = $(this).data("connectionid")
      return elem =  $(this) if "#{id}" == "#{connectionID}"
    elem

  animateConnection = (direction, connectionID) ->
    $bar = getConnectionElem(connectionID)

    dots = $bar.css("visibility", "visible").removeClass("connected").addClass("connecting").find(".dot").get()

    if direction == 'left'
      dots.reverse()

    lightDots = ->
      $(dots).removeClass("connecting")
      $(dots).each (i) -> 
        setTimeout((=> $(this).addClass("connecting")), 100*i)

    lightDots()

    i = setInterval(lightDots, $(dots).length*100+150)
    i

  phone.on "uaregistered", ->
    resetCallButton()

  phone.on "uadisconnected", ->
    $callButton.hide()
    $hangupButton.hide()

    $callButton.off()
    $hangupButton.off()

  hideConnectionLine = (connectionID) ->
    $elem = getConnectionElem(connectionID)
    unless connectionID
      $elem = $(".connection-bar")
      console.log connectionIntervalIds
      $(Object.keys connectionIntervalIds).each -> (clearInterval(connectionIntervalIds[this]); console.log this)
    else 
      clearInterval(connectionIntervalIds[connectionID])

    $elem.css("visibility", "hidden")

  displayConnection = (connectionID) ->
    clearInterval(connectionIntervalIds[connectionID])
    console.log("Connected!")
    getConnectionElem(connectionID).removeClass("disconnected").addClass("connected")

  displayLostConnection = (connectionID) ->
    getConnectionElem(connectionID).removeClass("connected").addClass("disconnected")

  connectionIntervalIds = {}

  phone.on "connecting_outgoing", ->
    resetHangupButton()
    connectionIntervalIds[interpreterConnectionID]  = animateConnection("left", interpreterConnectionID)

  phone.on "incoming_call_answered", ->
    console.log("Call accepted")
    displayConnection(interpreterConnectionID)
    enablePhoneFormOnce()

  phone.on "session_ended", ->
    resetCallButton()
    hideConnectionLine()
    resetPhoneForm()
    $phoneParticipant.css('visibility', 'hidden');
    phone.on("user_connected", enablePhoneFormOnce)

  phone.on "user_connected", (connectionID) ->
    console.log "Connected #{connectionID}"
    displayConnection(connectionID)

  phone.on "user_disconnected", (connectionID) ->
    displayLostConnection(connectionID)

  phone.on "outgoing_media_denied", ->
    showNotification("media_denied")
    resetCallButton()

  phone.on "session_failed", (reason) ->
    hideConnectionLine()
    resetCallButton()
    showNotification("session_failed", reason)

  phone.on "incoming_call", ->
    resetCallButton()
    $callButton.off()
    $callButton.addClass("shaking")

    connectionIntervalIds[interpreterConnectionID] = animateConnection(null, interpreterConnectionID)

    $callButton.click ->
      phone.answerIncomingSession()

  phone.on "incoming_call_answered", ->
    resetHangupButton()

  # External phone number form 

  $phoneParticipant     = $("#phone-participant")
  $callPhoneButton      = $("#phone-participant").find(".call-button.call")
  $hangupPhoneButton    = $("#phone-participant").find(".call-button.hangup")
  $phoneForm            = $("#phone-participant").find("form.phone-form")
  $phoneConnectionLine  = $("#connection-phone")
  phoneCallInProgress   = false
  currentExternalNumber = null

  enablePhoneFormOnce = ->
    $phoneParticipant.css('visibility', 'visible');
    console.log("123")
    phone.off("user_connected", enablePhoneFormOnce)

  phone.on("user_connected", enablePhoneFormOnce)


  $callPhoneButton.on("click", (e) -> ( e.preventDefault(); $phoneForm.submit() ))

  $phoneForm.on("submit", (e) ->
    e.preventDefault();
    number = $phoneForm.find("input").val()
    return false if !phone.isConnectedToConference() or phoneCallInProgress or !number
    unless /^\+\d+$/.test(number)
      showNotification("wrong_number_format")
      return false

    console.log("Foobar")
    currentExternalNumber = number.replace("+", '')
    phone.conferenceAddExternalNumber(currentExternalNumber)

    $phoneForm.find("input.number-input").hide()
    $phoneForm.find(".number").text(number).show()
    $callPhoneButton.hide()
    $hangupPhoneButton.show()
    $phoneConnectionLine.data("connectionid", currentExternalNumber)

    connectionIntervalIds[currentExternalNumber]  = animateConnection(null, currentExternalNumber)

    phoneCallInProgress = true
  );

  $hangupPhoneButton.on "click", (e) ->
    e.preventDefault()

    phone.conferenceRemoveExternalNumber(currentExternalNumber)
    displayLostConnection(currentExternalNumber)
    phoneCallInProgress = false

    resetPhoneForm()

  resetPhoneForm = ->

    $phoneForm.find(".number").hide()
    $phoneForm.find("input.number-input").show()
    $hangupPhoneButton.hide()
    $callPhoneButton.show()

    phone.on("user_connected", enablePhoneFormOnce)
