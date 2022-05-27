import { React, toInstance, Globals } from "test/shared/react";
import Modal from "credit_card/modal";
import { behavesLikeShownModal } from "test/shared/components";
import CreditCard from "resources/credit_card";

export function testShowsModal(t, instance) {
  behavesLikeShownModal(t, instance);
}

export function setupModal({store}) {
  CreditCard.find.mockOnce({credit_card: {}});
  return modalInstance({store});
}

export function modalInstance({store}) {
  return toInstance(<ModalWithGlobals store={store}/>);
}

function ModalWithGlobals(props) {
  return (
    <Globals {...props}>
      <Modal/>
    </Globals>
  );
}