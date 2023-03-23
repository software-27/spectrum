
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
import {ComponentMeta, ComponentStoryObj} from '@storybook/react';
import Filter from '@spectrum-icons/workflow/Filter';
import {Flex} from '@react-spectrum/layout';
import {Item, SearchAutocomplete} from '@react-spectrum/autocomplete';
import {mergeProps} from '@react-aria/utils';
import React from 'react';

type SearchAutocompleteStory = ComponentStoryObj<typeof SearchAutocomplete>;

export default {
  title: 'SearchAutocomplete',
  component: SearchAutocomplete,
  render: (args) => (
    <SearchAutocomplete label="Search with Autocomplete" {...args}>
      <Item>Aerospace</Item>
      <Item>Mechanical</Item>
      <Item>Civil</Item>
      <Item>Biomedical</Item>
      <Item>Nuclear</Item>
      <Item>Industrial</Item>
      <Item>Chemical</Item>
      <Item>Agricultural</Item>
      <Item>Electrical</Item>
    </SearchAutocomplete>
  ),
  args: {
    label: 'Search with Autocomplete',
    onOpenChange: action('onOpenChange'),
    onInputChange: action('onInputChange'),
    onSelectionChange: action('onSelectionChange'),
    onBlur: action('onBlur'),
    onFocus: action('onFocus'),
    onSubmit: action('onSubmit'),
    onClear: action('onClear')
  },
  argTypes: {
    defaultItems: {
      table: {
        disable: true
      }
    },
    contextualHelp: {
      table: {
        disable: true
      }
    },
    onOpenChange: {
      table: {
        disable: true
      }
    },
    disabledKeys: {
      table: {
        disable: true
      }
    },
    inputValue: {
      table: {
        disable: true
      }
    },
    defaultInputValue: {
      table: {
        disable: true
      }
    },
    defaultSelectedKey: {
      table: {
        disable: true
      }
    },
    selectedKey: {
      table: {
        disable: true
      }
    },
    onInputChange: {
      table: {
        disable: true
      }
    },
    onSelectionChange: {
      table: {
        disable: true
      }
    },
    onBlur: {
      table: {
        disable: true
      }
    },
    onFocus: {
      table: {
        disable: true
      }
    },
    label: {
      control: 'text'
    },
    'aria-label': {
      control: 'text'
    },
    isDisabled: {
      control: 'boolean'
    },
    isQuiet: {
      control: 'boolean'
    },
    isReadOnly: {
      control: 'boolean'
    },
    autoFocus: {
      control: 'boolean'
    },
    isRequired: {
      control: 'boolean'
    },
    necessityIndicator: {
      control: 'select',
      options: ['icon', 'label']
    },
    labelAlign: {
      control: 'select',
      options: ['end', 'start']
    },
    labelPosition: {
      control: 'select',
      options: ['top', 'side']
    },
    validationState: {
      control: 'select',
      options: [null, 'valid', 'invalid']
    },
    description: {
      control: 'text'
    },
    errorMessage: {
      control: 'text'
    },
    menuTrigger: {
      control: 'select',
      options: ['focus', 'manual']
    },
    direction: {
      control: 'select',
      options: ['top', 'bottom']
    },
    width: {
      control: 'text'
    }
  }
} as ComponentMeta<typeof SearchAutocomplete>;

let items = [
  {id: 1, name: 'Aerospace'},
  {id: 2, name: 'Mechanical'},
  {id: 3, name: 'Civil'},
  {id: 4, name: 'Biomedical'},
  {id: 5, name: 'Nuclear'},
  {id: 6, name: 'Industrial'},
  {id: 7, name: 'Chemical'},
  {id: 8, name: 'Agricultural'},
  {id: 9, name: 'Electrical'}
];

export const Default: SearchAutocompleteStory = {
  storyName: 'static items'
};

export const Dynamic: SearchAutocompleteStory = {
  args: {defaultItems: items},
  render: (args) => (
    <SearchAutocomplete defaultItems={items} {...args}>
      {(item: any) => <Item>{item.name}</Item>}
    </SearchAutocomplete>
  ),
  storyName: 'dynamic items'
};

export const NoItems: SearchAutocompleteStory = {
  ...Dynamic,
  args: {defaultItems: []},
  storyName: 'no items'
};

export const MappedItems: SearchAutocompleteStory = {
  render: (args) => (
    <SearchAutocomplete label="Search with Autocomplete" {...args}>
      {items.map((item) => (
        <Item key={item.id}>
          {item.name}
        </Item>
      ))}
    </SearchAutocomplete>
  ),
  storyName: 'with mapped items'
};


function CustomOnSubmit(props) {
  let [searchTerm, setSearchTerm] = React.useState('');

  let onSubmit = (value, key) => {
    if (value) {
      setSearchTerm(value);
    } else if (key) {
      let term = items.find(o => o.id === key)?.name;
      setSearchTerm(term ? term : '');
    }
  };

  return (
    <Flex direction="column">
      <SearchAutocomplete defaultItems={items} label="Search with Autocomplete" {...mergeProps(props, {onSubmit})}>
        {(item: any) => <Item>{item.name}</Item>}
      </SearchAutocomplete>
      <div>
        Search results for: {searchTerm}
      </div>
    </Flex>
  );
}

export const noVisibleLabel: SearchAutocompleteStory = {
  args: {label: undefined, 'aria-label': 'Search Autocomplete'},
  storyName: 'No visible label'
};

export const customOnSubmit: SearchAutocompleteStory = {
  render: (args) => <CustomOnSubmit {...args} />,
  storyName: 'custom onSubmit'
};

export const iconFilter: SearchAutocompleteStory = {
  args: {icon: <Filter />},
  storyName: 'icon: Filter'
};

export const iconNull: SearchAutocompleteStory = {
  args: {icon: null},
  storyName: 'icon: null'
};

