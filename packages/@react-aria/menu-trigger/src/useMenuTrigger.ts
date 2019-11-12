import {AllHTMLAttributes, RefObject} from 'react';
import {chain} from '@react-aria/utils';
import {DOMProps} from '@react-types/shared';
import {PressProps} from '@react-aria/interactions';
import {useId} from '@react-aria/utils';
import {useOverlayTrigger} from '@react-aria/overlays';


type MenuRole = 'dialog' | 'menu' | 'listbox' | 'tree' | 'grid';

interface MenuProps extends DOMProps {
  type: MenuRole,
  onClose?: () => void,
  role?: MenuRole
}

interface TriggerProps extends DOMProps, PressProps, AllHTMLAttributes<HTMLElement> {
  ref: RefObject<HTMLElement | null>,
}

interface MenuTriggerState {
  isOpen: boolean,
  setOpen(value: boolean): void
}

interface MenuTriggerProps {
  menuProps: MenuProps,
  triggerProps: TriggerProps,
  state: MenuTriggerState
}

interface MenuTriggerAria {
  menuTriggerProps: AllHTMLAttributes<HTMLElement> & PressProps,
  menuProps: AllHTMLAttributes<HTMLElement>
}

export function useMenuTrigger(props: MenuTriggerProps): MenuTriggerAria {
  let {
    menuProps,
    triggerProps,
    state
  } = props;

  let menuTriggerId = useId(triggerProps.id);
  let {triggerAriaProps, overlayAriaProps} = useOverlayTrigger({
    ref: triggerProps.ref,
    type: menuProps.type,
    id: menuProps.id,
    onClose: menuProps.onClose,
    isOpen: state.isOpen
  });


  let onPress = (e) => {
    if (e.pointerType !== 'keyboard') {
      state.setOpen(!state.isOpen);
    }
  };

  let onKeyDownTrigger = (e) => {
    if ((typeof e.isDefaultPrevented === 'function' && e.isDefaultPrevented()) || e.defaultPrevented) {
      return;
    }

    if (triggerProps.ref && triggerProps.ref.current) {
      switch (e.key) {
        case 'Enter': 
        case 'ArrowDown':
        case 'ArrowUp':
        case ' ':
          e.preventDefault();
          e.stopPropagation();
          onPress(e);
          break;
      }
    }
  };

  return {
    menuTriggerProps: {
      ...triggerAriaProps,
      id: menuTriggerId,
      'aria-haspopup': triggerProps['aria-haspopup'] || menuProps.role || 'true',
      role: 'button',
      type: 'button',
      onPress,
      onKeyDown: chain(triggerProps.onKeyDown, onKeyDownTrigger)
    },
    menuProps: {
      ...overlayAriaProps,
      'aria-labelledby': menuProps['aria-labelledby'] || menuTriggerId,
      role: menuProps.role || 'menu'
    }
  };
}
