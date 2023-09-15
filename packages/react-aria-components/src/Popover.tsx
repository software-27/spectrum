/*
 * Copyright 2022 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import {AriaPopoverProps, DismissButton, Overlay, PlacementAxis, PositionProps, usePopover} from 'react-aria';
import {ContextValue, forwardRefType, HiddenContext, RenderProps, SlotProps, useContextProps, useEnterAnimation, useExitAnimation, useRenderProps} from './utils';
import {filterDOMProps, mergeProps} from '@react-aria/utils';
import {OverlayArrowContext} from './OverlayArrow';
import {OverlayTriggerProps, OverlayTriggerState, useOverlayTriggerState} from 'react-stately';
import {OverlayTriggerStateContext} from './Dialog';
import React, {createContext, ForwardedRef, forwardRef, RefObject, useContext} from 'react';

export interface PopoverProps extends Omit<PositionProps, 'isOpen'>, Omit<AriaPopoverProps, 'popoverRef' | 'triggerRef'>, OverlayTriggerProps, RenderProps<PopoverRenderProps>, SlotProps {
  /**
   * The ref for the element which the popover positions itself with respect to.
   *
   * When used within a trigger component such as DialogTrigger, MenuTrigger, Select, etc.,
   * this is set automatically. It is only required when used standalone.
   */
  triggerRef?: RefObject<Element>
}

export interface PopoverRenderProps {
  /**
   * The placement of the popover relative to the trigger.
   * @selector [data-placement="left | right | top | bottom"]
   */
  placement: PlacementAxis,
  /**
   * Whether the popover is currently entering. Use this to apply animations.
   * @selector [data-entering]
   */
  isEntering: boolean,
  /**
   * Whether the popover is currently exiting. Use this to apply animations.
   * @selector [data-exiting]
   */
  isExiting: boolean
}

export const PopoverContext = createContext<ContextValue<PopoverProps, HTMLElement>>(null);

function Popover(props: PopoverProps, ref: ForwardedRef<HTMLElement>) {
  [props, ref] = useContextProps(props, ref, PopoverContext);
  let contextState = useContext(OverlayTriggerStateContext);
  let localState = useOverlayTriggerState(props);
  let state = props.isOpen != null || props.defaultOpen != null || !contextState ? localState : contextState;
  let isExiting = useExitAnimation(ref, state.isOpen);
  let isHidden = useContext(HiddenContext);

  // If we are in a hidden tree, we still need to preserve our children.
  if (isHidden) {
    let children = props.children;
    if (typeof children === 'function') {
      children = children({
        placement: 'bottom',
        isEntering: false,
        isExiting: false
      });
    }

    return <>{children}</>;
  }

  if (state && !state.isOpen && !isExiting) {
    return null;
  }

  return (
    <PopoverInner
      {...props}
      triggerRef={props.triggerRef!}
      state={state}
      popoverRef={ref}
      isExiting={isExiting} />
  );
}

/**
 * A popover is an overlay element positioned relative to a trigger.
 */
const _Popover = /*#__PURE__*/ (forwardRef as forwardRefType)(Popover);
export {_Popover as Popover};

interface PopoverInnerProps extends AriaPopoverProps, RenderProps<PopoverRenderProps>, SlotProps {
  state: OverlayTriggerState,
  isExiting: boolean
}

function PopoverInner({state, isExiting, ...props}: PopoverInnerProps) {
  let {popoverProps, underlayProps, arrowProps, placement} = usePopover({
    ...props,
    offset: props.offset ?? 8
  }, state);

  let ref = props.popoverRef as RefObject<HTMLDivElement>;
  let isEntering = useEnterAnimation(ref, !!placement);
  let renderProps = useRenderProps({
    ...props,
    defaultClassName: 'react-aria-Popover',
    values: {
      placement,
      isEntering,
      isExiting
    }
  });

  let style = {...renderProps.style, ...popoverProps.style};

  return (
    <Overlay isExiting={isExiting}>
      {!props.isNonModal && <div {...underlayProps} style={{position: 'fixed', inset: 0}} />}
      <div
        {...mergeProps(filterDOMProps(props as any), popoverProps)}
        {...renderProps}
        ref={ref}
        slot={props.slot || undefined}
        style={style}
        data-placement={placement}
        data-entering={isEntering || undefined}
        data-exiting={isExiting || undefined}>
        {!props.isNonModal && <DismissButton onDismiss={state.close} />}
        <OverlayArrowContext.Provider value={{...arrowProps, placement}}>
          {renderProps.children}
        </OverlayArrowContext.Provider>
        <DismissButton onDismiss={state.close} />
      </div>
    </Overlay>
  );
}
