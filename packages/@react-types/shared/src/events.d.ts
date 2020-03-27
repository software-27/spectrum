/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import {
  FocusEvent as ReactFocusEvent,
  KeyboardEvent as ReactKeyboardEvent,
  SyntheticEvent
} from 'react';

// Event bubbling can be problematic in real-world applications, so the default for React Spectrum components
// is not to propagate. This can be overridden by calling continuePropagation() on the event.
export type BaseEvent<T extends SyntheticEvent> = T & {
  /** @deprecated use continuePropagation */
  stopPropagation(): void,
  continuePropagation(): void
}

export type KeyboardEvent = BaseEvent<ReactKeyboardEvent<any>>;
export type FocusEvent = BaseEvent<ReactFocusEvent<any>>;

export type PointerType = 'mouse' | 'pen' | 'touch' | 'keyboard' | 'virtual';

export interface PressEvent {
  type: 'pressstart' | 'pressend' | 'pressup' | 'press',
  pointerType: PointerType,
  target: HTMLElement,
  shiftKey: boolean,
  ctrlKey: boolean,
  metaKey: boolean
}

export interface HoverEvent {
  type: 'hoverstart' | 'hoverend' | 'hover',
  pointerType: 'mouse' | 'touch' | 'pen',
  target: HTMLElement
}

export interface KeyboardEvents {
  /** Handler that is called when a key is pressed. */
  onKeyDown?: (e: KeyboardEvent) => void,
  /** Handler that is called when a key is released. */
  onKeyUp?: (e: KeyboardEvent) => void
}

export interface FocusEvents {
  /** Handler that is called when the element receives focus. */
  onFocus?: (e: FocusEvent) => void,
  /** Handler that is called when the element loses focus. */
  onBlur?: (e: FocusEvent) => void,
  /** Handler that is called when the element's focus status changes. */
  onFocusChange?: (isFocused: boolean) => void
}

export interface HoverEvents {
  onHover?: (e: HoverEvent) => void,
  onHoverEnd?: (e: HoverEvent) => void,
  onHoverChange?: (isHovering: boolean) => void
}

export interface PressEvents {
  /**
   * Called when the mouse or touch is released
   * @param e A press event
   * @returns nothing
   */
  onPress?: (e: PressEvent) => void,
  onPressStart?: (e: PressEvent) => void,
  onPressEnd?: (e: PressEvent) => void,
  onPressChange?: (isPressed: boolean) => void,
  onPressUp?: (e: PressEvent) => void
}

export interface FocusableProps extends FocusEvents, KeyboardEvents {
  /** Whether the element should receive focus on render */
  autoFocus?: boolean
}
