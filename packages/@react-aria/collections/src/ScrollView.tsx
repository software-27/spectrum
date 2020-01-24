import {flushSync} from 'react-dom';
import React, {CSSProperties, HTMLAttributes, ReactNode, RefObject, useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';
import {Rect, Size} from '@react-stately/collections';

interface ScrollViewProps extends HTMLAttributes<HTMLElement> {
  contentSize: Size,
  visibleRect: Rect,
  onVisibleRectChange: (rect: Rect) => void,
  children: ReactNode,
  innerStyle: CSSProperties
}

function ScrollView(props: ScrollViewProps, ref: RefObject<HTMLDivElement>) {
  let {
    contentSize, 
    visibleRect, 
    onVisibleRectChange, 
    children, 
    innerStyle,
    ...otherProps
  } = props;

  let defaultRef = useRef();
  ref = ref || defaultRef;
  let state = useRef({
    scrollTop: 0,
    scrollLeft: 0,
    scrollEndTime: 0,
    scrollTimeout: null,
    width: 0,
    height: 0
  }).current;

  let [isScrolling, setScrolling] = useState(false);
  let onScroll = useCallback((e) => {
    flushSync(() => {
      state.scrollTop = e.currentTarget.scrollTop;
      state.scrollLeft = e.currentTarget.scrollLeft;
      onVisibleRectChange(new Rect(state.scrollLeft, state.scrollTop, state.width, state.height));

      if (!isScrolling) {
        setScrolling(true);
      }

      // So we don't constantly call clearTimeout and setTimeout,
      // keep track of the current timeout time and only reschedule
      // the timer when it is getting close.
      let now = Date.now();
      if (state.scrollEndTime <= now + 50) {
        state.scrollEndTime = now + 300;

        clearTimeout(state.scrollTimeout);
        state.scrollTimeout = setTimeout(() => {
          setScrolling(false);
          state.scrollTimeout = null;
        }, 300);
      }
    });
  }, [isScrolling, onVisibleRectChange, state.height, state.scrollEndTime, state.scrollLeft, state.scrollTimeout, state.scrollTop, state.width]);

  useEffect(() => {
    // TODO: resize observer
    // https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver
    let updateSize = () => {
      let dom = ref.current;
      if (!dom) {
        return;
      }

      let w = dom.offsetWidth;
      let h = dom.offsetHeight;

      if (state.width !== w || state.height !== h) {
        state.width = w;
        state.height = h;
        onVisibleRectChange(new Rect(state.scrollLeft, state.scrollTop, w, h));
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize, false);
    return () => {
      window.removeEventListener('resize', updateSize, false);
    };
  }, [onVisibleRectChange, ref, state.height, state.scrollLeft, state.scrollTop, state.width]);

  useLayoutEffect(() => {
    let dom = ref.current;
    if (!dom) {
      return;
    }

    if (visibleRect.x !== state.scrollLeft) {
      state.scrollLeft = visibleRect.x;
      dom.scrollLeft = visibleRect.x;
    }

    if (visibleRect.y !== state.scrollTop) {
      state.scrollTop = visibleRect.y;
      dom.scrollTop = visibleRect.y;
    }
  }, [ref, state.scrollLeft, state.scrollTop, visibleRect.x, visibleRect.y]);

  return (
    <div {...otherProps} style={{position: 'relative', overflow: 'auto'}} ref={ref} onScroll={onScroll}>
      <div style={{width: contentSize.width, height: contentSize.height, pointerEvents: isScrolling ? 'none' : 'auto', ...innerStyle}}>
        {children}
      </div>
    </div>
  );
}

const ScrollViewForwardRef = React.forwardRef(ScrollView);
export {ScrollViewForwardRef as ScrollView};
