import {DOMProps, ViewStyleProps} from '@react-types/shared';
import {filterDOMProps, useStyleProps} from '@react-spectrum/utils';
import {HTMLElement} from 'react-dom';
import React, {ReactElement, RefObject} from 'react';

export interface FooterProps extends DOMProps, ViewStyleProps {
  children: ReactElement | ReactElement[]
}

export const Footer = React.forwardRef((props: FooterProps, ref: RefObject<HTMLElement>) => {
  let {
    children,
    ...otherProps
  } = props;
  let {styleProps} = useStyleProps({slot: 'footer', ...otherProps});

  return (
    <footer {...filterDOMProps(otherProps)} {...styleProps} ref={ref}>
      {children}
    </footer>
  );
});
