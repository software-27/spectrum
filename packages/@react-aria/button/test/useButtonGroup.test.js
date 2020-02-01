import React from 'react';
import {renderHook} from 'react-hooks-testing-library';
import {useButtonGroup} from '../';

describe('useButton tests', function () {
  let state = {};
  let renderButtonGroupHook = (props) => {
    let {result} = renderHook(() => useButtonGroup(props, state));
    return result.current;
  };

  it('handles defaults', function () {
    let {buttonGroupProps, buttonProps} = renderButtonGroupHook({});
    expect(buttonGroupProps.role).toBe('radiogroup');
    expect(buttonGroupProps['aria-orientation']).toBe('horizontal');
    expect(buttonGroupProps.id).toBeDefined();
    expect(buttonProps.role).toBe('radio');
  });

  it('handles vertical orientation', function () {
    let {buttonGroupProps} = renderButtonGroupHook({orientation: 'vertical'});
    expect(buttonGroupProps['aria-orientation']).toBe('vertical');
  });

  it('handles selection mode none', function () {
    let {buttonGroupProps, buttonProps} = renderButtonGroupHook({selectionMode: 'none'});
    expect(buttonGroupProps.role).toBe('toolbar');
    expect(buttonGroupProps.id).toBeDefined();
    expect(buttonProps.role).toBeNull();
  });

  it('handles selection mode single', function () {
    let {buttonGroupProps, buttonProps} = renderButtonGroupHook({selectionMode: 'single'});
    expect(buttonGroupProps.role).toBe('radiogroup');
    expect(buttonGroupProps.id).toBeDefined();
    expect(buttonProps.role).toBe('radio');
  });

  it('handles selection mode multiple', function () {
    let {buttonGroupProps, buttonProps} = renderButtonGroupHook({selectionMode: 'multiple'});
    expect(buttonGroupProps.role).toBe('toolbar');
    expect(buttonGroupProps.id).toBeDefined();
    expect(buttonProps.role).toBe('checkbox');
  });

  it('handles custom role', function () {
    let {buttonGroupProps, buttonProps} = renderButtonGroupHook({role: 'group', selectionMode: 'multiple'});
    expect(buttonGroupProps.role).toBe('group');
    expect(buttonGroupProps.id).toBeDefined();
    expect(buttonProps.role).toBe('checkbox');
  });

  it('handles isDisabled', function () {
    let {buttonGroupProps} = renderButtonGroupHook({isDisabled: true});
    expect(buttonGroupProps['aria-disabled']).toBeTruthy();
  });
});
