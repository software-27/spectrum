import {BreadcrumbItem} from '../';
import {cleanup, render} from '@testing-library/react';
import React from 'react';
import {triggerPress} from '@react-spectrum/test-utils'; 

// v3 component
describe('Breadcrumbs', function () {

  afterEach(() => {
    cleanup();
  });

  it('Handles defaults', () => {
    let {getByText} = render(<BreadcrumbItem >Breadcrumb item</BreadcrumbItem>);
    let breadcrumbItem = getByText('Breadcrumb item');
    expect(breadcrumbItem.id).toBeDefined();
    expect(breadcrumbItem.tabIndex).toBe(0);
  });

  it('Handles current', () => {
    let {getByText} = render(<BreadcrumbItem isCurrent >Breadcrumb item</BreadcrumbItem>);
    let breadcrumbItem = getByText('Breadcrumb item');
    expect(breadcrumbItem.tabIndex).toBe(-1);
    expect(breadcrumbItem).toHaveAttribute('aria-current', 'page');
  });

  it('Handles disabled', () => {
    let onPressSpy = jest.fn();
    let {getByText} = render(<BreadcrumbItem onPress={onPressSpy} isDisabled >Breadcrumb item</BreadcrumbItem>);
    let breadcrumbItem = getByText('Breadcrumb item');
    expect(breadcrumbItem.tabIndex).toBe(-1);
    expect(breadcrumbItem).toHaveAttribute('aria-disabled', 'true');
    triggerPress(breadcrumbItem);
    expect(onPressSpy).toHaveBeenCalledTimes(0);
  });

  it('Handles onPress', () => {
    let onPressSpy = jest.fn();
    let {getByText} = render(<BreadcrumbItem onPress={onPressSpy} >Breadcrumb item</BreadcrumbItem>);
    let breadcrumbItem = getByText('Breadcrumb item');
    triggerPress(breadcrumbItem);
    expect(onPressSpy).toHaveBeenCalledTimes(1);
  });

  it('Handles custom element type', () => {
    let {getByText} = render(
      <BreadcrumbItem>
        <a href="http://example.com/">Breadcrumb item </a>
      </BreadcrumbItem>
    );
    let breadcrumbItem = getByText('Breadcrumb item');
    expect(breadcrumbItem.id).toBeDefined();
    expect(breadcrumbItem.tabIndex).toBe(0);
    expect(breadcrumbItem.href).toBeDefined();
  });
});
