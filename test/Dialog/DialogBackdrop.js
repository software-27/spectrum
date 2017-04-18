import React from 'react';
import expect from 'expect';
import { shallow } from 'enzyme';
import DialogBackdrop from '../../src/Dialog/js/DialogBackdrop';

describe('DialogBackdrop', () => {
  it('default', () => {
    const tree = render();
    const backdrop = findBackdrop(tree);

    expect(tree.prop('isOpened')).toBe(false);

    expect(backdrop.hasClass('coral-Backdrop')).toBe(true);
    expect(backdrop.prop('style')).toEqual({ zIndex: 10009 });
  });

  it('supports backdrop: none', () => {
    const tree = render({ backdrop: 'none' });
    expect(tree.node).toNotExist();
  });

  it('supports open', () => {
    const tree = render({ open: false });
    expect(tree.prop('isOpened')).toBe(false);
    expect(tree.find('.is-open').isEmpty()).toBe(true);
    tree.setProps({ open: true });
    expect(tree.prop('isOpened')).toBe(true);
    expect(tree.find('.is-open').isEmpty()).toBe(false);
  });

  describe('supports onClick', () => {
    it('when backdrop="modal"', () => {
      const spy = expect.createSpy();
      const backdrop = findBackdrop(render({ backdrop: 'modal', onClose: spy }));
      backdrop.simulate('click');
      expect(spy).toHaveBeenCalled();
    });

    it('except when backdrop="static"', () => {
      const spy = expect.createSpy();
      const backdrop = findBackdrop(render({ backdrop: 'static', onClose: spy }));
      backdrop.simulate('click');
      expect(spy).toNotHaveBeenCalled();
    });
  });

  it('supports additional classNames', () => {
    const tree = render({ className: 'myClass' });
    expect(findBackdrop(tree).hasClass('myClass')).toBe(true);
  });

  it('supports additional properties', () => {
    const tree = render({ foo: true });
    expect(findBackdrop(tree).prop('foo')).toBe(true);
  });
});

const render = props => (
  shallow(<DialogBackdrop { ...props } />)
);

const findBackdrop = tree => tree.find('.coral-Backdrop');
