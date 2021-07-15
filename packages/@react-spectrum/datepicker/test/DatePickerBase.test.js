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

import {act, fireEvent, render} from '@testing-library/react';
import {DatePicker, DateRangePicker} from '../';
import {installPointerEvent} from '@react-spectrum/test-utils';
import {Provider} from '@react-spectrum/provider';
import React from 'react';
import {theme} from '@react-spectrum/theme-default';
import {triggerPress} from '@react-spectrum/test-utils';

function pointerEvent(type, opts) {
  let evt = new Event(type, {bubbles: true, cancelable: true});
  Object.assign(evt, {
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,
    button: opts.button || 0
  }, opts);
  return evt;
}

describe('DatePickerBase', function () {
  describe('basics', function () {
    it.each`
      Name                   | Component            | numSegments
      ${'DatePicker'}        | ${DatePicker}        | ${3}
      ${'DateRangePicker'}   | ${DateRangePicker}   | ${6}
    `('$Name should render a default datepicker', ({Component, numSegments}) => {
      let {getAllByRole} = render(<Component />);

      let combobox = getAllByRole('group')[0];
      expect(combobox).toBeVisible();
      expect(combobox).not.toHaveAttribute('aria-disabled');
      expect(combobox).not.toHaveAttribute('aria-invalid');

      let segments = getAllByRole('spinbutton');
      expect(segments.length).toBe(numSegments);
      for (let segment of segments) {
        expect(segment).not.toHaveAttribute('aria-disabled');
        expect(segment).toHaveAttribute('contentEditable', 'true');
        expect(segment).toHaveAttribute('inputMode', 'numeric');
      }

      let button = getAllByRole('button')[0];
      expect(button).toBeVisible();
    });

    it.each`
      Name                   | Component
      ${'DatePicker'}        | ${DatePicker}
      ${'DateRangePicker'}   | ${DateRangePicker}
    `('$Name should set aria-disabled when isDisabled', ({Component}) => {
      let {getAllByRole} = render(<Component isDisabled />);

      let combobox = getAllByRole('group')[0];
      expect(combobox).toHaveAttribute('aria-disabled', 'true');

      let segments = getAllByRole('spinbutton');
      for (let segment of segments) {
        expect(segment).toHaveAttribute('aria-disabled', 'true');
        expect(segment).not.toHaveAttribute('contentEditable', 'true');
        expect(segment).not.toHaveAttribute('inputMode', 'numeric');
      }

      let button = getAllByRole('button')[0];
      expect(button).toHaveAttribute('disabled');
    });

    it.each`
      Name                   | Component
      ${'DatePicker'}        | ${DatePicker}
      ${'DateRangePicker'}   | ${DateRangePicker}
    `('$Name should set aria-readonly when isReadOnly', ({Component}) => {
      let {getAllByRole} = render(<Component isReadOnly />);

      let combobox = getAllByRole('group')[0];
      expect(combobox).not.toHaveAttribute('aria-readonly', 'true');

      let segments = getAllByRole('spinbutton');
      for (let segment of segments) {
        expect(segment).toHaveAttribute('aria-readonly', 'true');
      }

      let button = getAllByRole('button')[0];
      expect(button).toHaveAttribute('disabled');
    });

    it.each`
      Name                   | Component
      ${'DatePicker'}        | ${DatePicker}
      ${'DateRangePicker'}   | ${DateRangePicker}
    `('$Name should set aria-required when isRequired', ({Component}) => {
      let {getAllByRole} = render(<Component isRequired />);

      let combobox = getAllByRole('group')[0];
      expect(combobox).not.toHaveAttribute('aria-required', 'true');

      let segments = getAllByRole('spinbutton');
      for (let segment of segments) {
        expect(segment).toHaveAttribute('aria-required', 'true');
      }
    });

    it.each`
      Name                   | Component
      ${'DatePicker'}        | ${DatePicker}
      ${'DateRangePicker'}   | ${DateRangePicker}
    `('$Name should set aria-invalid when validationState="invalid"', ({Component}) => {
      let {getAllByRole} = render(<Component validationState="invalid" />);

      let combobox = getAllByRole('group')[0];
      expect(combobox).not.toHaveAttribute('aria-invalid', 'true');
 
      let segments = getAllByRole('spinbutton');
      for (let segment of segments) {
        expect(segment).toHaveAttribute('aria-invalid', 'true');
      }
    });
  });

  describe('calendar popover', function () {
    it.each`
      Name                   | Component
      ${'DatePicker'}        | ${DatePicker}
      ${'DateRangePicker'}   | ${DateRangePicker}
    `('$Name should open a calendar popover when clicking the button', ({Component}) => {
      let {getAllByRole} = render(
        <Provider theme={theme}>
          <Component />
        </Provider>
      );

      let combobox = getAllByRole('group')[0];
      expect(combobox).not.toHaveAttribute('aria-haspopup', 'dialog');
      expect(combobox).not.toHaveAttribute('aria-owns');

      let segments = getAllByRole('spinbutton');
      for (let segment of segments) {
        expect(segment).toHaveAttribute('aria-haspopup', 'dialog');
        expect(segment).not.toHaveAttribute('aria-expanded');
        expect(segment).not.toHaveAttribute('aria-controls');
      }

      let button = getAllByRole('button')[0];
      expect(button).toHaveAttribute('aria-haspopup', 'dialog');
      expect(button).toHaveAttribute('aria-expanded', 'false');
      expect(button).not.toHaveAttribute('aria-controls');

      triggerPress(button);

      let dialog = getAllByRole('dialog')[0];
      expect(dialog).toBeVisible();
      expect(dialog).toHaveAttribute('id');
      let dialogId = dialog.getAttribute('id');

      for (let segment of segments) {
        expect(segment).toHaveAttribute('aria-controls', dialogId);
      }

      expect(button).toHaveAttribute('aria-expanded', 'true');
      expect(button).toHaveAttribute('aria-controls', dialogId);

      // Focuses the calendar date
      expect(document.activeElement.parentElement).toHaveAttribute('role', 'gridcell');
    });

    it.each`
      Name                   | Component
      ${'DatePicker'}        | ${DatePicker}
      ${'DateRangePicker'}   | ${DateRangePicker}
    `('$Name should open a calendar popover pressing Alt + ArrowDown on the keyboard', ({Component}) => {
      let {getAllByRole} = render(
        <Provider theme={theme}>
          <Component />
        </Provider>
      );

      let combobox = getAllByRole('group')[0];
      expect(combobox).not.toHaveAttribute('aria-haspopup', 'dialog');
      expect(combobox).not.toHaveAttribute('aria-owns');

      let segments = getAllByRole('spinbutton');
      for (let segment of segments) {
        expect(segment).toHaveAttribute('aria-haspopup', 'dialog');
        expect(segment).not.toHaveAttribute('aria-expanded');
        expect(segment).not.toHaveAttribute('aria-controls');
      }

      let button = getAllByRole('button')[0];
      expect(button).toHaveAttribute('aria-haspopup', 'dialog');
      expect(button).not.toHaveAttribute('aria-controls');

      fireEvent.keyDown(combobox, {key: 'ArrowDown', altKey: true});

      let dialog = getAllByRole('dialog')[0];
      expect(dialog).toBeVisible();
      expect(dialog).toHaveAttribute('id');
      let dialogId = dialog.getAttribute('id');

      for (let segment of segments) {
        expect(segment).toHaveAttribute('aria-controls', dialogId);
      }

      expect(button).toHaveAttribute('aria-expanded', 'true');
      expect(button).toHaveAttribute('aria-controls', dialogId);

      // Focuses the calendar date
      expect(document.activeElement.parentElement).toHaveAttribute('role', 'gridcell');
    });

    it.each`
      Name                   | Component
      ${'DatePicker'}        | ${DatePicker}
      ${'DateRangePicker'}   | ${DateRangePicker}
    `('$Name should open a calendar popover when tapping on the date field with a touch device', ({Component}) => {
      let {getAllByRole} = render(
        <Provider theme={theme}>
          <Component />
        </Provider>
      );

      let combobox = getAllByRole('group')[0];
      expect(combobox).not.toHaveAttribute('aria-haspopup', 'dialog');
      expect(combobox).not.toHaveAttribute('aria-owns');

      let segments = getAllByRole('spinbutton');
      for (let segment of segments) {
        expect(segment).toHaveAttribute('aria-haspopup', 'dialog');
        expect(segment).not.toHaveAttribute('aria-expanded');
        expect(segment).not.toHaveAttribute('aria-controls');
      }

      let button = getAllByRole('button')[0];
      expect(button).toHaveAttribute('aria-haspopup', 'dialog');
      expect(button).not.toHaveAttribute('aria-controls');

      fireEvent.touchStart(combobox, {targetTouches: [{identifier: 1}]});
      fireEvent.touchEnd(combobox, {changedTouches: [{identifier: 1, clientX: 0, clientY: 0}]});

      let dialog = getAllByRole('dialog')[0];
      expect(dialog).toBeVisible();
      expect(dialog).toHaveAttribute('id');
      let dialogId = dialog.getAttribute('id');

      for (let segment of segments) {
        expect(segment).toHaveAttribute('aria-controls', dialogId);
      }

      expect(button).toHaveAttribute('aria-expanded', 'true');
      expect(button).toHaveAttribute('aria-controls', dialogId);

      // Focuses the calendar date
      expect(document.activeElement.parentElement).toHaveAttribute('role', 'gridcell');
    });
  });

  describe('focus management', function () {
    installPointerEvent();

    it.each`
      Name                   | Component
      ${'DatePicker'}        | ${DatePicker}
      ${'DateRangePicker'}   | ${DateRangePicker}
    `('$Name should support arrow keys to move between segments', ({Component}) => {
      let {getAllByRole} = render(<Component />);

      let segments = getAllByRole('spinbutton');
      act(() => {segments[0].focus();});

      for (let i = 0; i < segments.length; i++) {
        expect(segments[i]).toHaveFocus();
        fireEvent.keyDown(document.activeElement, {key: 'ArrowRight'});
      }

      for (let i = segments.length - 1; i >= 0; i--) {
        expect(segments[i]).toHaveFocus();
        fireEvent.keyDown(document.activeElement, {key: 'ArrowLeft'});
      }
    });

    it.each`
      Name                   | Component
      ${'DatePicker'}        | ${DatePicker}
      ${'DateRangePicker'}   | ${DateRangePicker}
    `('$Name should support arrow keys to move between segments in an RTL locale', ({Component}) => {
      let {getAllByRole} = render(
        <Provider theme={theme} locale="ar-EG">
          <Component value={new Date(2019, 1, 3)} />
        </Provider>
      );

      let segments = getAllByRole('spinbutton');
      act(() => {segments[0].focus();});

      for (let i = 0; i < segments.length; i++) {
        expect(segments[i]).toHaveFocus();
        fireEvent.keyDown(document.activeElement, {key: 'ArrowLeft'});
      }

      for (let i = segments.length - 1; i >= 0; i--) {
        expect(segments[i]).toHaveFocus();
        fireEvent.keyDown(document.activeElement, {key: 'ArrowRight'});
      }
    });

    it.each`
      Name                   | Component
      ${'DatePicker'}        | ${DatePicker}
      ${'DateRangePicker'}   | ${DateRangePicker}
    `('$Name should focus the next segment on mouse down on a literal segment', ({Component}) => {
      let {getAllByRole, getAllByText} = render(<Component />);
      let literals = getAllByText('/');
      let segments = getAllByRole('spinbutton');

      fireEvent(literals[0], pointerEvent('pointerdown', {pointerId: 1, pointerType: 'mouse'}));
      expect(segments[1]).toHaveFocus();
    });

    it.each`
      Name                   | Component
      ${'DatePicker'}        | ${DatePicker}
      ${'DateRangePicker'}   | ${DateRangePicker}
    `('$Name should focus the next segment on mouse down on a non-editable segment', ({Component}) => {
      let format = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZoneName: 'short',
        era: 'short'
      };

      let {getAllByTestId} = render(<Component formatOptions={format} />);

      fireEvent(getAllByTestId('weekday')[0], pointerEvent('pointerdown', {pointerId: 1, pointerType: 'mouse'}));
      expect(getAllByTestId('month')[0]).toHaveFocus();

      fireEvent(getAllByTestId('era')[0], pointerEvent('pointerdown', {pointerId: 1, pointerType: 'mouse'}));
      expect(getAllByTestId('hour')[0]).toHaveFocus();
    });

    it.each`
      Name                   | Component
      ${'DatePicker'}        | ${DatePicker}
      ${'DateRangePicker'}   | ${DateRangePicker}
    `('$Name should not be focusable when isDisabled', ({Component}) => {
      let {getAllByRole} = render(<Component isDisabled />);
      let segments = getAllByRole('spinbutton');
      for (let segment of segments) {
        expect(segment).not.toHaveAttribute('tabIndex');
      }
    });

    it.each`
      Name                   | Component
      ${'DatePicker'}        | ${DatePicker}
      ${'DateRangePicker'}   | ${DateRangePicker}
    `('$Name should focus the first segment by default if autoFocus is set', ({Component}) => {
      let {getAllByRole} = render(<Component autoFocus />);

      let segments = getAllByRole('spinbutton');
      expect(segments[0]).toHaveFocus();
    });
  });

  describe('validation', function () {
    it.each`
      Name                   | Component
      ${'DatePicker'}        | ${DatePicker}
      ${'DateRangePicker'}   | ${DateRangePicker}
    `('$Name should display an error icon when validationState="invalid"', ({Component}) => {
      let {getByTestId} = render(<Component validationState="invalid" />);
      expect(getByTestId('invalid-icon')).toBeVisible();
    });

    it.each`
      Name                   | Component
      ${'DatePicker'}        | ${DatePicker}
      ${'DateRangePicker'}   | ${DateRangePicker}
    `('$Name should display an checkmark icon when validationState="valid"', ({Component}) => {
      let {getByTestId} = render(<Component validationState="valid" />);
      expect(getByTestId('valid-icon')).toBeVisible();
    });
  });
});
