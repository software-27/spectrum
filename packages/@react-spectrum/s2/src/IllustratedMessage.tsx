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

import {ButtonGroupContext} from './ButtonGroup';
import {ContentContext, HeadingContext} from './Content';
import {createContext, forwardRef, ReactNode, useContext} from 'react';
import {DOMProps, DOMRef} from '@react-types/shared';
import {filterDOMProps} from '@react-aria/utils';
import {getAllowedOverrides, StylesPropWithHeight, UnsafeStyles} from './style-utils' with {type: 'macro'};
import {IllustrationContext} from './Illustration';
import {Provider} from 'react-aria-components';
import {style} from '../style/spectrum-theme' with {type: 'macro'};
import {useDOMRef} from '@react-spectrum/utils';

interface IllustratedMessageStyleProps {
  /**
   * The size of the IllustratedMessage.
   *
   * @default 'M'
   */
  size?: 'S' | 'M' | 'L',
  /**
   * The direction that the IllustratedMessage should be laid out in.
   *
   * @default 'vertical'
   */
  orientation?: 'horizontal' | 'vertical'
}

interface S2SpectrumIllustratedMessageProps extends DOMProps, UnsafeStyles, IllustratedMessageStyleProps {
  /** Spectrum-defined styles, returned by the `style()` macro. */
  styles?: StylesPropWithHeight,
  /** The content to display in the IllustratedMessage. */
  children: ReactNode
}

const illustratedMessage = style<IllustratedMessageStyleProps & {isInDropZone?: boolean}>({
  display: 'grid',
  fontFamily: 'sans',
  fontSize: 'control',
  maxWidth: {
    orientation: {
      vertical: '[380px]',
      horizontal: '[33rem]' // ask design about max width for horizontal because doesn't look great when L
    }
  },
  gridTemplateAreas: {
    orientation: {
      vertical: [
        '   .  illustration .   ',
        '   .       .       .   ',
        'heading heading heading',
        '   .       .       .   ',
        'content content content',
        '   .  buttonGroup  .   '
      ],
      horizontal: [
        'illustration . heading',
        'illustration .    .   ',
        'illustration . content',
        'illustration . buttonGroup'
      ]
    }
  },
  gridTemplateRows: {
    orientation: {
      vertical: {
        default: ['min-content', 12, 'min-content', 4, 'min-content', 'min-content'],
        size: {
          L: ['min-content', 8, 'min-content', 4, 'min-content', 'min-content']
        }
      },
      horizontal: ['1fr', 4, '1fr']
    }
  },
  gridTemplateColumns: {
    orientation: {
      horizontal: ['1fr', 12, 'auto']
    }
  },
  justifyItems: {
    orientation: {
      vertical: 'center',
      horizontal: 'start'
    }
  },
  textAlign: {
    orientation: {
      vertical: 'center'
    }
  }
}, getAllowedOverrides({height: true}));

const illustration = style<IllustratedMessageStyleProps & {isInDropZone?: boolean, isDropTarget?: boolean}>({
  gridArea: 'illustration',
  size: {
    size: {
      S: 96,
      M: 96,
      L: 160
    }
  },
  alignSelf: 'center',
  color: {
    // TODO: ask design about what the color should be. Says gray-800 in the designs file, neutral in token spec, but different neutral in dropzone spec
    default: 'gray-800',
    isInDropZone: 'gray-500', // neutral doesn't seem to match the color in designs, opted for gray-500 instead
    isDropTarget: 'accent'
  }
});

const heading = style<IllustratedMessageStyleProps>({
  gridArea: 'heading',
  font: {
    size: {
      S: 'title',
      M: 'title-xl',
      L: 'title-2xl'
    }
  },
  alignSelf: 'end',
  margin: 0
});

const content = style({
  font: {
    size: {
      S: 'body-xs',
      M: 'body-sm',
      L: 'body-sm'
    }
  },
  gridArea: 'content',
  alignSelf: 'start'
});

const buttonGroup = style({
  gridArea: 'buttonGroup',
  marginTop: 16
});

interface IllustratedMessageContextProps extends Omit<S2SpectrumIllustratedMessageProps, 'children'> {
  isInDropZone?: boolean,
  isDropTarget?: boolean
}

export const IllustratedMessageContext = createContext<IllustratedMessageContextProps | null>(null);

function IllustratedMessage(props: S2SpectrumIllustratedMessageProps, ref: DOMRef<HTMLDivElement>) {
  let {
    children,
    orientation = 'horizontal',
    size = 'M',
    UNSAFE_className = '',
    UNSAFE_style,
    ...otherProps
  } = props;

  let domRef = useDOMRef(ref);

  let ctx = useContext(IllustratedMessageContext);
  let isInDropZone = !!ctx;
  let isDropTarget = ctx ? ctx.isDropTarget : false;

  return (
    <div
      {...filterDOMProps(otherProps)}
      style={UNSAFE_style}
      className={UNSAFE_className + illustratedMessage({
        size: props.size || 'M',
        orientation: props.orientation || 'vertical'
      }, props.styles)}
      ref={domRef}>
      <Provider
        values={[
          [HeadingContext, {className: heading({orientation, size})}],
          [ContentContext, {className: content({size})}],
          [IllustrationContext, {className: illustration({orientation, size, isInDropZone, isDropTarget})}],
          [ButtonGroupContext, {styles: buttonGroup}]
        ]}>
        {children}
      </Provider>
    </div>
  );
}

/**
 * An IllustratedMessage displays an illustration and a message, usually
 * for an empty state or an error page.
 */
let _IllustratedMessage = /*#__PURE__*/ forwardRef(IllustratedMessage);
export {_IllustratedMessage as IllustratedMessage};
