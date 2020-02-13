const {Packager} = require('@parcel/plugin');

module.exports = new Packager({
  async package({bundle, bundleGraph, options}) {
    let promises = [];
    bundle.traverseAssets(asset => {
      promises.push(parse(asset));
    });

    let nodes = {};

    let code = new Map(await Promise.all(promises));
    let cache = new Map();
    try {
      var result = processAsset(bundle.getMainEntry());
    } catch (err) {
      console.log(err.stack);
    }

    function processAsset(asset) {
      if (cache.has(asset.id)) {
        return cache.get(asset.id);
      }

      let res = {};
      cache.set(asset.id, res);
      _processAsset(asset, res);
      return res;
    }

    function _processAsset(asset, res) {
      let obj = processCode(asset, code.get(asset.id));
      for (let [exported] of asset.symbols) {
        let {asset: resolvedAsset, exportSymbol} = bundleGraph.resolveSymbol(asset, exported);
        let processed = resolvedAsset.id === asset.id ? obj : processAsset(resolvedAsset);
        if (exportSymbol === '*') {
          Object.assign(res, processed);
        } else {
          res[exported] = processed[exportSymbol];
        }
      }

      let deps = bundleGraph.getDependencies(asset);
      for (let dep of deps) {
        if (dep.symbols.get('*') === '*') {
          let resolved = bundleGraph.getDependencyResolution(dep);
          Object.assign(res, processAsset(resolved));
        }
      }
    }

    function processCode(asset, obj) {
      let res = {};
      let application;
      let paramStack = [];
      for (let exp in obj) {
        res[exp] = walk(obj[exp], (t, k, recurse) => {
          if (t && t.type === 'reference') {
            let dep = bundleGraph.getDependencies(asset).find(d => d.moduleSpecifier === t.specifier);
            let res = bundleGraph.getDependencyResolution(dep);
            let result = res ? processAsset(res)[t.imported] : null;
            if (result) {
              t = result;
            } else {
              return {
                type: 'identifier',
                name: t.local
              };
            }
          }

          if (t && t.type === 'application') {
            application = recurse(t.typeParameters);
          }

          let hasParams = false;
          if (t && (t.type === 'alias' || t.type === 'interface') && t.typeParameters && application) {
            let params = Object.assign({}, paramStack[paramStack.length - 1]);
            t.typeParameters.forEach((p, i) => {
              let v = application[i] || p.default;
              params[p.name] = v;
            });

            paramStack.push(params);
            hasParams = true;
          }

          t = recurse(t);

          if (hasParams) {
            paramStack.pop();
          }

          let params = paramStack[paramStack.length - 1];
          if (t && t.type === 'application') {
            application = null;
            if (t.base.type !== 'identifier') {
              return t.base;
            }
          }

          if (t && t.type === 'identifier' && params && params[t.name]) {
            return params[t.name];
          }

          if (t && t.type === 'interface') {
            let merged = mergeInterface(t);
            if (!nodes[t.id]) {
              nodes[t.id] = merged;
            }

            if (!k || k === 'props' || k === 'extends' || k === 'base') {
              return merged;
            }

            return {
              type: 'link',
              id: t.id
            };
          }

          if (t && t.type === 'alias') {
            if (k === 'base') {
              return t.value;
            }

            if (!nodes[t.id]) {
              nodes[t.id] = t;
            }

            return {
              type: 'link',
              id: t.id
            };
          }

          return t;
        });
      }
      return res;
    }

    let links = {};
    walkLinks(result);

    function walkLinks(obj) {
      walk(obj, (t, k, recurse) => {
        if (t && t.type === 'link') {
          links[t.id] = nodes[t.id];
          walkLinks(nodes[t.id]);
        }

        return recurse(t);
      });
    }

    return {contents: JSON.stringify({exports: result, links}, false, 2)};
  }
});

async function parse(asset) {
  let code = await asset.getCode();
  return [asset.id, JSON.parse(code)];
}

function walk(obj, fn, k = null) {
  let recurse = (obj) => {
    if (Array.isArray(obj)) {
      return obj.map((item, i) => walk(item, fn, k));
    } else if (obj && typeof obj === 'object') {
      let res = {};
      for (let key in obj) {
        res[key] = walk(obj[key], fn, key);
      }
      return res;
    } else {
      return obj;
    }
  };

  return fn(obj, k, recurse);
}

function mergeInterface(obj) {
  let properties = {};
  if (obj.type === 'interface') {
    merge(properties, obj.properties);

    for (let ext of obj.extends) {
      merge(properties, mergeInterface(ext).properties);
    }
  }

  return {
    type: 'interface',
    id: obj.id,
    name: obj.name,
    properties,
    typeParameters: obj.typeParameters,
    extends: []
  };
}

function merge(a, b) {
  for (let key in b) {
    if (!(key in a)) {
      a[key] = b[key];
    }
  }
}
