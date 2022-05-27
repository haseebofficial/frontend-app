export function failTestOnReject(t) {
  return function(e) {
    t.fail(`doesn't reject promise with: ${e}`);
  };
}

export function failTestOnResolve(t) {
  return function(r) {
    t.fail(`doesn't resolve promise with: ${JSON.stringify(r)}`);
  };
}

export function finishAsyncActions() {
  return new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
}