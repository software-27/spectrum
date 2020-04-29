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

const {Packager} = require('@parcel/plugin');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const requireFromString = require('require-from-string');
const {bufferStream, urlJoin} = require('@parcel/utils');
const {Readable} = require('stream');

module.exports = new Packager({
  async package({bundle, bundleGraph, getInlineBundleContents}) {
    let mainAsset = bundle.getMainEntry();
    let inlineBundle;
    bundleGraph.traverseBundles((bundle, context, {stop}) => {
      let entry = bundle.getMainEntry();
      if (bundle.type === 'js' && bundle.isInline && entry && entry.filePath === mainAsset.filePath) {
        inlineBundle = bundle;
        stop();
      }
    });

    let bundleResult = await getInlineBundleContents(inlineBundle, bundleGraph);
    let contents = (bundleResult.contents instanceof Readable ? await bufferStream(bundleResult.contents) : bundleResult.contents).toString();
    let Component = requireFromString(contents, mainAsset.filePath).default;

    // Insert references to sibling bundles. For example, a <script> tag in the original HTML
    // may import CSS files. This will result in a sibling bundle in the same bundle group as the
    // JS. This will be inserted as a <link> element into the HTML here.
    let dependencies = [];
    bundle.traverse(node => {
      if (node.type === 'dependency') {
        dependencies.push(node.value);
      }
    });

    let bundleGroups = dependencies
      .map(d => bundleGraph.resolveExternalDependency(d, bundle))
      .filter(d => d != null)
      .map(d => d.value);

    let bundles = bundleGroups.reduce((p, bundleGroup) => {
      let bundles = bundleGraph.getBundlesInBundleGroup(bundleGroup);
      return p.concat(bundles);
    }, []);

    let pages = [];
    bundleGraph.traverseBundles(b => {
      if (b.isEntry && b.type === 'html') {
        let meta = b.getMainEntry().meta;
        pages.push({
          url: urlJoin(b.target.publicUrl, b.name),
          name: b.name,
          title: meta.title,
          category: meta.category
        });
      }
    });

    let code = ReactDOMServer.renderToStaticMarkup(
      React.createElement(Component, {
        scripts: bundles.filter(b => b.type === 'js' && !b.isInline).map(b => ({
          type: b.env.outputFormat === 'esmodule' ? 'module' : undefined,
          url: urlJoin(b.target.publicUrl, b.name)
        })),
        styles: bundles.filter(b => b.type === 'css').map(b => ({
          url: urlJoin(b.target.publicUrl, b.name)
        })),
        pages,
        currentPage: {
          name: bundle.name,
          title: mainAsset.meta.title,
          url: urlJoin(bundle.target.publicUrl, bundle.name)
        },
        toc: mainAsset.meta.toc,
        publicUrl: bundle.target.publicUrl
      })
    );

    return {
      contents: '<!doctype html>' + code
    };
  }
});
