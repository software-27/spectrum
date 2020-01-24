import React, {createRef} from 'react';
import {renderHook} from 'react-hooks-testing-library';
import {useMenuTrigger} from '../';

describe('useMenuTrigger', function () {
  let state = {};
  let setOpen = jest.fn();
  let focusStrategy = createRef();

  let renderMenuTriggerHook = (menuProps, menuTriggerProps, isOpen) => {
    let {result} = renderHook(() => useMenuTrigger(menuProps, menuTriggerProps, isOpen));
    return result.current;
  };

  beforeEach(() => {
    state.isOpen = false;
    state.setOpen = setOpen;
  });

  afterEach(() => {
    setOpen.mockClear();
  });

  it('should return default props for menu and menu trigger', function () {
    let {menuTriggerProps, menuProps} = renderMenuTriggerHook({focusStrategy}, state);
    expect(menuTriggerProps['aria-controls']).toBeFalsy();
    expect(menuTriggerProps['aria-expanded']).toBeFalsy();
    expect(menuTriggerProps['aria-haspopup']).toBeFalsy();
    expect(menuProps['aria-labelledby']).toBe(menuTriggerProps.id);
    expect(menuProps.id).toBeTruthy();
  });

  it('should return proper aria props for menu and menu trigger if menu is open', function () {
    state.isOpen = true;

    let {menuTriggerProps, menuProps} = renderMenuTriggerHook({focusStrategy}, state);
    expect(menuTriggerProps['aria-controls']).toBe(menuProps.id);
    expect(menuTriggerProps['aria-expanded']).toBeTruthy();
    expect(menuProps['aria-labelledby']).toBe(menuTriggerProps.id);
    expect(menuProps.id).toBeTruthy();
  });

  it('returns the proper aria-haspopup based on the menu\'s type', function () {
    let props = {
      type: 'menu',
      focusStrategy
    };

    let {menuTriggerProps} = renderMenuTriggerHook(props, state);
    expect(menuTriggerProps['aria-haspopup']).toBeTruthy();
  });

  // Comprehensive onPress functionality is tested in MenuTrigger test
  it('returns a onPress for the menuTrigger', function () {
    let props = {
      type: 'menu',
      focusStrategy
    };

    let {menuTriggerProps} = renderMenuTriggerHook(props, state);
    expect(typeof menuTriggerProps.onPress).toBe('function');
    menuTriggerProps.onPress();
    expect(setOpen).toHaveBeenCalledTimes(1);
    expect(setOpen).toHaveBeenCalledWith(!state.isOpen);
  });

  // Comprehensive onKeyDown functionality is tested in MenuTrigger test
  it('returns a onKeyDown that toggles the menu open state for specific key strokes', function () {
    let props = {
      type: 'menu',
      ref: {current: true},
      focusStrategy
    };

    let preventDefault = jest.fn();
    let stopPropagation = jest.fn();

    let {menuTriggerProps} = renderMenuTriggerHook(props, state);
    expect(typeof menuTriggerProps.onKeyDown).toBe('function');

    // doesn't trigger event if isDefaultPrevented returns true
    menuTriggerProps.onKeyDown({
      pointerType: 'not keyboard', 
      isDefaultPrevented: () => true,
      key: 'ArrowDown'
    });
    expect(setOpen).toHaveBeenCalledTimes(0);

    // doesn't trigger event if defaultPrevented is true
    menuTriggerProps.onKeyDown({
      pointerType: 'not keyboard', 
      defaultPrevented: true,
      key: 'ArrowDown'
    });
    expect(setOpen).toHaveBeenCalledTimes(0);

     // triggers event if defaultPrevented is not true and it matches one of the keys
    menuTriggerProps.onKeyDown({
      pointerType: 'not keyboard', 
      defaultPrevented: false,
      key: 'ArrowDown',
      preventDefault,
      stopPropagation
    });
    expect(setOpen).toHaveBeenCalledTimes(1);
    expect(setOpen).toHaveBeenCalledWith(!state.isOpen);
    expect(stopPropagation).toHaveBeenCalledTimes(1);
    expect(preventDefault).toHaveBeenCalledTimes(1);
  });
});
