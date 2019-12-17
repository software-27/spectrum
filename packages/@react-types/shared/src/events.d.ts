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

export type PointerType = 'mouse' | 'pen' | 'touch' | 'keyboard';

export interface PressEvent {
  type: 'pressstart' | 'pressend' | 'press',
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
  onKeyDown?: (e: KeyboardEvent) => void,
  onKeyUp?: (e: KeyboardEvent) => void
}

export interface FocusEvents {
  onFocus?: (e: FocusEvent) => void,
  onBlur?: (e: FocusEvent) => void,
  onFocusChange?: (isFocused: boolean) => void
}

export interface PressEvents {
  onPress?: (e: PressEvent) => void,
  onPressStart?: (e: PressEvent) => void,
  onPressEnd?: (e: PressEvent) => void,
  onPressChange?: (isPressed: boolean) => void
}

export interface HoverEvents {
  onHover?: (e: HoverEvent) => void,
  onHoverStart?: (e: HoverEvent) => void,
  onHoverEnd?: (e: HoverEvent) => void,
  onShow?: (isHovering: boolean) => void,
  onHoverTooltip?: (isHovering: boolean) => void
}

export interface FocusableProps extends FocusEvents, KeyboardEvents {
  autoFocus?: boolean
}
