import {exec, execSync} from 'child_process';
import fg from 'fast-glob';
import fs from 'fs';

let existingComponents = fg.sync('packages/@react-spectrum/*', {onlyFiles: false}).map(componentPath => componentPath.split('/')[componentPath.split('/').length - 1]);
let components = fg.sync('packages/\@adobe/spectrum-css-temp/components/*', {onlyFiles: false}).map(componentPath => componentPath.split('/')[componentPath.split('/').length - 1]);
let ignoreComponents = ['icon', 'README.md', 'utils', 'commons']; // complicated

function promiseFromChildProcess(child) {
  return new Promise(function (resolve, reject) {
    child.addListener('error', reject);
    child.addListener('exit', resolve);
  });
}

function getFilesizeInBytes(filename) {
  const stats = fs.statSync(filename);
  const fileSizeInBytes = stats.size;
  return fileSizeInBytes;
}

let promises = [];
console.log('components', components);
console.log('ignoreComponents', ignoreComponents);
console.log('existingComponents', existingComponents);
if (!fs.existsSync(`${__dirname}/temp`)) {
  fs.mkdirSync(`${__dirname}/temp`);
  components.forEach((componentName) => {
    console.log('componentName', componentName);
    if (ignoreComponents.includes(componentName)) {
      return;
    }
    let rootDir = `${__dirname}/temp/${componentName}`;
    if (!fs.existsSync(rootDir)) {
      fs.mkdirSync(rootDir);
    } else {
      return;
    }
    // TODO: yes, these are hard coded for now, whoever comes along next can figure out how to get these off the cli
    // it's also likely moving forward that base will be at components/${componentName}/ instead of at src
    promises.push(promiseFromChildProcess(exec(`cd ${__dirname}/../../spectrum-css; git show 1ab4e023b3db0e40556979555ebd69cdccceccac:src/${componentName}/index.css > ${rootDir}/index-basefile`)));
    promises.push(promiseFromChildProcess(exec(`cd ${__dirname}/../../spectrum-css; git show 1ab4e023b3db0e40556979555ebd69cdccceccac:src/${componentName}/skin.css > ${rootDir}/skin-basefile`)));
    promises.push(promiseFromChildProcess(exec(`cd ${__dirname}/../../spectrum-css; git show HEAD:components/${componentName}/index.css > ${rootDir}/index-remotefile`)));
    promises.push(promiseFromChildProcess(exec(`cd ${__dirname}/../../spectrum-css; git show HEAD:components/${componentName}/skin.css > ${rootDir}/skin-remotefile`)));
    promises.push(promiseFromChildProcess(exec(`cp ${__dirname}/../packages/@adobe/spectrum-css-temp/components/${componentName}/index.css ${rootDir}/index-localfile`)));
    promises.push(promiseFromChildProcess(exec(`cp ${__dirname}/../packages/@adobe/spectrum-css-temp/components/${componentName}/skin.css ${rootDir}/skin-localfile`)));

    if (!fs.existsSync(`${rootDir}/index.css`)) {
      fs.closeSync(fs.openSync(`${rootDir}/index.css`, 'w'));
    }
    if (!fs.existsSync(`${rootDir}/skin.css`)) {
      fs.closeSync(fs.openSync(`${rootDir}/skin.css`, 'w'));
    }
  });
} else {
  console.log('skipping creation of diff directory');
}

Promise.all(promises).then(() => {
  components.forEach(componentName => {
    if (ignoreComponents.includes(componentName)) {
      return;
    }
    let rootDir = `${__dirname}/temp/${componentName}`;
    // if the result file already exists,
    if (getFilesizeInBytes(`${rootDir}/index.css`) === 0) {
      if (fs.existsSync(`${rootDir}/index-basefile`)
        && fs.existsSync(`${rootDir}/index-remotefile`)
        && fs.existsSync(`${rootDir}/index-localfile`)) {

        try {
          execSync(`cd ${rootDir}; p4merge-cli index-basefile index-remotefile index-localfile index.css`);
        } catch (error) {
          console.log(componentName, 'index.css');
        }
      }
      if (getFilesizeInBytes(`${rootDir}/index.css`) > 0) {
        exec(`cp ${rootDir}/index.css ${__dirname}/../packages/@adobe/spectrum-css-temp/components/${componentName}/index.css`);
      }
    }


    if (getFilesizeInBytes(`${rootDir}/skin.css`) === 0) {
      if (fs.existsSync(`${rootDir}/skin-basefile`)
        && fs.existsSync(`${rootDir}/skin-remotefile`)
        && fs.existsSync(`${rootDir}/skin-localfile`)) {

        try {
          execSync(`cd ${rootDir}; p4merge-cli skin-basefile skin-remotefile skin-localfile skin.css`);
        } catch (error) {
          console.log(componentName, 'skin.css');
        }
      }
      if (getFilesizeInBytes(`${rootDir}/skin.css`) > 0) {
        exec(`cp ${rootDir}/skin.css ${__dirname}/../packages/@adobe/spectrum-css-temp/components/${componentName}/skin.css`);
      }
    }
  });
});
