import {ButtonBase} from './Button';
import {classNames, filterDOMProps} from '@react-spectrum/utils';
import CrossSmall from '@spectrum-icons/ui/CrossSmall';
import {FocusRing} from '@react-aria/focus';
import React, {RefObject, useRef} from 'react';
import styles from '@adobe/spectrum-css-temp/components/button/vars.css';
import {useButton} from '@react-aria/button';

interface ClearButtonProps extends ButtonBase {
  focusClassName?: string,
}

export const ClearButton = React.forwardRef((props: ClearButtonProps, ref: RefObject<HTMLButtonElement>) => {
  let {
    className,
    focusClassName,
    ...otherProps
  } = props;
  ref = ref || useRef();
  let {buttonProps, isPressed} = useButton({...props, ref});

  return (
    <FocusRing focusRingClass={classNames(styles, 'focus-ring', focusClassName)}>
      <button
        {...filterDOMProps(otherProps, {icon: false})}
        {...buttonProps}
        ref={ref}
        className={
          classNames(
            styles,
            'spectrum-ClearButton',
            {
              'is-active': isPressed
            },
            className
          )
        }>
        <CrossSmall />
      </button>
    </FocusRing>
  );
});
