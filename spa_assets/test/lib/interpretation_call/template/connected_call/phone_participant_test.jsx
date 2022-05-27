import test from "tape";
import { toInstance, findByTestId, React } from "test/shared/react";
import { strict } from "test/shared/utils";
import { buildSpyOnce } from "test/shared/mocks";

import PhoneParticipant from "interpretation_call/template/connected_call/phone_participant";

test("InterpretationCall PhoneParticipant 'connected' state", function(t) {
  t.test("required data", function(t) {
    let participantData = strict({state: "connected"});
    let commands = strict({ removeParticipant: buildSpyOnce() });

    t.doesNotThrow(
      () => toInstance(<PhoneParticipant participantData={participantData} commands={commands}/>), 
      "renders participant successfully"
    );
    
    t.end();
  });
  
  t.end();
});

test("InterpretationCall PhoneParticipant 'disconnected' state", function(t) {
  t.test("required data", function(t) {
    let participantData = strict({state: "disconnected"});
    let commands = strict({ addParticipant: buildSpyOnce() });

    t.doesNotThrow(
      () => toInstance(<PhoneParticipant participantData={participantData} commands={commands}/>), 
      "renders participant successfully"
    );
    
    t.end();
  });

  t.test("phone-input", function(t) {
    let participantData = {state: "disconnected"};

    let instance = toInstance(<PhoneParticipant participantData={participantData} commands={{}}/>);
    let input = findByTestId(instance, "phone-input");

    t.equal(input.props.value, "", "sets initial input value to ''");

    input.props.onChange({target: {value: "foobar"}});
    t.equal(input.props.value, "foobar", "changes input value on event");

    t.end();
  });

  t.test("dial buttons", function(t) {
    let participantData = {state: "disconnected"};

    let instance = toInstance(<PhoneParticipant participantData={participantData} commands={{}}/>);

    t.doesNotThrow(() => {    
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "#", "+"].forEach(i => {
        findByTestId(instance, `dial-button-${i}`);
      });
    }, "renders correct dial buttons");

    t.end();
  });

  t.test("dial buttons click", function(t) {
    let participantData = {state: "disconnected"};

    let instance = toInstance(<PhoneParticipant participantData={participantData} commands={{}}/>);
    let input = findByTestId(instance, "phone-input");

    findByTestId(instance, `dial-button-${0}`).props.onClick();

    t.equal(input.props.value, "0", "changes input value");

    t.end();
  });

  t.test("addParticipant command", function(t) {
    let participantData = {state: "disconnected"};
    let commands = { addParticipant: buildSpyOnce() };

    let instance = toInstance(<PhoneParticipant participantData={participantData} commands={commands}/>);
    let addButton = findByTestId(instance, "add-participant");

    findByTestId(instance, `dial-button-${0}`).props.onClick();

    addButton.props.onClick();
    t.same(commands.addParticipant.calledWith, ["0"], "calls removeParticipant with current input value");
    
    t.end();
  });
  
  t.end();
});