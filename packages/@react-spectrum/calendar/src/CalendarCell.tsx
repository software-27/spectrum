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

import {CalendarCellOptions, CalendarState, RangeCalendarState} from '@react-stately/calendar';
import {classNames} from '@react-spectrum/utils';
import React, {useRef} from 'react';
import styles from '@adobe/spectrum-css-temp/components/calendar/vars.css';
import {useCalendarCell} from '@react-aria/calendar';
import {useDateFormatter} from '@react-aria/i18n';
import {useHover} from '@react-aria/interactions';

interface CalendarCellProps extends CalendarCellOptions {
  state: CalendarState | RangeCalendarState
}

export function CalendarCell({state, ...props}: CalendarCellProps) {
  let ref = useRef<HTMLElement>();
  let {cellProps, buttonProps} = useCalendarCell(props, state, ref);
  let {hoverProps, isHovered} = useHover(props);
  let dateFormatter = useDateFormatter({day: 'numeric'});

  return (
    <td
      {...cellProps}
      className={classNames(styles, 'spectrum-Calendar-tableCell')}>
      <span
        {...buttonProps}
        {...hoverProps}
        ref={ref}
        className={classNames(styles, 'spectrum-Calendar-date', {
          'is-today': props.isToday,
          'is-selected': props.isSelected,
          'is-focused': props.isFocused,
          'is-disabled': props.isDisabled,
          'is-outsideMonth': !props.isCurrentMonth,
          'is-range-start': props.isRangeStart,
          'is-range-end': props.isRangeEnd,
          'is-range-selection': props.isRangeSelection,
          'is-selection-start': props.isSelectionStart,
          'is-selection-end': props.isSelectionEnd,
          'is-hovered': isHovered
        })}>
        {dateFormatter.format(props.cellDate)}
      </span>
    </td>
  );
}
