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
import {ActionButton, Button} from '@react-spectrum/button';
import {AlertDialog, Dialog, DialogTrigger} from '../';
import AlertMedium from '@spectrum-icons/ui/AlertMedium';
import {ButtonGroup} from '@react-spectrum/buttongroup';
import {chain} from '@react-aria/utils';
import {Checkbox} from '@react-spectrum/checkbox';
import {Content, Footer, Header} from '@react-spectrum/view';
import {Divider} from '@react-spectrum/divider';
import {Flex} from '@react-spectrum/layout';
import {Heading, Text} from '@react-spectrum/text';
import {Image} from '@react-spectrum/image';
import {Item, Menu, MenuTrigger} from '@react-spectrum/menu';
import {Provider} from '@react-spectrum/provider';
import React, {useState} from 'react';
import {storiesOf} from '@storybook/react';
import {Tooltip, TooltipTrigger} from '@react-spectrum/tooltip';

storiesOf('DialogTrigger', module)
  .addParameters({
    providerSwitcher: {status: 'notice'},
    argTypes: {
      crossOffset: {
        control: {
          type: 'number'
        }
      },
      offset: {
        control: {
          type: 'number'
        }
      },
      placement: {
        type: 'select',
        defaultValue: 'top',
        options: ['bottom', 'bottom left', 'bottom right', 'bottom start', 'bottom end', 'top', 'top left', 'top right', 'top start', 'top end', 'left', 'left top', 'left bottom', 'start', 'start top', 'start bottom', 'right', 'right top', 'right bottom', 'end', 'end top', 'end bottom']
      },
      buttonHeight: {
        control: {
          type: 'number'
        }
      },
      buttonWidth: {
        control: {
          type: 'number'
        }
      },
      shouldFlip: {
        control: {type: 'boolean'}
      },
      isKeyboardDismissDisabled: {
        control: {type: 'boolean'}
      },
      containerPadding: {
        control: {
          type: 'number'
        }
      }
    }
  })
  .add(
    'default',
    (args) => render(args)
  )
  .add(
    'type: popover',
    (args) => renderPopover({type: 'popover', ...args})
  )
  .add(
    'type: modal',
    (args) => render({type: 'modal', ...args})
  )
  .add(
    'type: modal isDismissable',
    (args) => render({type: 'modal', isDismissable: true, ...args})
  )
  .add(
    'type: fullscreen',
    (args) => render({type: 'fullscreen', ...args})
  )
  .add(
    'type: fullscreenTakeover',
    (args) => render({type: 'fullscreenTakeover', ...args})
  )
  .add(
    'type: tray',
    (args) => renderPopover({type: 'tray', ...args})
  )
  .add(
    'mobileType: fullscreen',
    (args) => render({type: 'modal', mobileType: 'fullscreen', ...args})
  )
  .add(
    'mobileType: fullscreenTakeover',
    (args) => render({type: 'modal', mobileType: 'fullscreenTakeover', ...args})
  )
  .add(
    'popover with mobileType: modal',
    (args) => renderPopover({type: 'popover', mobileType: 'modal', ...args})
  )
  .add(
    'popover with mobileType: tray',
    (args) => renderPopover({type: 'popover', mobileType: 'tray', ...args})
  )
  .add(
    'nested modals',
    () => (
      <div style={{paddingTop: 100}}>
        <input />
        <Provider colorScheme="dark" UNSAFE_style={{padding: 40, marginTop: 10}}>
          <DialogTrigger isDismissable>
            <ActionButton>Trigger</ActionButton>
            <Dialog>
              <Content>
                <input />
                <input />
                <DialogTrigger isDismissable>
                  <ActionButton>Trigger</ActionButton>
                  <Dialog>
                    <Content>
                      <input />
                      <input />
                    </Content>
                  </Dialog>
                </DialogTrigger>
              </Content>
            </Dialog>
          </DialogTrigger>
        </Provider>
      </div>
    )
  )
  .add(
    'nested modals, fullscreentakeover',
    () => (
      <DialogTrigger type="fullscreenTakeover">
        <ActionButton>Trigger</ActionButton>
        {(close) => (
          <Dialog>
            <Heading>The Heading</Heading>
            <Header>The Header</Header>
            <Divider />
            <Content>
              <DialogTrigger isDismissable>
                <ActionButton>Trigger</ActionButton>
                <Dialog>
                  <Content>
                    <input />
                    <input />
                  </Content>
                </Dialog>
              </DialogTrigger>
            </Content>
            <ButtonGroup>
              <Button variant="secondary" onPress={chain(close, action('cancel'))}>Cancel</Button>
              <Button variant="cta" onPress={chain(close, action('confirm'))}>Confirm</Button>
            </ButtonGroup>
          </Dialog>
        )}
      </DialogTrigger>
    )
  )
  .add(
    'with menu trigger',
    () => (
      <DialogTrigger type="popover">
        <ActionButton>Trigger</ActionButton>
        <Dialog>
          <Heading>The Heading</Heading>
          <Content>
            <MenuTrigger>
              <ActionButton>Test</ActionButton>
              <Menu autoFocus="first">
                <Item>Item 1</Item>
                <Item>Item 2</Item>
                <Item>Item 3</Item>
              </Menu>
            </MenuTrigger>
          </Content>
        </Dialog>
      </DialogTrigger>
    )
  )
  .add(
    'nested popovers',
    () => (
      <div style={{paddingTop: 100}}>
        <DialogTrigger type="popover">
          <ActionButton>Trigger</ActionButton>
          <Dialog>
            <Content>
              <input />
              <input />
              <DialogTrigger type="popover">
                <ActionButton>Trigger</ActionButton>
                <Dialog><Content>Hi!</Content></Dialog>
              </DialogTrigger>
            </Content>
          </Dialog>
        </DialogTrigger>
      </div>
    )
  )
  .add(
    'popover inside scroll view',
    () => (
      <div style={{height: 100, display: 'flex'}}>
        <div style={{paddingTop: 100, height: 100, overflow: 'auto'}}>
          <div style={{height: 200}}>
            <DialogTrigger type="popover">
              <ActionButton>Trigger</ActionButton>
              <Dialog>
                <Content>
                  <input />
                  <input />
                </Content>
              </Dialog>
            </DialogTrigger>
          </div>
        </div>
        <div style={{paddingTop: 100, height: 100, overflow: 'auto', flex: 1}}>
          <div style={{height: 200}}>
            other
          </div>
        </div>
      </div>
    )
  )
  .add(
    'shouldFlip with width',
    (args) => renderPopover({type: 'popover', width: 'calc(100vh - 100px)', ...args})
  )
  .add(
    'Close function with button: popover',
    () => (
      <div style={{display: 'flex', margin: '100px 0'}}>
        <DialogTrigger type="popover" onOpenChange={action('open change')}>
          <ActionButton>Trigger</ActionButton>
          {(close) => (
            <Dialog>
              <Heading>The Heading</Heading>
              <Header>The Header</Header>
              <Divider />
              <Content><Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin sit amet tristique risus. In sit amet suscipit lorem. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. In condimentum imperdiet metus non condimentum. Duis eu velit et quam accumsan tempus at id velit. Duis elementum elementum purus, id tempus mauris posuere a. Nunc vestibulum sapien pellentesque lectus commodo ornare.</Text></Content>
              <ButtonGroup>
                <Button variant="secondary" onPress={chain(close, action('cancel'))}>Cancel</Button>
              </ButtonGroup>
            </Dialog>
          )}
        </DialogTrigger>
      </div>
    )
  )
  .add(
    'targetRef',
    (args) => (<TriggerWithRef type="popover" {...args} />)
  )
  .add(
    'alert dialog',
    (args) => renderAlert(args)
  )
  .add(
    'crossoffset examples',
    () => (
      <Flex gap="size-200" alignSelf="center">
        <Flex gap="size-200" direction="column" alignItems="start">
          <span>Left Top</span>
          <div><span>-50</span>{renderPopover({type: 'popover', placement: 'left top', crossOffset: -50}, false)}</div>
          <div><span>0</span>{renderPopover({type: 'popover', placement: 'left top'}, false)}</div>
          <div><span>50</span>{renderPopover({type: 'popover', placement: 'left top', crossOffset: 50}, false)}</div>
        </Flex>
        <Flex gap="size-200" direction="column" alignItems="start">
          <span>Left</span>
          <div><span>-50</span>{renderPopover({type: 'popover', placement: 'left', crossOffset: -50}, false)}</div>
          <div><span>0</span>{renderPopover({type: 'popover', placement: 'left'}, false)}</div>
          <div><span>50</span>{renderPopover({type: 'popover', placement: 'left', crossOffset: 50}, false)}</div>
        </Flex>
        <Flex gap="size-200" direction="column" alignItems="start">
          <span>Left Bottom</span>
          <div><span>-50</span>{renderPopover({type: 'popover', placement: 'left bottom', crossOffset: -50}, false)}</div>
          <div><span>0</span>{renderPopover({type: 'popover', placement: 'left bottom'}, false)}</div>
          <div><span>50</span>{renderPopover({type: 'popover', placement: 'left bottom', crossOffset: 50}, false)}</div>
        </Flex>
      </Flex>
    )
  )
  .add(
    'trigger visible through underlay',
    (args) => renderTriggerNotCentered(args)
  )
  .add(
    '2 popovers',
    () => (
      <Flex gap="size-200">
        <DialogTrigger type="popover">
          <ActionButton>Trigger</ActionButton>
          <Dialog>
            <Content>
              <input />
              <input />
            </Content>
          </Dialog>
        </DialogTrigger>
        <DialogTrigger type="popover">
          <ActionButton>Trigger</ActionButton>
          <Dialog><Content>Hi!</Content></Dialog>
        </DialogTrigger>
      </Flex>
    )
  )
  .add(
    'adjustable dialog',
    () => <AdjustableDialog />
  )
  .add(
    'withTooltip',
    () => (
      <div style={{display: 'flex', width: 'auto', margin: '100px 0'}}>
        <DialogTrigger isDismissable>
          <ActionButton>Trigger</ActionButton>
          <Dialog>
            <Heading>Has tooltip</Heading>
            <Divider />
            <Content>
              <p>Pressing escape when Tooltip is open closes Tooltip and not Dialog too.</p>
              <TooltipTrigger>
                <Button variant="cta">Has tooltip</Button>
                <Tooltip>Press escape</Tooltip>
              </TooltipTrigger>
            </Content>
          </Dialog>
        </DialogTrigger>
      </div>
    )
  );

