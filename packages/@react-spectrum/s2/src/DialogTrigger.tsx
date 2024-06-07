/*
 * Copyright 2024 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import {DialogTrigger as AriaDialogTrigger, DialogTriggerProps as AriaDialogTriggerProps, PopoverProps as AriaPopoverProps} from 'react-aria-components';
import {DialogContext} from './Dialog';

export interface DialogTriggerProps extends AriaDialogTriggerProps, Pick<AriaPopoverProps, 'placement' | 'shouldFlip' | 'isKeyboardDismissDisabled' | 'containerPadding' | 'offset' | 'crossOffset' > {
  /**
   * The type of Dialog that should be rendered. 
   * 
   * @default 'modal'
   */
  type?: 'modal' | 'popover' | 'fullscreen' | 'fullscreenTakeover', // TODO: add tray back in
  /**
   * Whether a popover type Dialog's arrow should be hidden.
   */
  hideArrow?: boolean,
  /**
   * Whether the Dialog is dismissable.
   */
  isDismissable?: boolean
}

/**
 * DialogTrigger serves as a wrapper around a Dialog and its associated trigger, linking the Dialog's
 * open state with the trigger's press state. Additionally, it allows you to customize the type and
 * positioning of the Dialog.
 */
export function DialogTrigger(props: DialogTriggerProps) {
  return (
    <AriaDialogTrigger {...props}>
      <DialogContext.Provider
        value={{
          type: props.type || 'modal',
          hideArrow: props.hideArrow,
          placement: props.placement,
          shouldFlip: props.shouldFlip,
          isDismissable: props.isDismissable,
          isKeyboardDismissDisabled: props.isKeyboardDismissDisabled,
          containerPadding: props.containerPadding,
          offset: props.offset,
          crossOffset: props.crossOffset
        }}>
        {props.children}
      </DialogContext.Provider>
    </AriaDialogTrigger>
  );
}
