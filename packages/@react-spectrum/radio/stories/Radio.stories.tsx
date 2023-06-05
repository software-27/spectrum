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

import {action} from '@storybook/addon-actions';
import {Content, ContextualHelp, Flex, Heading} from '@adobe/react-spectrum';
import {Provider} from '@react-spectrum/provider';
import {Radio, RadioGroup} from '../src';
import React, {useState} from 'react';

export default {
  title: 'RadioGroup',
  providerSwitcher: {status: 'positive'},
  args: {
    label: 'Favorite pet',
    isEmphasized: false,
    isDisabled: false,
    isReadOnly: false,
    isRequired: false,
    necessityIndicator: 'icon',
    labelPosition: 'top',
    labelAlign: 'start',
    validationState: null,
    orientation: 'vertical'
  },
  argTypes: {
    labelPosition: {
      control: {
        type: 'radio',
        options: ['top', 'side']
      }
    },
    necessityIndicator: {
      control: {
        type: 'radio',
        options: ['icon', 'label']
      }
    },
    labelAlign: {
      control: {
        type: 'radio',
        options: ['start', 'end']
      }
    },
    validationState: {
      control: {
        type: 'radio',
        options: [null, 'valid', 'invalid']
      }
    },
    orientation: {
      control: {
        type: 'radio',
        options: ['horizontal', 'vertical']
      }
    }
  }
};

export const Default = (args) => render(args);

Default.story = {
  name: 'default'
};

export const DefaultValueDragons = (args) => render({...args, defaultValue: 'dragons'});

DefaultValueDragons.story = {
  name: 'defaultValue: dragons'
};

export const ControlledDragons = (args) => render({...args, value: 'dragons'});

ControlledDragons.story = {
  name: 'controlled: dragons'
};

export const IsDisabledOnOneRadio = (args) => render(args, [{}, {isDisabled: true}, {}]);

IsDisabledOnOneRadio.story = {
  name: 'isDisabled on one radio'
};

export const WithDescription = (args) => render({...args, description: 'Please select a pet.'});

WithDescription.story = {
  name: 'with description'
};

export const WithErrorMessage = (args) =>
  render({...args, errorMessage: 'Please select a pet.', validationState: 'invalid'});

WithErrorMessage.story = {
  name: 'with error message'
};

export const WithErrorMessageAndErrorIcon = (args) =>
  render({
    ...args,
    errorMessage: 'Please select a pet.',
    validationState: 'invalid',
    showErrorIcon: true
  });

WithErrorMessageAndErrorIcon.story = {
  name: 'with error message and error icon'
};

export const WithDescriptionErrorMessageAndValidationFixedWidth = (args) =>
  renderWithDescriptionErrorMessageAndValidation(args);

WithDescriptionErrorMessageAndValidationFixedWidth.story = {
  name: 'with description, error message and validation, fixed width'
};

export const _ContextualHelp = (args) =>
  render({
    ...args,
    contextualHelp: (
      <ContextualHelp>
        <Heading>What is a segment?</Heading>
        <Content>
          Segments identify who your visitors are, what devices and services they use, where they
          navigated from, and much more.
        </Content>
      </ContextualHelp>
    )
  });

_ContextualHelp.story = {
  name: 'contextual help'
};

export const NoVisibleLabel = (args) =>
  render({...args, label: null, 'aria-label': 'Favorite pet'});

NoVisibleLabel.story = {
  name: 'no visible label'
};

export const LongRadioLabel = (args) => renderLongLabel(args);

LongRadioLabel.story = {
  name: 'long radio label'
};

export const ProviderControlIsDisabled = () => renderFormControl();

ProviderControlIsDisabled.story = {
  name: 'provider control: isDisabled'
};

export const AutoFocusOnOneRadio = (args) => render(args, [{}, {autoFocus: true}, {}]);

AutoFocusOnOneRadio.story = {
  name: 'autoFocus on one radio'
};

function render(props, radioProps = [{}, {}, {}]) {
  return (
    <RadioGroup label="Favorite pet" {...props} onChange={action('onChange')} name="favorite-pet-group">
      <Radio value="dogs" {...radioProps[0]}>
        Dogs
      </Radio>
      <Radio value="cats" {...radioProps[1]}>
        Cats
      </Radio>
      <Radio value="dragons" {...radioProps[2]}>
        Dragons
      </Radio>
    </RadioGroup>
  );
}

function renderLongLabel(props, radioProps = [{}, {}, {}]) {
  return (
    <RadioGroup aria-label="Favorite pet" {...props} onChange={action('onChange')}>
      <Radio value="dogs" {...radioProps[0]}>
        Dogs Dogs Dogs Dogs Dogs Dogs Dogs Dogs Dogs Dogs Dogs Dogs Dogs Dogs Dogs Dogs Dogs Dogs Dogs Dogs Dogs Dogs Dogs
      </Radio>
      <Radio value="cats" {...radioProps[1]}>
        Cats
      </Radio>
      <Radio value="dragons" {...radioProps[2]}>
        Dragons
      </Radio>
    </RadioGroup>
  );
}

function renderFormControl() {
  return (
    <Provider isDisabled>
      <RadioGroup aria-label="Favorite pet" onChange={action('onChangePet')} name="favorite-pet-group">
        <Radio value="dogs">
          Dogs
        </Radio>
        <Radio value="cats">
          Cats
        </Radio>
        <Radio value="dragons">
          Dragons
        </Radio>
      </RadioGroup>
      <RadioGroup aria-label="Favorite cereal" onChange={action('onChangeCereal')} name="favorite-cereal-group">
        <Radio value="reeses">
          Reese's Peanut Butter Puffs
        </Radio>
        <Radio value="honeynut">
          HoneyNut Cheerios
        </Radio>
        <Radio value="cinnamon">
          Cinnamon Toast Crunch
        </Radio>
      </RadioGroup>
    </Provider>
  );
}

function renderWithDescriptionErrorMessageAndValidation(props) {
  function Example() {
    let [selected, setSelected] = useState('dogs');
    let isValid = selected === 'dogs';

    return (
      <Flex width="480px">
        <RadioGroup
          {...props}
          aria-label="Favorite pet"
          onChange={setSelected}
          validationState={isValid ? 'valid' : 'invalid'}
          description="Please select a pet."
          errorMessage={
          selected === 'cats'
            ? 'No cats allowed.'
            : 'Please select dogs.'
        }>
          <Radio value="dogs">
            Dogs
          </Radio>
          <Radio value="cats">
            Cats
          </Radio>
          <Radio value="dragons">
            Dragons
          </Radio>
        </RadioGroup>
      </Flex>
    );
  }

  return <Example />;
}
