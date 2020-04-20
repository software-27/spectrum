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

import {CollectionBase, CollectionElement} from '@react-types/shared';
import {ItemStates, Node, PartialNode} from './types';
import React, {Key, ReactElement} from 'react';

interface CollectionBuilderState {
  renderer?: (value: any) => ReactElement,
  childKey?: string
}

export class CollectionBuilder<T> {
  private itemKey: string;
  private context?: unknown;
  private cache: Map<T, Node<T>> = new Map();
  private getItemStates: (key: Key) => ItemStates;

  constructor(itemKey: string) {
    this.itemKey = itemKey;
  }

  build(props: CollectionBase<T>, getItemStates?: (key: Key) => ItemStates, context?: unknown) {
    this.getItemStates = getItemStates || (() => ({}));
    this.context = context;
    return iterable(() => this.iterateCollection(props));
  }

  *iterateCollection(props: CollectionBase<T>) {
    let {children, items} = props;

    if (typeof children === 'function') {
      if (!items) {
        throw new Error('props.children was a function but props.items is missing');
      }

      for (let item of props.items) {
        yield* this.getFullNode({
          value: item
        }, {renderer: children, childKey: this.itemKey});
      }
    } else {
      let items = React.Children.toArray(children);
      for (let item of items) {
        yield* this.getFullNode({
          element: item
        }, {childKey: this.itemKey});
      }
    }
  }

  getKey(item: CollectionElement<T>, partialNode: PartialNode<T>, state: CollectionBuilderState, parentKey?: Key): Key {
    if (item.props.uniqueKey) {
      return item.props.uniqueKey;
    }

    if (item.key) {
      return parentKey ? `${parentKey}${item.key}` : item.key;
    }

    if (partialNode.type === 'cell' && partialNode.key) {
      return `${parentKey}${partialNode.key}`;
    }

    if (state.childKey && partialNode.value[state.childKey]) {
      return partialNode.value[state.childKey];
    }
  
    let v = partialNode.value as any;
    let key = v.key || v.id;
    if (key == null) {
      throw new Error('No key found for item');
    }
    
    return key;
  }

  getCached(item: T) {
    let node = this.cache.get(item);
    if (!node) {
      return;
    }

    if (node.type === 'section') {
      return node;
    }

    let states = this.getItemStates(node.key);
    if (shallowEqual(states, node)) {
      return node;
    }
  }

  getChildState(state: CollectionBuilderState, partialNode: PartialNode<T>) {
    return {
      renderer: partialNode.renderer || state.renderer,
      childKey: partialNode.childKey || state.childKey
    };
  }

  *getFullNode(partialNode: PartialNode<T>, state: CollectionBuilderState, parentKey?: Key, parentNode?: Node<T>): Generator<Node<T>> {
    // If there's a value instead of an element on the node, and a parent renderer function is available,
    // use it to render an element for the value.
    let element = partialNode.element;
    if (!element && partialNode.value && state && state.renderer) {
      let cached = this.getCached(partialNode.value);
      if (cached) {
        yield cached;
        return;
      }

      element = state.renderer(partialNode.value);
    }

    // If there's an element with a getCollectionNode function on its type, then it's a supported component.
    // Call this function to get a partial node, and recursively build a full node from there.
    if (element) {
      let type = element.type as any;
      if (typeof type !== 'function' || typeof type.getCollectionNode !== 'function') {
        let name = typeof element.type === 'function' ? element.type.name : element.type;
        throw new Error(`Unknown element <${name}> in collection.`);
      }

      let childNodes = type.getCollectionNode(element.props, this.context) as Generator<PartialNode<T>, void, Node<T>[]>;
      let result = childNodes.next();
      while (!result.done && result.value) {
        let childNode = result.value;
        let nodes = this.getFullNode({
          ...childNode,
          key: childNode.element ? null : this.getKey(element, partialNode, state, parentKey),
          index: partialNode.index,
          wrapper: compose(partialNode.wrapper, childNode.wrapper)
        }, this.getChildState(state, childNode), parentKey ? `${parentKey}${element.key}` : element.key, parentNode);

        let children = [...nodes];
        for (let node of children) {
          // Cache the node based on its value
          node.value = childNode.value || partialNode.value;
          if (node.value) {
            this.cache.set(node.value, node);
          }

          // The partial node may have specified a type for the child in order to specify a constraint.
          // Verify that the full node that was built recursively matches this type.
          if (partialNode.type && node.type !== partialNode.type) {
            throw new Error(`Unsupported type <${capitalize(node.type)}> in <${capitalize(parentNode.type)}>. Only <${capitalize(partialNode.type)}> is supported.`);
          }

          yield node;
        }

        result = childNodes.next(children);
      }

      return;
    }

    // Create full node
    let builder = this;
    let node: Node<T> = {
      type: partialNode.type,
      props: partialNode.props,
      key: partialNode.key,
      parentKey: parentNode ? parentNode.key : null,
      value: partialNode.value,
      level: parentNode ? parentNode.level + 1 : 0,
      index: partialNode.index,
      rendered: partialNode.rendered,
      textValue: partialNode.textValue,
      'aria-label': partialNode['aria-label'],
      wrapper: partialNode.wrapper,
      hasChildNodes: partialNode.hasChildNodes,
      childNodes: iterable(function *() {
        if (!partialNode.hasChildNodes) {
          return;
        }

        for (let child of partialNode.childNodes()) {
          // Ensure child keys are globally unique by prepending the parent node's key
          if (child.key) {
            child.key = `${node.key}${child.key}`;
          }

          yield* builder.getFullNode(child, builder.getChildState(state, child), node.key, node);
        }
      })
    };

    // Add states if the node is an item
    if (node.type === 'item') {
      Object.assign(node, this.getItemStates(node.key));
    }

    yield node;
  }
}

// Wraps an iterator function as an iterable object.
function iterable<T>(iterator: () => IterableIterator<Node<T>>): Iterable<Node<T>> {
  return {
    [Symbol.iterator]: iterator
  };
}

function shallowEqual<T>(a: T, b: T) {
  for (let key in a) {
    if (a[key] !== b[key]) {
      return false;
    }
  }

  return true;
}

type Wrapper = (element: ReactElement) => ReactElement;
function compose(outer: Wrapper | void, inner: Wrapper | void): Wrapper {
  if (outer && inner) {
    return (element) => outer(inner(element));
  }

  if (outer) {
    return outer;
  }

  if (inner) {
    return inner;
  }
}

function capitalize(str: string) {
  return str[0].toUpperCase() + str.slice(1);
}
