import {classNames, filterDOMProps} from '@react-spectrum/utils';
import {FormProps} from './types';
import React, {forwardRef, RefObject} from 'react';
import styles from '@adobe/spectrum-css-temp/components/fieldlabel/vars.css';

export const Form = forwardRef(({children, className, ...otherProps}: FormProps, ref: RefObject<HTMLFormElement>) => (
  <form
    {...filterDOMProps(otherProps)}
    className={
      classNames(
        styles,
        'spectrum-Form',
        className
      )
    }
    ref={ref}>
    {children}
  </form>
));
