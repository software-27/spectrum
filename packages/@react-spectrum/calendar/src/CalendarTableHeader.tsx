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

import {CalendarDate, toDate} from '@internationalized/date';
import {classNames} from '@react-spectrum/utils';
import React from 'react';
import styles from '@adobe/spectrum-css-temp/components/calendar/vars.css';
import {useCalendarTableHeader} from '@react-aria/calendar';
import {useDateFormatter} from '@react-aria/i18n';
import {VisuallyHidden} from '@react-aria/visually-hidden';

interface CalendarTableHeaderProps {
  weekDays: Array<CalendarDate>
}

export function CalendarTableHeader({weekDays}: CalendarTableHeaderProps) {
  const {
    columnHeaderProps
  } = useCalendarTableHeader();
  let dayFormatter = useDateFormatter({weekday: 'narrow'});
  let dayFormatterLong = useDateFormatter({weekday: 'long'});
  return (
    <thead>
      <tr aria-rowindex={1}>
        {
          weekDays.map((date, index) => {
            // Timezone doesn't matter here, assuming all days are formatted in the same zone.
            let dateDay = toDate(date, 'America/Los_Angeles');
            let day = dayFormatter.format(dateDay);
            let dayLong = dayFormatterLong.format(dateDay);
            return (
              <th
                key={index}
                aria-colindex={index + 1}
                {...columnHeaderProps}
                className={classNames(styles, 'spectrum-Calendar-tableCell')}>
                {/* Make sure screen readers read the full day name, but we show an abbreviation visually. */}
                <VisuallyHidden>{dayLong}</VisuallyHidden>
                <span aria-hidden="true" className={classNames(styles, 'spectrum-Calendar-dayOfWeek')}>
                  {day}
                </span>
              </th>
            );
          })
        }
      </tr>
    </thead>
  );
}
