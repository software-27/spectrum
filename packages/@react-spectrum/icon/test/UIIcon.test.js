import {cleanup, render} from '@testing-library/react';
import React from 'react';
import {UIIcon} from '../';

let FakeIcon = (props) => <svg {...props}><path d="M 10,150 L 70,10 L 130,150 z" /></svg>;

describe('UIIcon', function () {
  afterEach(() => {
    cleanup();
  });

  it.each`
    Name        | Component
    ${'UIIcon'} | ${UIIcon}
  `('handle defaults', function ({Component}) {
    let {getByRole, rerender} = render(<Component aria-label="labelled icon"><FakeIcon /></Component>);

    let icon = getByRole('img');
    expect(icon).toHaveAttribute('focusable', 'false');
    expect(icon).toHaveAttribute('aria-label', 'labelled icon');

    rerender(<Component alt="workflow alt"><FakeIcon /></Component>);
    icon = getByRole('img');
    expect(icon).toHaveAttribute('aria-label', 'workflow alt');

    rerender(<Component><FakeIcon /></Component>);
    icon = getByRole('img');
    expect(icon).not.toHaveAttribute('aria-label');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });

  it.each`
  Name        | Component
  ${'UIIcon'} | ${UIIcon}
`('$Name supports aria-hidden prop', function ({Component}) {
  let {getByRole, rerender} = render(<Component alt="explicitly hidden alt" aria-hidden="true"><FakeIcon /></Component>);

  let icon = getByRole('img');
  expect(icon).toHaveAttribute('aria-label', 'explicitly hidden alt');
  expect(icon).toHaveAttribute('aria-hidden', 'true');

  rerender(<Component aria-label="explicitly not hidden aria-label" aria-hidden="false"><FakeIcon /></Component>);
  icon = getByRole('img');
  expect(icon).toHaveAttribute('aria-label', 'explicitly not hidden aria-label');
  expect(icon).not.toHaveAttribute('aria-hidden');
});
});
