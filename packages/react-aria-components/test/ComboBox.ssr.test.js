/*
 * Copyright 2023 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import {screen, testSSR} from '@react-spectrum/test-utils-internal';

describe('ComboBox SSR', function () {
  it('should render text of default selected key', async function () {
    await testSSR(__filename, `
      import {ComboBox, Label, Input, Popover, ListBox, ListBoxItem} from '../';

      <React.StrictMode>
        <ComboBox defaultSelectedKey="dog">
          <Label>Favorite Animal</Label>
          <Input />
          <Popover>
            <ListBox>
              <ListBoxItem id="cat">Cat</ListBoxItem>
              <ListBoxItem id="dog">Dog</ListBoxItem>
              <ListBoxItem id="kangaroo">Kangaroo</ListBoxItem>
            </ListBox>
          </Popover>
        </ComboBox>
      </React.StrictMode>
    `, () => {
      // Assert that server rendered stuff into the HTML.
      let input = screen.getByRole('combobox');
      expect(input.value).toBe('Dog');
    });

    // Assert that hydrated UI matches what we expect.
    let input = screen.getByRole('combobox');
    expect(input.value).toBe('Dog');
  });
});
