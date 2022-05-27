import { useState, useCallback } from "react";

export default function useVisible(initialVal=false) {
  let [isVisible, setIsVisible] = useState(initialVal);
  let show = useCallback(() => setIsVisible(true), []);
  let hide = useCallback(() => setIsVisible(false), []);
  let toggle = useCallback(() => setIsVisible(s => !s), []);

  return { isVisible, show, hide, toggle };
}