function render(props) {
  let {width = 'auto', ...otherProps} = props;

  return (
    <div style={{display: 'flex', width, margin: '100px 0'}}>
      <DialogTrigger {...otherProps} onOpenChange={action('open change')}>
        <ActionButton>Trigger</ActionButton>
        {(close) => (
          <Dialog>
            <Heading id="foo">The Heading</Heading>
            <Header>The Header</Header>
            <Divider />
            <Content><Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin sit amet tristique risus. In sit amet suscipit lorem. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. In condimentum imperdiet metus non condimentum. Duis eu velit et quam accumsan tempus at id velit. Duis elementum elementum purus, id tempus mauris posuere a. Nunc vestibulum sapien pellentesque lectus commodo ornare.</Text></Content>
            {!props.isDismissable &&
              <ButtonGroup>
                <Button variant="secondary" onPress={chain(close, action('cancel'))}>Cancel</Button>
                <Button variant="cta" onPress={chain(close, action('confirm'))}>Confirm</Button>
              </ButtonGroup>}
          </Dialog>
        )}
      </DialogTrigger>
    </div>
  );
}

function renderTriggerNotCentered(props) {
  let {buttonHeight, buttonWidth, ...otherProps} = props;

  return (
    <div style={{position: 'absolute', top: '100px', left: '100px'}}>
      <div>action button shouldn't get any events if the underlay is up and you try to click it through the underlay</div>
      <DialogTrigger {...otherProps} isDismissable onOpenChange={action('open change')}>
        <ActionButton height={buttonHeight} width={buttonWidth} onPressStart={action('onPressStart')} onPress={action('onPress')} onPressEnd={action('onPressEnd')}>Trigger</ActionButton>
        <Dialog>
          <Heading>The Heading</Heading>
          <Header>The Header</Header>
          <Divider />
          <Content><Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin sit amet tristique risus. In sit amet suscipit lorem. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. In condimentum imperdiet metus non condimentum. Duis eu velit et quam accumsan tempus at id velit. Duis elementum elementum purus, id tempus mauris posuere a. Nunc vestibulum sapien pellentesque lectus commodo ornare.</Text></Content>
        </Dialog>
      </DialogTrigger>
    </div>
  );
}

