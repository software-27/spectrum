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
import {Button} from '@react-spectrum/button';
import {CalendarState, RangeCalendarState, useCalendarState} from '@react-stately/calendar';
import {createCalendar, DateDuration, getWeeksInMonth, startOfWeek} from '@internationalized/date';
import React, {useMemo, useRef} from 'react';
import {useCalendar, useCalendarCell, useCalendarGrid} from '../src';
import {useDateFormatter, useLocale} from '@react-aria/i18n';


export function Example(props) {
  let {locale} = useLocale();
  const {visibleDuration} = props;
  
  let state = useCalendarState({
    ...props,
    locale,
    createCalendar
  });

  let {calendarProps, prevButtonProps, nextButtonProps} = useCalendar(props, state);

  let grids = useMemo(() => {
    let gridCount = 1;
    if (visibleDuration.months && visibleDuration.months > 0) {
      gridCount = visibleDuration.months;
    }

    let components = [];
    for (let i = 0; i < gridCount; i++) {
      components.push(<CalendarGrid key={i} state={state} visibleDuration={visibleDuration} offset={{months: i}} />);
    }

    return components;
  }, [visibleDuration, state]);

  return (
    <div {...calendarProps}>
      <div style={{textAlign: 'center'}} data-testid={'range'}>
        {calendarProps['aria-label']}
      </div>
      <div style={{display: 'grid', gridTemplateColumns: `repeat(${grids.length}, 1fr)`, gap: '1em'}}>
        {grids}
      </div>
      <div>
        <Button variant={'secondary'} {...prevButtonProps}>prev</Button>
        <Button variant={'secondary'} {...nextButtonProps}>next</Button>
      </div>
    </div>
  );
}

function CalendarGrid({state, visibleDuration, offset = {}}: {state: CalendarState | RangeCalendarState, visibleDuration: DateDuration, offset?: DateDuration}) {
  let {locale} = useLocale();
  let {gridProps} = useCalendarGrid({}, state);

  let weeks = visibleDuration.weeks ?? 1;
  let startDate = state.visibleRange.start.add(offset);
  if (visibleDuration.months) {
    weeks = getWeeksInMonth(state.visibleRange.start, locale);
    startDate = startOfWeek(startDate, locale);
  }
  return (<div {...gridProps}>
    {[...new Array(weeks).keys()].map(weekIndex => (
      <div key={weekIndex} role="row">
        {[...new Array(visibleDuration.days ?? 7).keys()].map(dayIndex => (
          <Cell key={dayIndex} state={state} date={startDate.add({weeks: weekIndex, days: dayIndex})} />
            ))}
      </div>
        ))}
  </div>);
  
}

function Cell(props) {
  let ref = useRef(undefined);
  let {cellProps, buttonProps} = useCalendarCell(props, props.state, ref);

  let dateFormatter = useDateFormatter({
    day: 'numeric',
    timeZone: props.state.timeZone,
    calendar: props.date.calendar.identifier
  });

  return (
    <div {...cellProps} style={{display: 'inline-block'}}>
      <span ref={ref} {...buttonProps} style={{display: 'block', width: 42, height: 42, background: props.state.isSelected(props.date) ? 'blue' : ''}}>{dateFormatter.format(props.date.toDate(props.state.timeZone))}</span>
    </div>
  );
}
