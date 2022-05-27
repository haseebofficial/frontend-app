import { toInstance } from "test/shared/react";

export function testCallsFunctionOnEvent({t, triggerEvent, buildComponent}) {
  let isCalled = false;
  let component = buildComponent(function () { isCalled = true; });
  triggerEvent(component);

  t.true(isCalled, "calls this function when event triggers");
}

export function testTogglesButtonsOnClickAction({ t, findButton, buildInstance, findAllButtons }) {
  let finishAction;
  let action = function ({ onFinish }) { finishAction = onFinish; };
  let instance = buildInstance(action);

  function isAllToggled(toggle) { return findAllButtons(instance).every((i) => i.props.disabled === toggle); }

  t.true(isAllToggled(false), "sets disabled: false by default for all buttons");

  findButton(instance).props.onClick();
  t.true(isAllToggled(true), "disables all buttons on click");

  finishAction && finishAction();
  t.true(isAllToggled(false), "enables all buttons after action is finished");
}

export function testRendersListWithOneItem({ t, instance, ItemType, expectedKey, expectedProps }) {
  let item = instance.findByType(ItemType);

  t.equal(item._fiber.key, expectedKey.toString(), "sets correct key");
  t.same(item.props, expectedProps, "sets expected props");
}

export function testCallsFunctionOnClick({t, buildComponent, findClickTarget}) {
  let isCalled = false;
  let instance = toInstance(buildComponent(function () { isCalled = true; }));

  let target = findClickTarget(instance);

  target.props.onClick && target.props.onClick();

  t.true(isCalled, "calls this function on target click");
}