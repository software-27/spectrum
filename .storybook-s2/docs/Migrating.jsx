import { style } from '../../packages/@react-spectrum/s2/style/spectrum-theme' with {type: 'macro'};
import {Link} from '@react-spectrum/s2';
import {P, Code, Pre, H3, H2} from './typography';

export function Migrating() {
  return (
    <div className={style({maxWidth: 'lg', marginX: 'auto', fontFamily: 'sans'})}>
      <div className={style({marginX: 48})}>
        <h1 className={style({fontSize: 'heading-2xl', color: 'heading', marginBottom: 48})}>
          Migrating to Spectrum 2
        </h1>
        <P>An automated upgrade assistant is available by running the following command in the project you want to upgrade:</P>
        <Pre>npx @react-spectrum/codemods s1-to-s2</Pre>

        <P>To only upgrade specific components, provide a <Code>--components</Code> argument with a comma-separated list of components to upgrade:</P>

        <Pre>npx @react-spectrum/codemods s1-to-s2 --components=Button,TextField</Pre>

        <P>The following arguments are also available:</P>

        <ul className="sb-unstyled">
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}><Code>--path</Code> - Path to apply the upgrade changes to. Defaults to the current directory (<Code>.</Code>)</li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}><Code>--dry</Code> - Runs the upgrade assistant without making changes to components</li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}><Code>--ignore-pattern</Code> - Ignore files that match the provided glob expression. Defaults to <Code>'**/node_modules/**'</Code></li>
        </ul>

        <P>For cases that the upgrade assistant doesn't handle automatically or where you'd rather upgrade some components manually, use the guide below.</P>

        <P>Note that [PENDING] indicates that future changes will occur before the final release, and the current solution should be considered temporary.</P>

        <H2>Components</H2>
        <H3>All components</H3>
        <ul className="sb-unstyled">
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Update imports to use the <Code>@react-spectrum/s2</Code> package instead of <Code>@adobe/react-spectrum</Code> or individual packages like <Code>@react-spectrum/button</Code></li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Update <Link href="https://react-spectrum.adobe.com/react-spectrum/styling.html#style-props">style props</Link> to use the <Link href="/?path=/docs/style-macro--docs">style macro</Link> instead. See the 'Style props' section below</li>
        </ul>

        <H3>ActionButton</H3>
        <P>No updates needed.</P>

        <H3>ActionMenu</H3>
        <ul className="sb-unstyled">
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>[PENDING] Comment out <Code>closeOnSelect</Code> (it has not been implemented yet)</li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>[PENDING] Comment out <Code>trigger</Code> (it has not been implemented yet)</li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Update <Code>Item</Code> to be a <Code>MenuItem</Code></li>
        </ul>

        <H3>AlertDialog</H3>
        <P>No updates needed.</P>

        <H3>Avatar</H3>
        <ul className="sb-unstyled">
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>[PENDING] Comment out <Code>isDisabled</Code> (it has not been implemented yet)</li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Update <Code>size</Code> to be a pixel value if it currently matches <Code>'avatar-size-*'</Code></li>
        </ul>

        <H3>Breadcrumbs</H3>
        <ul className="sb-unstyled">
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>[PENDING] Comment out <Code>showRoot</Code> (it has not been implemented yet)</li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>[PENDING] Comment out <Code>isMultiline</Code> (it has not been implemented yet)</li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>[PENDING] Comment out <Code>autoFocusCurrent</Code> (it has not been implemented yet)</li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Remove <Code>size="S"</Code> (Small is no longer a supported size in Spectrum 2)</li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Update <Code>Item</Code> to be a <Code>Breadcrumb</Code></li>
        </ul>

        <H3>Button</H3>
        <ul className="sb-unstyled">
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Change <Code>variant="cta"</Code> to <Code>variant="accent"</Code></li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Change <Code>variant="overBackground"</Code> to <Code>variant="primary" staticColor="white"</Code></li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Change <Code>style</Code> to <Code>fillStyle</Code></li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>[PENDING] Comment out <Code>isPending</Code> (it has not been implemented yet)</li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Remove <Code>isQuiet</Code> (it is no longer supported in Spectrum 2)</li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>If <Code>href</Code> is present, the <Code>Button</Code> should be converted to a <Code>LinkButton</Code></li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Remove <Code>elementType</Code> (it is no longer supported in Spectrum 2)</li>
        </ul>

        <H3>ButtonGroup</H3>
        <P>No updates needed.</P>

        <H3>Checkbox</H3>
        <P>No updates needed.</P>

        <H3>CheckboxGroup</H3>
        <ul className="sb-unstyled">
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Remove <Code>showErrorIcon</Code> (it has been removed due to accessibility issues)</li>
        </ul>

        <H3>ColorArea</H3>
        <ul className="sb-unstyled">
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Remove <Code>size</Code> and instead provide a size via the style macro (i.e. <Code>{`styles={style({size: 20})}`}</Code>)</li>
        </ul>

        <H3>ColorField</H3>
        <ul className="sb-unstyled">
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Remove <Code>isQuiet</Code> (it is no longer supported in Spectrum 2)</li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Remove <Code>placeholder</Code> (it has been removed due to accessibility issues)</li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Change <Code>validationState="invalid"</Code> to <Code>isInvalid</Code></li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Remove <Code>validationState="valid"</Code> (it is no longer supported in Spectrum 2)</li>
        </ul>

        <H3>ColorSlider</H3>
        <ul className="sb-unstyled">
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Remove <Code>showValueLabel</Code> (it has been removed due to accessibility issues)</li>
        </ul>

        <H3>ColorSwatch</H3>
        <P>No updates needed.</P>

        <H3>ColorWheel</H3>
        <ul className="sb-unstyled">
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Remove <Code>size</Code> and instead provide a size via the style macro (i.e. <Code>{`styles={style({size: 20})}`}</Code>)</li>
        </ul>

        <H3>ComboBox</H3>
        <ul className="sb-unstyled">
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Change <Code>menuWidth</Code> value from a <Code>DimensionValue</Code> to a pixel value</li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Remove <Code>isQuiet</Code> (it is no longer supported in Spectrum 2)</li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>[PENDING] Comment out <Code>loadingState</Code> (it has not been implemented yet)</li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Remove <Code>placeholder</Code> (it is no longer supported in Spectrum 2)</li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Change <Code>validationState="invalid"</Code> to <Code>isInvalid</Code></li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Remove <Code>validationState="valid"</Code> (it is no longer supported in Spectrum 2)</li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>[PENDING] Comment out <Code>onLoadMore</Code> (it has not been implemented yet)</li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Update <Code>Item</Code> to be a <Code>ComboBoxItem</Code></li>
        </ul>

        <H3>Dialog</H3>
        <ul className="sb-unstyled">
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Update children to move render props from being the second child of <Code>DialogTrigger</Code> to being a child of <Code>Dialog</Code></li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Remove <Code>onDismiss</Code> and use <Code>onOpenChange</Code> on the <Code>DialogTrigger</Code>, or <Code>onDismiss</Code> on the <Code>DialogContainer</Code> instead</li>
        </ul>

        <H3>DialogTrigger</H3>
        <ul className="sb-unstyled">
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>[PENDING] Comment out <Code>type="tray"</Code> (<Code>Tray</Code> has not been implemented yet)</li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>[PENDING] Comment out <Code>mobileType="tray"</Code> (<Code>Tray</Code> has not been implemented yet)</li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Remove <Code>targetRef</Code> (it is no longer supported in Spectrum 2)</li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Update <Code>children</Code> to remove render props usage, and note that the <Code>close</Code> function was moved from <Code>DialogTrigger</Code> to <Code>Dialog</Code></li>
        </ul>

        <H3>Divider</H3>
        <ul className="sb-unstyled">
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Remove Divider component if within a Dialog (Updated design for Dialog in Spectrum 2)</li>
        </ul>

        <H3>Flex</H3>
        <ul className="sb-unstyled">
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Update <Code>Flex</Code> to be a <Code>div</Code> and apply flex styles using the style macro (i.e. <Code>{`<div className={style({display: 'flex'})} />`}</Code>)</li>
        </ul>

        <H3>Form</H3>
        <ul className="sb-unstyled">
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Remove <Code>isQuiet</Code> (it is no longer supported in Spectrum 2)</li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Remove <Code>isReadOnly</Code> (it is no longer supported in Spectrum 2)</li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Remove <Code>validationState</Code> (it is no longer supported in Spectrum 2)</li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Remove <Code>validationBehavior</Code> (it is no longer supported in Spectrum 2)</li>
        </ul>

        <H3>Grid</H3>
        <ul className="sb-unstyled">
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Update <Code>Grid</Code> to be a <Code>div</Code> and apply grid styles using the style macro (i.e. <Code>{`<div className={style({display: 'grid'})} />`}</Code>)</li>
        </ul>

        <H3>IllustratedMessage</H3>
        <ul className="sb-unstyled">
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Update illustrations to be from <Code>@react-spectrum/s2/illustrations</Code>. See <Link href="/?path=/docs/illustrations--docs">Illustrations</Link></li>
        </ul>

        <H3>InlineAlert</H3>
        <ul className="sb-unstyled">
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Change <Code>variant="info"</Code> to <Code>variant="informative"</Code></li>
        </ul>

        <H3>Item</H3>
        <ul className="sb-unstyled">
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>If within <Code>Menu</Code>: Update <Code>Item</Code> to be a <Code>MenuItem</Code></li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>If within <Code>ActionMenu</Code>: Update <Code>Item</Code> to be a <Code>MenuItem</Code></li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>If within <Code>TagGroup</Code>: Update <Code>Item</Code> to be a <Code>Tag</Code></li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>If within <Code>Breadcrumbs</Code>: Update <Code>Item</Code> to be a <Code>Breadcrumb</Code></li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>If within <Code>Picker</Code>: Update <Code>Item</Code> to be a <Code>PickerItem</Code></li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>If within <Code>ComboBox</Code>: Update <Code>Item</Code> to be a <Code>ComboBoxItem</Code></li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>If within <Code>ListBox</Code>: Update <Code>Item</Code> to be a <Code>ListBoxItem</Code></li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>If within <Code>TabList</Code>: Update <Code>Item</Code> to be a <Code>Tab</Code></li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>If within <Code>TabPanels</Code>: Update <Code>Item</Code> to be a <Code>TabPanel</Code> and remove surrounding <Code>TabPanels</Code></li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Update <Code>key</Code> to be <Code>id</Code> (and keep <Code>key</Code> if rendered inside <Code>array.map</Code>)</li>
        </ul>

        <H3>Link</H3>
        <ul className="sb-unstyled">
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Change <Code>variant="overBackground"</Code> to <Code>staticColor="white"</Code></li>
        </ul>

        <H3>ListBox</H3>
        <ul className="sb-unstyled">
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Update <Code>Item</Code> to be a <Code>ListBoxItem</Code></li>
        </ul>

        <H3>Menu</H3>
        <ul className="sb-unstyled">
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Update <Code>Item</Code> to be a <Code>MenuItem</Code></li>
        </ul>

        <H3>MenuTrigger</H3>
        <ul className="sb-unstyled">
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>[PENDING] Comment out <Code>closeOnSelect</Code> (it has not been implemented yet)</li>
        </ul>

        <H3>NumberField</H3>
        <ul className="sb-unstyled">
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Remove <Code>isQuiet</Code> (it is no longer supported in Spectrum 2)</li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Change <Code>validationState="invalid"</Code> to <Code>isInvalid</Code></li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Remove <Code>validationState="valid"</Code> (it is no longer supported in Spectrum 2)</li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>[PENDING] Comment out <Code>hideStepper</Code> (it has not been implemented yet)</li>
        </ul>

        <H3>Picker</H3>
        <ul className="sb-unstyled">
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Change <Code>menuWidth</Code> value from a <Code>DimensionValue</Code> to a pixel value</li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Remove <Code>isQuiet</Code> (it is no longer supported in Spectrum 2)</li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Change <Code>validationState="invalid"</Code> to <Code>isInvalid</Code></li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Remove <Code>validationState="valid"</Code> (it is no longer supported in Spectrum 2)</li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>[PENDING] Comment out <Code>isLoading</Code> (it has not been implemented yet)</li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>[PENDING] Comment out <Code>onLoadMore</Code> (it has not been implemented yet)</li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Update <Code>Item</Code> to be a <Code>PickerItem</Code></li>
        </ul>

        <H3>ProgressBar</H3>
        <ul className="sb-unstyled">
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Change <Code>variant="overBackground"</Code> to <Code>staticColor="white"</Code></li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>[PENDING] Comment out <Code>labelPosition</Code> (it has not been implemented yet)</li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>[PENDING] Comment out <Code>showValueLabel</Code> (it has not been implemented yet)</li>
        </ul>

        <H3>ProgressCircle</H3>
        <ul className="sb-unstyled">
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Change <Code>variant="overBackground"</Code> to <Code>staticColor="white"</Code></li>
        </ul>

        <H3>Radio</H3>
        <P>No updates needed.</P>

        <H3>RadioGroup</H3>
        <ul className="sb-unstyled">
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Change <Code>validationState="invalid"</Code> to <Code>isInvalid</Code></li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Remove <Code>validationState="valid"</Code> (it is no longer supported in Spectrum 2)</li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Remove <Code>showErrorIcon</Code> (it has been removed due to accessibility issues)</li>
        </ul>

        <H3>RangeSlider</H3>
        <ul className="sb-unstyled">
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Remove <Code>showValueLabel</Code> (it has been removed due to accessibility issues)</li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>[PENDING] Comment out <Code>getValueLabel</Code> (it has not been implemented yet)</li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>[PENDING] Comment out <Code>orientation</Code> (it has not been implemented yet)</li>
        </ul>

        <H3>SearchField</H3>
        <ul className="sb-unstyled">
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Remove <Code>placeholder</Code> (it has been removed due to accessibility issues)</li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>[PENDING] Comment out icon (it has not been implemented yet)</li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Remove <Code>isQuiet</Code> (it is no longer supported in Spectrum 2)</li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Change <Code>validationState="invalid"</Code> to <Code>isInvalid</Code></li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Remove <Code>validationState="valid"</Code> (it is no longer supported in Spectrum 2)</li>
        </ul>

        <H3>Section</H3>
        <ul className="sb-unstyled">
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>If within <Code>Menu</Code>: Update <Code>Section</Code> to be a <Code>MenuSection</Code></li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>If within <Code>Picker</Code>: Update <Code>Section</Code> to be a <Code>PickerSection</Code></li>
        </ul>

        <H3>Slider</H3>
        <ul className="sb-unstyled">
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Remove <Code>isFilled</Code> (Slider is always filled in Spectrum 2)</li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Remove <Code>trackGradient</Code> (Not supported in S2 design)</li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Remove <Code>showValueLabel</Code> (it has been removed due to accessibility issues)</li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>[PENDING] Comment out <Code>getValueLabel</Code> (it has not been implemented yet)</li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>[PENDING] Comment out <Code>orientation</Code> (it has not been implemented yet)</li>
        </ul>

        <H3>StatusLight</H3>
        <ul className="sb-unstyled">
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Remove <Code>isDisabled</Code> (it is no longer supported in Spectrum 2)</li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Change <Code>variant="info"</Code> to <Code>variant="informative"</Code></li>
        </ul>

        <H3>SubmenuTrigger</H3>
        <P>No updates needed.</P>

        <H3>Switch</H3>
        <P>No updates needed.</P>

        <H3>Tabs</H3>
        <ul className="sb-unstyled">
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Inside <Code>TabList</Code>: Update <Code>Item</Code> to be <Code>Tab</Code></li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Inside <Code>TabPanels</Code>: Update <Code>Item</Code> to be a <Code>TabPanel</Code> and remove the surrounding <Code>TabPanels</Code></li>
        </ul>

        <H3>TagGroup</H3>
        <ul className="sb-unstyled">
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Rename <Code>actionLabel</Code> to <Code>groupActionLabel</Code></li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Rename <Code>onAction</Code> to <Code>onGroupAction</Code></li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Change <Code>validationState="invalid"</Code> to <Code>isInvalid</Code></li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Update <Code>Item</Code> to be <Code>Tag</Code></li>
        </ul>

        <H3>TextArea</H3>
        <ul className="sb-unstyled">
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>[PENDING] Comment out <Code>icon</Code> (it has not been implemented yet)</li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Remove <Code>isQuiet</Code> (it is no longer supported in Spectrum 2)</li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Remove <Code>placeholder</Code>  (it has been removed due to accessibility issues)</li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Change <Code>validationState="invalid"</Code> to <Code>isInvalid</Code></li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Remove <Code>validationState="valid"</Code> (it is no longer supported in Spectrum 2)</li>
        </ul>

        <H3>TextField</H3>
        <ul className="sb-unstyled">
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>[PENDING] Comment out <Code>icon</Code> (it has not been implemented yet)</li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Remove <Code>isQuiet</Code> (it is no longer supported in Spectrum 2)</li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Remove <Code>placeholder</Code>  (it has been removed due to accessibility issues)</li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Change <Code>validationState="invalid"</Code> to <Code>isInvalid</Code></li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Remove <Code>validationState="valid"</Code> (it is no longer supported in Spectrum 2)</li>
        </ul>

        <H3>ToggleButton</H3>
        <P>No updates needed.</P>

        <H3>Tooltip</H3>
        <ul className="sb-unstyled">
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Remove <Code>variant</Code> (it is no longer supported in Spectrum 2)</li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Remove <Code>placement</Code> and add to the parent <Code>TooltipTrigger</Code> instead</li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Remove <Code>showIcon</Code> (it is no longer supported in Spectrum 2)</li>
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Remove <Code>isOpen</Code> and add to the parent <Code>TooltipTrigger</Code> instead</li>
        </ul>

        <H3>TooltipTrigger</H3>
        <ul className="sb-unstyled">
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Update placement prop to be have one value (i.e. Update <Code>placement="bottom left"</Code> to be <Code>placement="bottom"</Code>)</li>
        </ul>

        <H3>View</H3>
        <ul className="sb-unstyled">
          <li className={style({lineHeight: 'body', color: 'body', marginY: 8})}>Update <Code>View</Code> to be a <Code>div</Code> and apply styles using the style macro</li>
        </ul>

        <H2>Style props</H2>
        <P>React Spectrum v3 supported a limited set of <Link href="https://react-spectrum.adobe.com/react-spectrum/styling.html#style-props">style props</Link> for layout and positioning using Spectrum-defined values. Usage of these should be updated to instead use the <Link href="/?path=/docs/style-macro--docs">style macro</Link>.</P>
        <P>Example:</P>
        <pre className={'sb-unstyled ' + style({padding: 32, marginY: 32, backgroundColor: 'layer-1', borderRadius: 'xl', fontFamily: 'code', fontSize: 'code-sm', lineHeight: 'code'})}>
          <div className={style({backgroundColor: 'red-200'})}>{`- import {ActionButton} from '@adobe/react-spectrum';`}</div>
          <div className={style({backgroundColor: 'green-200'})}>{`+ import {ActionButton} from '@react-spectrum/s2';`}</div>
          <div className={style({backgroundColor: 'green-200'})}>{`+ import {style} from '@react-spectrum/s2/style' with {type: 'macro'};`}</div>
          <div>{'\n'}</div>
          <div className={style({backgroundColor: 'red-200'})}>{`- <ActionButton marginStart="size-100">`}</div>
          <div className={style({backgroundColor: 'green-200'})}>{`+ <ActionButton styles={style({marginStart: 8})}>`}</div>
          <div>{`    Edit`}</div>
          <div>{`  </ActionButton>`}</div>
        </pre>

        <H3>Border width</H3>
        <P>Affected style props: <Code>borderWidth</Code>, <Code>borderStartWidth</Code>, <Code>borderEndWidth</Code>, <Code>borderTopWidth</Code>, <Code>borderBottomWidth</Code>, <Code>borderXWidth</Code>, <Code>borderYWidth</Code>.</P>
        <P>Example:</P>
        <pre className={'sb-unstyled ' + style({padding: 32, marginY: 32, backgroundColor: 'layer-1', borderRadius: 'xl', fontFamily: 'code', fontSize: 'code-sm', lineHeight: 'code'})}>
          <div className={style({backgroundColor: 'red-200'})}>{`- <View borderWidth="thin"  />`}</div>
          <div className={style({backgroundColor: 'green-200'})}>{`+ <div className={style({borderWidth: 1})} />`}</div>
        </pre>
        <P>Border widths should be updated to use pixel values. Use the following mappings:</P>
        <table>
          <tr>
            <th>Spectrum 1</th>
            <th>Spectrum 2</th>
          </tr>
          <tr>
            <td><Code>'none'</Code></td>
            <td><Code>0</Code></td>
          </tr>
          <tr>
            <td><Code>'thin'</Code></td>
            <td><Code>1</Code></td>
          </tr>
          <tr>
            <td><Code>'thick'</Code></td>
            <td><Code>2</Code></td>
          </tr>
          <tr>
            <td><Code>'thicker'</Code></td>
            <td><Code>4</Code></td>
          </tr>
          <tr>
            <td><Code>'thickest'</Code></td>
            <td><Code>'[8px]'</Code></td>
          </tr>
        </table>

        <H3>Border radius</H3>
        <P>Affected style props: <Code>borderRadius</Code>, <Code>borderTopStartRadius</Code>, <Code>borderTopEndRadius</Code>, <Code>borderBottomStartRadius</Code>, <Code>borderBottomEndRadius</Code>.</P>
        <P>Example:</P>
        <pre className={'sb-unstyled ' + style({padding: 32, marginY: 32, backgroundColor: 'layer-1', borderRadius: 'xl', fontFamily: 'code', fontSize: 'code-sm', lineHeight: 'code'})}>
          <div className={style({backgroundColor: 'red-200'})}>{`- <View borderRadius="small"  />`}</div>
          <div className={style({backgroundColor: 'green-200'})}>{`+ <div className={style({borderRadius: 'sm'})} />`}</div>
        </pre>
        <P>Border radius values should be updated to use pixel values. Use the following mappings:</P>
          <table>
          <tr>
            <th>Spectrum 1</th>
            <th>Spectrum 2</th>
          </tr>
          <tr>
            <td><Code>'xsmall'</Code></td>
            <td><Code>'[1px]'</Code></td>
          </tr>
          <tr>
            <td><Code>'small'</Code></td>
            <td><Code>'sm'</Code></td>
          </tr>
          <tr>
            <td><Code>'regular'</Code></td>
            <td><Code>'default'</Code></td>
          </tr>
          <tr>
            <td><Code>'medium'</Code></td>
            <td><Code>'lg'</Code></td>
          </tr>
          <tr>
            <td><Code>'large'</Code></td>
            <td><Code>'xl'</Code></td>
          </tr>            
        </table>

        <H3>Dimension values</H3>
        <P>Affected style props: <Code>width</Code>, <Code>minWidth</Code>, <Code>maxWidth</Code>, <Code>height</Code>, <Code>minHeight</Code>, <Code>maxHeight</Code>, <Code>margin</Code>, <Code>marginStart</Code>, <Code>marginEnd</Code>, <Code>marginTop</Code>, <Code>marginBottom</Code>, <Code>marginX</Code>, <Code>marginY</Code>, <Code>top</Code>, <Code>bottom</Code>, <Code>left</Code>, <Code>right</Code>, <Code>start</Code>, <Code>end</Code>, <Code>flexBasis</Code>, <Code>gap</Code>, <Code>columnGap</Code>, <Code>rowGap</Code>, <Code>padding</Code>, <Code>paddingX</Code>, <Code>paddingY</Code>, <Code>paddingStart</Code>, <Code>paddingEnd</Code>, <Code>paddingTop</Code>, <Code>paddingBottom</Code>.</P>
        <P>Example:</P>
        <pre className={'sb-unstyled ' + style({padding: 32, marginY: 32, backgroundColor: 'layer-1', borderRadius: 'xl', fontFamily: 'code', fontSize: 'code-sm', lineHeight: 'code'})}>
          <div className={style({backgroundColor: 'red-200'})}>{`- <ActionButton marginStart="size-100">`}</div>
          <div className={style({backgroundColor: 'green-200'})}>{`+ <ActionButton styles={style({marginStart: 8})}>`}</div>
          <div>{`    Edit`}</div>
          <div>{`  </ActionButton>`}</div>
        </pre>
        <P>Dimension values should be converted to pixel values. Use the following mappings:</P>
          <table>
          <tr>
            <th>Spectrum 1</th>
            <th>Spectrum 2</th>
          </tr>
          <tr>
            <td><Code>'size-0'</Code></td>
            <td><Code>0</Code></td>
          </tr>
          <tr>
            <td><Code>'size-10'</Code></td>
            <td><Code>1</Code></td>
          </tr>
          <tr>
            <td><Code>'size-25'</Code></td>
            <td><Code>2</Code></td>
          </tr>
          <tr>
            <td><Code>'size-40'</Code></td>
            <td><Code>3</Code></td>
          </tr>
          <tr>
            <td><Code>'size-50'</Code></td>
            <td><Code>4</Code></td>
          </tr>
          <tr>
            <td><Code>'size-65'</Code></td>
            <td><Code>5</Code></td>
          </tr>
          <tr>
            <td><Code>'size-75'</Code></td>
            <td><Code>6</Code></td>
          </tr>
          <tr>
            <td><Code>'size-85'</Code></td>
            <td><Code>7</Code></td>
          </tr>
          <tr>
            <td><Code>'size-100'</Code></td>
            <td><Code>8</Code></td>
          </tr>
          <tr>
            <td><Code>'size-115'</Code></td>
            <td><Code>9</Code></td>
          </tr>
          <tr>
            <td><Code>'size-125'</Code></td>
            <td><Code>10</Code></td>
          </tr>
          <tr>
            <td><Code>'size-130'</Code></td>
            <td><Code>11</Code></td>
          </tr>
          <tr>
            <td><Code>'size-150'</Code></td>
            <td><Code>12</Code></td>
          </tr>
          <tr>
            <td><Code>'size-160'</Code></td>
            <td><Code>13</Code></td>
          </tr>
          <tr>
            <td><Code>'size-175'</Code></td>
            <td><Code>14</Code></td>
          </tr>
          <tr>
            <td><Code>'size-200'</Code></td>
            <td><Code>16</Code></td>
          </tr>
          <tr>
            <td><Code>'size-225'</Code></td>
            <td><Code>18</Code></td>
          </tr>
          <tr>
            <td><Code>'size-250'</Code></td>
            <td><Code>20</Code></td>
          </tr>
          <tr>
            <td><Code>'size-275'</Code></td>
            <td><Code>22</Code></td>
          </tr>
          <tr>
            <td><Code>'size-300'</Code></td>
            <td><Code>24</Code></td>
          </tr>
          <tr>
            <td><Code>'size-325'</Code></td>
            <td><Code>26</Code></td>
          </tr>
          <tr>
            <td><Code>'size-350'</Code></td>
            <td><Code>28</Code></td>
          </tr>
          <tr>
            <td><Code>'size-400'</Code></td>
            <td><Code>32</Code></td>
          </tr>
          <tr>
            <td><Code>'size-450'</Code></td>
            <td><Code>36</Code></td>
          </tr>
          <tr>
            <td><Code>'size-500'</Code></td>
            <td><Code>40</Code></td>
          </tr>
          <tr>
            <td><Code>'size-550'</Code></td>
            <td><Code>44</Code></td>
          </tr>
          <tr>
            <td><Code>'size-600'</Code></td>
            <td><Code>48</Code></td>
          </tr>
          <tr>
            <td><Code>'size-675'</Code></td>
            <td><Code>54</Code></td>
          </tr>
          <tr>
            <td><Code>'size-700'</Code></td>
            <td><Code>56</Code></td>
          </tr>
          <tr>
            <td><Code>'size-800'</Code></td>
            <td><Code>64</Code></td>
          </tr>
          <tr>
            <td><Code>'size-900'</Code></td>
            <td><Code>72</Code></td>
          </tr>
          <tr>
            <td><Code>'size-1000'</Code></td>
            <td><Code>80</Code></td>
          </tr>
          <tr>
            <td><Code>'size-1200'</Code></td>
            <td><Code>96</Code></td>
          </tr>
          <tr>
            <td><Code>'size-1250'</Code></td>
            <td><Code>100</Code></td>
          </tr>
          <tr>
            <td><Code>'size-1600'</Code></td>
            <td><Code>128</Code></td>
          </tr>
          <tr>
            <td><Code>'size-1700'</Code></td>
            <td><Code>136</Code></td>
          </tr>
          <tr>
            <td><Code>'size-2000'</Code></td>
            <td><Code>160</Code></td>
          </tr>
          <tr>
            <td><Code>'size-2400'</Code></td>
            <td><Code>192</Code></td>
          </tr>
          <tr>
            <td><Code>'size-3000'</Code></td>
            <td><Code>240</Code></td>
          </tr>
          <tr>
            <td><Code>'size-3400'</Code></td>
            <td><Code>272</Code></td>
          </tr>
          <tr>
            <td><Code>'size-3600'</Code></td>
            <td><Code>288</Code></td>
          </tr>
          <tr>
            <td><Code>'size-4600'</Code></td>
            <td><Code>368</Code></td>
          </tr>
          <tr>
            <td><Code>'size-5000'</Code></td>
            <td><Code>400</Code></td>
          </tr>
          <tr>
            <td><Code>'size-6000'</Code></td>
            <td><Code>480</Code></td>
          </tr>
          <tr>
            <td><Code>'static-size-0'</Code></td>
            <td><Code>0</Code></td>
          </tr>
          <tr>
            <td><Code>'static-size-10'</Code></td>
            <td><Code>1</Code></td>
          </tr>
          <tr>
            <td><Code>'static-size-25'</Code></td>
            <td><Code>2</Code></td>
          </tr>
          <tr>
            <td><Code>'static-size-40'</Code></td>
            <td><Code>3</Code></td>
          </tr>
          <tr>
            <td><Code>'static-size-50'</Code></td>
            <td><Code>4</Code></td>
          </tr>
          <tr>
            <td><Code>'static-size-65'</Code></td>
            <td><Code>5</Code></td>
          </tr>
          <tr>
            <td><Code>'static-size-100'</Code></td>
            <td><Code>8</Code></td>
          </tr>
          <tr>
            <td><Code>'static-size-115'</Code></td>
            <td><Code>9</Code></td>
          </tr>
          <tr>
            <td><Code>'static-size-125'</Code></td>
            <td><Code>10</Code></td>
          </tr>
          <tr>
            <td><Code>'static-size-130'</Code></td>
            <td><Code>11</Code></td>
          </tr>
          <tr>
            <td><Code>'static-size-150'</Code></td>
            <td><Code>12</Code></td>
          </tr>
          <tr>
            <td><Code>'static-size-160'</Code></td>
            <td><Code>13</Code></td>
          </tr>
          <tr>
            <td><Code>'static-size-175'</Code></td>
            <td><Code>14</Code></td>
          </tr>
          <tr>
            <td><Code>'static-size-200'</Code></td>
            <td><Code>16</Code></td>
          </tr>
          <tr>
            <td><Code>'static-size-225'</Code></td>
            <td><Code>18</Code></td>
          </tr>
          <tr>
            <td><Code>'static-size-250'</Code></td>
            <td><Code>20</Code></td>
          </tr>
          <tr>
            <td><Code>'static-size-300'</Code></td>
            <td><Code>24</Code></td>
          </tr>
          <tr>
            <td><Code>'static-size-400'</Code></td>
            <td><Code>32</Code></td>
          </tr>
          <tr>
            <td><Code>'static-size-450'</Code></td>
            <td><Code>36</Code></td>
          </tr>
          <tr>
            <td><Code>'static-size-500'</Code></td>
            <td><Code>40</Code></td>
          </tr>
          <tr>
            <td><Code>'static-size-550'</Code></td>
            <td><Code>44</Code></td>
          </tr>
          <tr>
            <td><Code>'static-size-600'</Code></td>
            <td><Code>48</Code></td>
          </tr>
          <tr>
            <td><Code>'static-size-700'</Code></td>
            <td><Code>56</Code></td>
          </tr>
          <tr>
            <td><Code>'static-size-800'</Code></td>
            <td><Code>64</Code></td>
          </tr>
          <tr>
            <td><Code>'static-size-900'</Code></td>
            <td><Code>72</Code></td>
          </tr>
          <tr>
            <td><Code>'static-size-1000'</Code></td>
            <td><Code>80</Code></td>
          </tr>
          <tr>
            <td><Code>'static-size-1200'</Code></td>
            <td><Code>96</Code></td>
          </tr>
          <tr>
            <td><Code>'static-size-1700'</Code></td>
            <td><Code>136</Code></td>
          </tr>
          <tr>
            <td><Code>'static-size-2400'</Code></td>
            <td><Code>192</Code></td>
          </tr>
          <tr>
            <td><Code>'static-size-2600'</Code></td>
            <td><Code>208</Code></td>
          </tr>
          <tr>
            <td><Code>'static-size-3400'</Code></td>
            <td><Code>272</Code></td>
          </tr>
          <tr>
            <td><Code>'static-size-3600'</Code></td>
            <td><Code>288</Code></td>
          </tr>
          <tr>
            <td><Code>'static-size-4600'</Code></td>
            <td><Code>368</Code></td>
          </tr>
          <tr>
            <td><Code>'static-size-5000'</Code></td>
            <td><Code>400</Code></td>
          </tr>
          <tr>
            <td><Code>'static-size-6000'</Code></td>
            <td><Code>480</Code></td>
          </tr>
          <tr>
            <td><Code>'single-line-height'</Code></td>
            <td><Code>32</Code></td>
          </tr>
          <tr>
            <td><Code>'single-line-width'</Code></td>
            <td><Code>192</Code></td>
          </tr>
        </table>

        <H3>Break points</H3>
        <P>Break points previously used in style props can be used in the style macro with updated keys. Use the following mappings:</P>
        <table>
          <tr>
            <th>Spectrum 1</th>
            <th>Spectrum 2</th>
          </tr>
          <tr>
            <td><Code>base</Code></td>
            <td><Code>default</Code></td>
          </tr>
          <tr>
            <td><Code>S</Code></td>
            <td><Code>sm</Code></td>
          </tr>
          <tr>
            <td><Code>M</Code></td>
            <td><Code>md</Code></td>
          </tr>
          <tr>
            <td><Code>L</Code></td>
            <td><Code>lg</Code></td>
          </tr>
        </table>
        <P>Example:</P>
        <pre className={'sb-unstyled ' + style({padding: 32, marginY: 32, backgroundColor: 'layer-1', borderRadius: 'xl', fontFamily: 'code', fontSize: 'code-sm', lineHeight: 'code'})}>
          <div className={style({backgroundColor: 'red-200'})}>{`- <View width={{ base: 'size-2000', L: 'size-5000' }} />`}</div>
          <div className={style({backgroundColor: 'green-200'})}>{`+ <div className={style({width: {default: 160, lg: '[400px]'}) />`}</div>
        </pre>
      </div>
    </div>
  );
}
