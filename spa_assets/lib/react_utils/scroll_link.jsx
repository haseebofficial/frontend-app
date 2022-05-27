import React from 'react'
import "react_utils/_styles/scroll_link.scss"
import * as Scroll from "react-scroll";
import { Link, Button, Element, Events, animateScroll as scroll, scrollSpy, scroller } from "react-scroll";

function ScrollLink({children, to, offset=0}) {
    return (
        <Link className="scroll-button-wrapper" to={to} smooth={true} remove={"end"} offset={offset} delay={100} duration={600}>
            {children}
        </Link>
    )
}

function useScroller (blockRef, offset=0, forcedScroll=false) {
    // The size of the working area of the window (Размер рабочей части окна )
    let windowHeight = window.innerHeight

    // The absolute position of the element (Абсолютная позиция элемента)
    let blockScrollBottom = blockRef.current.getBoundingClientRect().bottom + window.pageYOffset

    // Page scroll value (Значение скролла страницы)
    let windowScrollTop = window.pageYOffset

    // Checking the condition, if the element is out of scope, then a scroll will occur
    // (Проверка условия, если элемент находится вне области видимости, то произойдет скролл)
    if(blockScrollBottom > windowScrollTop + windowHeight + offset) {
      scroll.scrollTo(blockScrollBottom - windowHeight + offset)
    } else if (forcedScroll === true) {
        scroll.scrollTo(blockScrollBottom - windowHeight + offset)
    }
}
export function useScrollScreenBottom (blockRef, offset, forcedScroll) {
    setTimeout(() => useScroller(blockRef, offset, forcedScroll), 90)
}

function useScrollerTop (blockRef, offset=0) {
    // The absolute position of the element (Абсолютная позиция элемента)
    let blockScrollBottom = blockRef.current.getBoundingClientRect().top + window.pageYOffset
    
    scroll.scrollTo(blockScrollBottom + offset)
}

export function useScrollElementTop (blockRef, offset) {
    setTimeout(() => useScrollerTop(blockRef, offset), 90)
}

export default ScrollLink
