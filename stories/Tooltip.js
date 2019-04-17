import Button from '../src/Button';
import OverlayTrigger from '../src/OverlayTrigger';
import React from 'react';
import {storiesOf} from '@storybook/react';
import Tooltip from '../src/Tooltip';

storiesOf('Tooltip', module)
  .add(
    'Default',
    () => render('This is a tooltip.')
  )
  .add(
    'placement: left',
    () => render('This is a tooltip.', {placement: 'left'})
  )
  .add(
    'placement: top',
    () => render('This is a tooltip.', {placement: 'top'})
  )
  .add(
    'placement: bottom',
    () => render('This is a tooltip.', {placement: 'bottom'})
  )
  .add(
    'variant: error',
    () => render('This is a tooltip.', {variant: 'error'})
  )
  .add(
    'variant: success',
    () => render('This is a tooltip.', {variant: 'success'})
  )
  .add(
    'variant: info',
    () => render('This is a tooltip.', {variant: 'info'})
  )
  .add(
    'Long content',
    () => render(longMarkup)
  )
  .add(
    'with OverlayTrigger: using click',
    () => render('This is a tooltip.', {trigger: 'click'})
  )
  .add(
    'with OverlayTrigger: using hover and focus',
    () => render('This is a tooltip.', {trigger: ['hover', 'focus']})
  );

function render(content, props = {}) {
  if (props.trigger) {
    return (
      <OverlayTrigger placement="right" {...props}>
        <Button label="Click me" variant="primary" />
        <Tooltip open>
          {content}
        </Tooltip>
      </OverlayTrigger>
    );
  }

  return (
    <div style={{display: 'inline-block'}}>
      <Tooltip
        {...props}
        open>
        {content}
      </Tooltip>
    </div>
  );
}

const longMarkup = (
  <div>
  Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor
  quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean
  ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra.
  Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt
  condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui.
  </div>
);
