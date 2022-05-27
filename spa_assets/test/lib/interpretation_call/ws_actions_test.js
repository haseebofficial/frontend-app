// import test from "tape";
// import interpretationCallWsActions from "interpretation_call/ws_actions";

// test("interpretation_call/ws_actions", function(t) {
//   t.test("with message: twilio_conference#participant_joined and type 'phone'", function(t) {
//     let notification = { data: { participant: {type: "phone", number: 123}}, message: "twilio_conference#participant_joined" };

//     let action = interpretationCallWsActions(notification);
//     let expectedAction = {type: "TWILIO_UPDATE_THIRD_PARTICIPANT", thirdParticipant: {state: "connected", phone: 123}};
//     t.same(action, expectedAction, "returns TWILIO_UPDATE_THIRD_PARTICIPANT action");
    
//     t.end();
//   });

//   t.test("with message: twilio_conference#participant_joined and 2 participants", function(t) {
//     let notification = { data: { participant: {}, participants_count: 2}, message: "twilio_conference#participant_joined" };

//     let action = interpretationCallWsActions(notification);
//     let expectedAction = {type: "TWILIO_CONNECT"};
//     t.same(action, expectedAction, "returns TWILIO_CONNECT action");
    
//     t.end();
//   });

//   t.test("with message: twilio_conference#participant_joined and non-2 participants", function(t) {
//     let notification = { data: { participant: {}, participants_count: 1}, message: "twilio_conference#participant_joined" };

//     let action = interpretationCallWsActions(notification);
//     t.same(action, undefined, "returns undefined");
    
//     t.end();
//   });

//   t.test("with message: twilio_conference#participant_left and type 'phone'", function(t) {
//     let notification = { data: { participant: {type: "phone"} }, message: "twilio_conference#participant_left" };

//     let action = interpretationCallWsActions(notification);
//     let expectedAction = {type: "TWILIO_UPDATE_THIRD_PARTICIPANT", thirdParticipant: {state: "disconnected"}};
//     t.same(action, expectedAction, "returns remove participant action");
    
//     t.end();
//   });

//   t.test("with message: twilio_conference#participant_left and type not-'phone'", function(t) {
//     let notification = { data: { participant: {type: ""} }, message: "twilio_conference#participant_left" };

//     let action = interpretationCallWsActions(notification);
//     t.same(action, undefined, "returns undefined");
    
//     t.end();
//   });

//   t.test("by default", function(t) {
//     let notification = { data: {}, message: "something else" };

//     let action = interpretationCallWsActions(notification);

//     t.equal(action, undefined, "returns undefined");
    
//     t.end();
//   });
  
//   t.end();
// });