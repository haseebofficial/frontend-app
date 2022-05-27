import "./call_modal.scss"

import React from "react";
import { connect, useSelector } from "react-redux";
import { globalsToProps } from 'utils/globals_context';

import { buildConnect, buildDisconnect, buildToggleMute } from "twilio/deprecated_actions";
import { buildAddParticipant, buildResetCall, buildRemoveParticipant, buildFinishCall } from "./actions";
import {interpretationCall} from "urls/local";
import Fetcher from "fetcher";

import present from "./presenter";
import Modal from "./template/modal";

import {reset} from "../twilio/reducer"
import i18n from 'i18n';

function mapStateToProps(store) {
  return { twilioCall: store.twilioCall };
}

function ModalPropsDelegator(props) {
  let { call, isMuted, thirdParticipant, state } = props.twilioCall;
  let connection = { state, isMuted };
  let participantData = thirdParticipant;
  call = present(call);

  let { dispatch } = props; 
  const fetcher = new Fetcher();
  // let { i18n,  fetcher } = props.globals;

  let commands = {
    connectCall: buildConnect(dispatch, call),
    disconnectCall: buildDisconnect(dispatch),
    toggleMute: buildToggleMute(dispatch),
    addParticipant: buildAddParticipant(dispatch, fetcher, call),
    removeParticipant: buildRemoveParticipant(fetcher, call),
    finishCall: buildFinishCall(interpretationCall.completePath(call)),
    resetCall: buildResetCall(dispatch, call)
  };
  
  return <Modal callData={{connection, participantData, ...call}} {...{commands, i18n}}/>;
}

const ModalWrapper = connect(
  mapStateToProps,
  null
)(
  globalsToProps(ModalPropsDelegator)
);

export default ModalWrapper;