function renderPopover(props, withMargin = true) {
  let {width = 'auto', buttonHeight, buttonWidth, ...otherProps} = props;

  return (
    <div style={{display: 'flex', width, margin: withMargin && '100px 0'}}>
      <DialogTrigger {...otherProps} onOpenChange={action('open change')}>
        <ActionButton height={buttonHeight} width={buttonWidth}>Trigger</ActionButton>
        <Dialog>
          <Heading>The Heading</Heading>
          <Header>The Header</Header>
          <Divider />
          <Content><Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin sit amet tristique risus. In sit amet suscipit lorem. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. In condimentum imperdiet metus non condimentum. Duis eu velit et quam accumsan tempus at id velit. Duis elementum elementum purus, id tempus mauris posuere a. Nunc vestibulum sapien pellentesque lectus commodo ornare.</Text></Content>
        </Dialog>
      </DialogTrigger>
    </div>
  );
}

let TriggerWithRef = (props) => {
  let {buttonHeight, buttonWidth, ...otherProps} = props;
  let ref = React.useRef();
  return (
    <div style={{display: 'flex'}}>
      <DialogTrigger {...otherProps} targetRef={ref} onOpenChange={action('open change')}>
        <ActionButton height={buttonHeight} width={buttonWidth}>Trigger</ActionButton>
        <Dialog>
          <Heading>The Heading</Heading>
          <Header>The Header</Header>
          <Divider />
          <Content><Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin sit amet tristique risus. In sit amet suscipit lorem. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. In condimentum imperdiet metus non condimentum. Duis eu velit et quam accumsan tempus at id velit. Duis elementum elementum purus, id tempus mauris posuere a. Nunc vestibulum sapien pellentesque lectus commodo ornare.</Text></Content>
        </Dialog>
      </DialogTrigger>
      <span ref={ref} style={{marginInlineStart: '200px'}}>Popover appears over here</span>
    </div>
  );
};


