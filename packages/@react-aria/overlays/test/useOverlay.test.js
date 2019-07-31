import {cleanup, fireEvent, render} from '@testing-library/react';
import React, {useRef} from 'react';
import {useOverlay} from '../';

function Example(props) {
  let ref = useRef();
  let {overlayProps} = useOverlay({ref, ...props});
  return <div ref={ref} {...overlayProps} data-testid={props['data-testid'] || 'test'}>{props.children}</div>;
}

describe('useOverlay', function () {
  afterEach(cleanup);

  it('should not focus the overlay if a child is focused', function () {
    let res = render(
      <Example isOpen>
        <input autoFocus data-testid="input" />
      </Example>
    );

    let input = res.getByTestId('input');
    expect(document.activeElement).toBe(input);
  });

  it('should hide the overlay when clicking outside', function () {
    let onClose = jest.fn();
    render(<Example isOpen onClose={onClose} />);
    fireEvent.mouseUp(document.body);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should hide the overlay when pressing the escape key', function () {
    let onClose = jest.fn();
    let res = render(<Example isOpen onClose={onClose} />);
    let el = res.getByTestId('test');
    fireEvent.keyDown(el, {key: 'Escape'});
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should only hide the top-most overlay', function () {
    let onCloseFirst = jest.fn();
    let onCloseSecond = jest.fn();
    render(<Example isOpen onClose={onCloseFirst} />);
    let second = render(<Example isOpen onClose={onCloseSecond} />);

    fireEvent.mouseUp(document.body);
    expect(onCloseSecond).toHaveBeenCalledTimes(1);
    expect(onCloseFirst).not.toHaveBeenCalled();

    second.unmount();

    fireEvent.mouseUp(document.body);
    expect(onCloseFirst).toHaveBeenCalledTimes(1);
  });
});
