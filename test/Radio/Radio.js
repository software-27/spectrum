import React from 'react';
import expect from 'expect';
import { shallow } from 'enzyme';
import Radio from '../../src/Radio';

describe('Radio', () => {
  it('has correct defaults', () => {
    const tree = shallow(<Radio />);
    expect(tree.prop('inputType')).toBe('radio');
    expect(tree.prop('className')).toBe('coral-Radio');
    expect(tree.prop('inputClassName')).toBe('coral-Radio-input');
    expect(tree.prop('markClassName')).toBe('coral-Radio-checkmark');
    expect(tree.prop('labelClassName')).toBe('coral-Radio-description');
  });

  it('supports additional classNames', () => {
    const tree = shallow(<Radio className="foo" />);
    expect(tree.hasClass('foo')).toBe(true);
  });

  it('supports additional properties', () => {
    const tree = shallow(<Radio foo />);
    expect(tree.prop('foo')).toBe(true);
  });
});
