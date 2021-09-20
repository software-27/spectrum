/*
 * Copyright 2021 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import {AriaLabelingProps, AsyncLoadable, Collection, CollectionBase, Direction, DOMProps, KeyboardDelegate, LoadingState, MultipleSelection, Node, StyleProps} from '@react-types/shared';
import {Layout} from '@react-stately/virtualizer';
import {ReactNode} from 'react';

interface AriaCardProps extends AriaLabelingProps {}

interface SpectrumCardProps extends AriaCardProps, StyleProps, DOMProps {
  children: ReactNode,
  isQuiet?: boolean,
  layout?: 'grid' | 'waterfall' | 'gallery',
  // TODO: readd size when we get updated designs from spectrum
  // size?: 'S' | 'M' | 'L',
  // not needed for quiet cards
  orientation?: 'horizontal' | 'vertical'
}

interface LayoutOptions {
  // cardSize?: 'S' | 'M' | 'L',
  // cardOrientation?: 'horizontal' | 'vertical',
  collator?: Intl.Collator
}

// TODO: double check if this is the best way to type the layout provided to the CardView
interface CardViewLayout<T> extends Layout<Node<T>>, KeyboardDelegate {
  collection: Collection<Node<T>>,
  disabledKeys: any,
  isLoading: boolean,
  direction: Direction
}

export interface CardViewLayoutConstructor<T> {
  new (options?: LayoutOptions): CardViewLayout<T>
}

interface CardViewProps<T> extends CollectionBase<T>, MultipleSelection, Omit<AsyncLoadable, 'isLoading'> {
  // TODO: Does LayoutContructor and Layout give enough info for a user to know what to put in their own custom layout?
  // Replaced with CardViewLayout so that they know they need to have keyboardDelegate stuff as well as collection, disabledKeys, etc
  layout: CardViewLayoutConstructor<T> | CardViewLayout<T>,
  // TODO: readd size when we get updated designs from spectrum
  // cardSize?: 'S' | 'M' | 'L',
  // TODO: readd when we support horizontal cards in the layouts
  // cardOrientation?: 'horizontal' | 'vertical',
  isQuiet?: boolean,
  renderEmptyState?: () => ReactNode,
  loadingState?: LoadingState
}

export interface AriaCardViewProps<T> extends CardViewProps<T>, DOMProps, AriaLabelingProps {}

export interface SpectrumCardViewProps<T> extends AriaCardViewProps<T>, StyleProps {}