function renderAlert(props) {
  let {buttonHeight, buttonWidth, width = 'auto', ...otherProps} = props;

  return (
    <div style={{display: 'flex', width, margin: '100px 0'}}>
      <DialogTrigger {...otherProps} onOpenChange={action('open change')}>
        <ActionButton height={buttonHeight} width={buttonWidth}>Trigger</ActionButton>
        {(close) => (
          <AlertDialog title="Alert! Danger!" variant="error" primaryActionLabel="Accept" secondaryActionLabel="Whoa" cancelLabel="Cancel" onCancel={chain(close, action('cancel'))} onPrimaryAction={chain(close, action('primary'))} onSecondaryAction={chain(close, action('secondary'))}>
            <Text>Fine! No, absolutely fine. It's not like I don't have, you know, ten thousand other test subjects begging me to help them escape. You know, it's not like this place is about to EXPLODE.</Text>
          </AlertDialog>
        )}
      </DialogTrigger>
    </div>
  );
}

function AdjustableDialog() {
  let headingStrings = ['The Heading', 'The Heading of Maximum Truth That is Really Long to Go On and On a a a a a Again and Wraps'];
  let [showHero, setShowHero] = useState(false);
  let [heading, setHeading] = useState(headingStrings[0]);
  let [showHeader, setShowHeader] = useState(false);
  let [showTypeIcon, setShowTypeIcon] = useState(false);
  let [isDismissable, setIsDismissable] = useState(false);
  let [showFooter, setShowFooter] = useState(false);
  let [longButtonLabels, setLongButtonLabels] = useState(false);

  return (
    <Flex gap="size-200">
      <Flex direction="column" width="size-2000" gap="size-100">
        <Checkbox onChange={setShowHero}>Show Hero</Checkbox>
        <Checkbox onChange={(isChecked) => {isChecked ? setHeading(headingStrings[1]) : setHeading(headingStrings[0]);}}>Toggle Heading Values</Checkbox>
        <Checkbox onChange={setShowHeader}>Show Header</Checkbox>
        <Checkbox onChange={setShowTypeIcon}>Show TypeIcon</Checkbox>
        <Checkbox onChange={setIsDismissable}>Show Dismissable</Checkbox>
        <Checkbox onChange={setShowFooter}>Show Footer</Checkbox>
        <Checkbox onChange={setLongButtonLabels}>Show Long Button Labels</Checkbox>
      </Flex>
      <DialogTrigger isDismissable={isDismissable}>
        <ActionButton>Trigger</ActionButton>
        {(close) => (
          <Dialog>
            {showHero && <Image slot="hero" alt="" src="https://i.imgur.com/Z7AzH2c.png" objectFit="cover" />}
            <Heading>{heading}</Heading>
            {showHeader && <Header>This is a long header</Header>}
            {showTypeIcon && <AlertMedium
              slot="typeIcon"
              aria-label="Alert" />}
            <Divider />
            <Content><Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin sit amet tristique risus. In sit amet suscipit lorem. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. In condimentum imperdiet metus non condimentum. Duis eu velit et quam accumsan tempus at id velit. Duis elementum elementum purus, id tempus mauris posuere a. Nunc vestibulum sapien pellentesque lectus commodo ornare.</Text></Content>
            {showFooter && <Footer><Checkbox>I have read and accept the terms of use and privacy policy</Checkbox></Footer>}
            <ButtonGroup>
              <Button variant="secondary" onPress={chain(close, action('cancel'))}>Cancel {longButtonLabels && 'and close this dialog'}</Button>
              <Button variant="cta" onPress={chain(close, action('confirm'))}>Confirm {longButtonLabels && 'and close this dialog'}</Button>
            </ButtonGroup>
          </Dialog>
        )}
      </DialogTrigger>
    </Flex>
  );
}
