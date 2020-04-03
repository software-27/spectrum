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

import {FocusStrategy, MenuTriggerProps, MenuTriggerState} from '@react-types/menu';
import {useControlledState} from '@react-stately/utils';
import {useState} from 'react';

export function useMenuTriggerState(props: MenuTriggerProps):MenuTriggerState  {
  let [isOpen, setOpen] = useControlledState(props.isOpen, props.defaultOpen || false, props.onOpenChange);
  let [focusStrategy, setFocusStrategy] = useState('first' as FocusStrategy);

  return {
    isOpen, 
    setOpen, 
    focusStrategy, 
    setFocusStrategy
  };
}
