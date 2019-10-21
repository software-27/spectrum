import {classNames} from '@react-spectrum/utils';
import React, {ReactNode, RefObject, useRef} from 'react';
import styles from '@adobe/spectrum-css-temp/components/tooltip/vars.css';

interface TooltipProps {
  children: ReactNode,
  variant?: 'neutral' | 'positive' | 'negative' | 'info',
  showIcon?: boolean
}

export const Tooltip = React.forwardRef((props: TooltipProps, ref: RefObject<HTMLDivElement>) => {
  ref = ref || useRef();

  return (
    <div
      className={classNames(
        styles,
        'spectrum-Tooltip', 'is-open'
      )}
      ref={ref}>
      {props.children && (
        <span className={classNames(styles, 'spectrum-Tooltip-label')}>
          {props.children}
        </span>
      )}
    </div>
  );
});
