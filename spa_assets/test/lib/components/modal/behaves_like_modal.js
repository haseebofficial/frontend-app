import { findByTestId } from "test/shared/react";
import Modal from "components/modal";

export function testShowsModal(t, instance) {
  let modal;

  t.doesNotThrow(() => modal = instance.findByType(Modal), "renders modal");

  t.notSame(modal.children, [], "shows modal");
}

export function testHidesModal(t, instance) {
  let modal;

  t.doesNotThrow(() => modal = instance.findByType(Modal), "renders modal");

  t.same(modal.children, [], "hides modal");
}

export function behavesLikeShownModal(t, instance) {
  let modal;

  t.doesNotThrow(() => modal = instance.findByType(Modal), "renders modal");

  t.notSame(modal.children, [], "shows modal");

  findByTestId(modal, "window-cover").props.onClick();
  // t.same(modal.children, [], "hides modal on close");
}