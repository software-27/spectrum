import Alert from '@spectrum-icons/workflow/Alert';
import {classNames, filterDOMProps} from '@react-spectrum/utils';
import {ClearButton} from '@react-spectrum/button';
import {FocusRing} from '@react-aria/focus';
import React from 'react';
import styles from '@adobe/spectrum-css-temp/components/tags/vars.css';
import {TagProps} from '@react-types/tag';
import {useTag} from '@react-aria/tag';
import {useTagGroupProvider} from './TagGroup';

export const Tag = ((props: TagProps) => {
  const {
    className,
    isDisabled,
    isRemovable,
    validationState,
    ...otherProps
  } = props;
  const {
    isDisabled: isGroupDisabled,
    isRemovable: isGroupRemovable,
    validationState: groupValidationState,
    onRemove,
    role
  } =  useTagGroupProvider();

  let removable = isGroupRemovable !== undefined ? isGroupRemovable : isRemovable;
  let disabled = isGroupDisabled !== undefined ? isGroupDisabled : isDisabled;
  let isInvalid = (validationState !== undefined ? validationState : groupValidationState) === 'invalid';
  let {clearButtonProps, labelProps, tagProps} = useTag({
    ...props,
    isRemovable: removable,
    isDisabled: disabled,
    validationState: validationState !== undefined ? validationState : groupValidationState,
    onRemove: props.onRemove || onRemove,
    role
  });
  let {role: buttonRole, ...otherButtonProps} = clearButtonProps;
  let icon = props.icon || (isInvalid && <Alert />);

  return (
    <FocusRing focusRingClass={classNames(styles, 'focus-ring')}>
      <div
        {...filterDOMProps(otherProps)}
        {...tagProps}
        className={classNames(
          styles,
          'spectrum-Tags-item',
          {
            'is-disabled': disabled,
            // 'is-selected': isSelected,
            'spectrum-Tags-item--removable': removable,
            'is-invalid': isInvalid
          },
          className
        )}>
        {icon && React.cloneElement(icon, {size: 'S', className: classNames(styles, 'spectrum-Tags-itemIcon')})}
        <span
          {...labelProps}
          className={classNames(styles, 'spectrum-Tags-itemLabel')}>
          {props.children}
        </span>
        {removable &&
          <span role={buttonRole}>
            <ClearButton
              tabIndex={tagProps.tabIndex}
              focusClassName={classNames(styles, 'is-focused')}
              className={classNames(styles, 'spectrum-Tags-itemClearButton')}
              {...otherButtonProps} />
          </span>
        }
      </div>
    </FocusRing>
  );
});
