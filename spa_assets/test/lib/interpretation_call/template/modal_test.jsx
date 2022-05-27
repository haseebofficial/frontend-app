import test from "tape";
import { toInstance, withI18nStub } from "test/shared/react";

import { strict } from "test/shared/utils";

import { testTranslations } from "test/shared/translations";
import Modal from "interpretation_call/template/modal";

test("InterpretationCall template with state === 'finished'", function(t) {
  t.test("with required data", function(t) {
    let callData = strict({ connection: {state: "finished"} });
    let commands  = strict({ finishCall: 1, resetCall: 1 });

    t.doesNotThrow(() => toInstance(withI18nStub(Modal, {callData, commands}), "renders call successfully"));
    
    t.end();
  });

  t.test("i18n", function(t) {
    let callData = { connection: {state: "finished"} };
    testTranslations(Modal, {callData, commands: {}}, {locales: ["en", "ru"], t});
    
    t.end();
  });
  
  t.end();
});

test("InterpretationCall template with state === 'connected'", function(t) {
  t.test("with required data", function(t) {
    let callData = strict({
      connection: {state: "connected", isMuted: false}, duration: 123, paymentAmountEur: 32, participantData: {state: "disconnected"},
      interpreterPhoto: "1", interpreterName: "2"
    });
    let commands = strict({toggleMute: 1, disconnectCall: 2, addParticipant: 3});

    t.doesNotThrow(() => toInstance(withI18nStub(Modal, {callData, commands}), "renders call successfully"));
    
    t.end();
  });

  t.test("i18n", function(t) {
    let callData = { connection: {state: "connected"}, participantData: {} };
    testTranslations(Modal, {callData, commands: {}}, {locales: ["en", "ru"], t});
    
    t.end();
  });

  
  t.end();
});

test("InterpretationCall template with state === 'disconnected'", function(t) {
  t.test("with required data", function(t) {
    let callData = strict({
      connection: {state: "disconnected", isMuted: false},
      interpreterPhoto: "1", interpreterName: "2"
    });
    let commands = strict({connectCall: 1});

    t.doesNotThrow(() => toInstance(withI18nStub(Modal, {callData, commands}), "renders call successfully"));
    
    t.end();
  });

  t.test("i18n", function(t) {
    let callData = { connection: {state: "disconnected"} };
    testTranslations(Modal, {callData, commands: {}}, {locales: ["en", "ru"], t});
    
    t.end();
  });

  
  t.end();
});

test("InterpretationCall template with state === 'ringing'", function(t) {
  t.test("with required data", function(t) {
    let callData = strict({
      connection: {state: "ringing", isMuted: false},
      interpreterPhoto: "1", interpreterName: "2"
    });
    let commands = strict({disconnectCall: 1});

    t.doesNotThrow(() => toInstance(withI18nStub(Modal, {callData, commands}), "renders call successfully"));
    
    t.end();
  });

  t.test("i18n", function(t) {
    let callData = { connection: {state: "ringing"} };
    testTranslations(Modal, {callData, commands: {}}, {locales: ["en", "ru"], t});
    
    t.end();
  });

  t.end();
});