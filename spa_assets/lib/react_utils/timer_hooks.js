import { useEffect, useRef } from "react";

export function useInterval(callback, timeout, opts) {
  useTimer(callback, timeout, opts, {
    setTimer: setInterval,
    clearTimer: clearInterval
  });
}

export function useTimeout(callback, timeout, opts) {
  useTimer(callback, timeout, opts, {
    setTimer: setTimeout,
    clearTimer: clearTimeout
  });
}

function useTimer(callback, interval, opts, {setTimer, clearTimer}) {
  opts = Object.assign({}, {stopped: false}, opts);
  let { stopped } = opts;

  let savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    let executeCallback = () => savedCallback.current();

    if (stopped) {
      return undefined;
    } else {
      let id = setTimer(executeCallback, interval);

      return () => clearTimer(id);
    }
  }, [interval, stopped, setTimer, clearTimer]);
}