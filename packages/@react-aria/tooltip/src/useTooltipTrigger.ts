import {chain, useId} from '@react-aria/utils';
import {DOMProps} from '@react-types/shared';
import {HoverProps, PressProps} from '@react-aria/interactions';
import {HTMLAttributes, RefObject} from 'react';
import {TooltipProps} from '@react-types/tooltip';
import {TooltipTriggerState} from '@react-stately/tooltip';
import {useHover} from '@react-aria/interactions';
import {useOverlay} from '@react-aria/overlays';

interface TriggerRefProps extends DOMProps, HTMLAttributes<HTMLElement> {
  ref: RefObject<HTMLElement | null>,
}

interface TooltipTriggerProps {
  tooltipProps: TooltipProps,
  triggerProps: TriggerRefProps,
  state: TooltipTriggerState,
  isDisabled: boolean,
  type: string
}

interface TooltipTriggerAria {
  triggerProps: HTMLAttributes<HTMLElement> & PressProps & HoverProps,
  tooltipProps: HTMLAttributes<HTMLElement>
}

export function useTooltipTrigger(props: TooltipTriggerProps): TooltipTriggerAria {
  let tooltipId = useId();
  let triggerId = useId();
  let {
    tooltipProps,
    triggerProps,
    state,
    isDisabled,
    type
  } = props;

  let onClose = () => {
    state.setOpen(false);
  };

  let {overlayProps} = useOverlay({
    ref: triggerProps.ref,
    onClose: onClose,
    isOpen: state.open
  });

  let onKeyDownTrigger = (e) => {
    if (triggerProps.ref && triggerProps.ref.current) {
      // dismiss tooltip on esc key press
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        state.setOpen(false);
      }
    }
  };

  // abstract away knowledge of timing transitions from aria hook
  let tooltipManager = state.tooltipManager;

  let handleDelayedShow = () => {
    if (isDisabled) {
      return;
    }
    let triggerId = triggerProps.ref.current.id;
    tooltipManager.showTooltipDelayed(state, triggerId);
  };

  let handleDelayedHide = () => {
    tooltipManager.hideTooltipDelayed(state);
  };

  let onPress = () => {
    let triggerId = triggerProps.ref.current.id;
    tooltipManager.updateTooltipState(state, triggerId);
  };

  let triggerType = type;

  let {hoverProps} = useHover({
    isDisabled,
    ref: triggerProps.ref,
    onHover: handleDelayedShow,
    onHoverEnd: handleDelayedHide
  });

  return {
    triggerProps: {
      id: triggerId,
      'aria-describedby': tooltipId,
      onKeyDown: chain(triggerProps.onKeyDown, onKeyDownTrigger),
      onPress: triggerType === 'click' ? onPress : undefined,
      ...(triggerType === 'hover' && hoverProps)
    },
    tooltipProps: {
      ...overlayProps,
      ...tooltipProps,
      id: tooltipId
    }
  };
}
