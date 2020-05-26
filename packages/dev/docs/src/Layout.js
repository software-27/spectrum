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

import ChevronLeft from '@spectrum-icons/ui/ChevronLeftLarge';
import classNames from 'classnames';
import {Divider} from '@react-spectrum/divider';
import docStyles from './docs.css';
import {getAnchorProps} from './utils';
import highlightCss from './syntax-highlight.css';
import {ImageContext} from './Image';
import {LinkProvider} from './types';
import linkStyle from '@adobe/spectrum-css-temp/components/link/vars.css';
import {MDXProvider} from '@mdx-js/react';
import React from 'react';
import ruleStyles from '@adobe/spectrum-css-temp/components/rule/vars.css';
import sideNavStyles from '@adobe/spectrum-css-temp/components/sidenav/vars.css';
import {theme} from '@react-spectrum/theme-default';
import {ToC} from './ToC';
import typographyStyles from '@adobe/spectrum-css-temp/components/typography/vars.css';

const mdxComponents = {
  h1: ({children, ...props}) => (
    <h1 {...props} className={classNames(typographyStyles['spectrum-Heading1--display'], typographyStyles['spectrum-Article'], docStyles['articleHeader'])}>
      {children}
    </h1>
  ),
  h2: ({children, ...props}) => (
    <>
      <h2 {...props} className={classNames(typographyStyles['spectrum-Heading3'], docStyles['sectionHeader'], docStyles['docsHeader'])}>
        {children}
        <span className={classNames(docStyles['headingAnchor'])}>
          <a className={classNames(linkStyle['spectrum-Link'], docStyles['anchor'])} href={`#${props.id}`}>#</a>
        </span>
      </h2>
      <Divider marginBottom="33px" />
    </>
  ),
  h3: ({children, ...props}) => (
    <h3 {...props} className={classNames(typographyStyles['spectrum-Heading4'], docStyles['sectionHeader'], docStyles['docsHeader'])}>
      {children}
      <span className={docStyles['headingAnchor']}>
        <a className={classNames(linkStyle['spectrum-Link'], docStyles['anchor'])} href={`#${props.id}`} aria-label="§">#</a>
      </span>
    </h3>
  ),
  p: ({children, ...props}) => <p {...props} className={typographyStyles['spectrum-Body3']}>{children}</p>,
  ul: ({children, ...props}) => <ul {...props} className={typographyStyles['spectrum-Body3']}>{children}</ul>,
  code: ({children, ...props}) => <code {...props} className={typographyStyles['spectrum-Code4']}>{children}</code>,
  inlineCode: ({children, ...props}) => <code {...props} className={typographyStyles['spectrum-Code4']}>{children}</code>,
  a: ({children, ...props}) => <a {...props} className={linkStyle['spectrum-Link']} {...getAnchorProps(props.href)}>{children}</a>
};

function Page({children, title, styles, scripts}) {
  return (
    <html
      lang="en-US"
      dir="ltr"
      className={classNames(
        theme.global.spectrum,
        theme.light['spectrum--light'],
        theme.medium['spectrum--medium'],
        typographyStyles.spectrum,
        docStyles.provider,
        highlightCss.spectrum)}>
      <head>
        <title>{title}</title>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Server rendering means we cannot use a real <Provider> component to do this.
            Instead, we apply the default theme classes to the html element. In order to
            prevent a flash between themes when loading the page, an inline script is put
            as close to the top of the page as possible to switch the theme as soon as
            possible during loading. It also handles when the media queries update, or
            local storage is updated. */}
        <script
          dangerouslySetInnerHTML={{__html: `(() => {
            let classList = document.documentElement.classList;
            let style = document.documentElement.style;
            let dark = window.matchMedia('(prefers-color-scheme: dark)');
            let fine = window.matchMedia('(any-pointer: fine)');
            let update = () => {
              if (localStorage.theme === "dark" || (!localStorage.theme && dark.matches)) {
                classList.remove("${theme.light['spectrum--light']}");
                classList.add("${theme.dark['spectrum--dark']}");
                style.colorScheme = 'dark';
              } else {
                classList.add("${theme.light['spectrum--light']}");
                classList.remove("${theme.dark['spectrum--dark']}");
                style.colorScheme = 'light';
              }

              if (!fine.matches) {
                classList.remove("${theme.medium['spectrum--medium']}");
                classList.add("${theme.large['spectrum--large']}");
              } else {
                classList.add("${theme.medium['spectrum--medium']}");
                classList.remove("${theme.large['spectrum--large']}");
              }
            };

            update();
            dark.addListener(update);
            fine.addListener(update);
            window.addEventListener('storage', update);
          })();
        `.replace(/\n|\s{2,}/g, '')}} />
        <link rel="preload" as="font" href="https://use.typekit.net/af/eaf09c/000000000000000000017703/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3" crossOrigin="" />
        <link rel="preload" as="font" href="https://use.typekit.net/af/cb695f/000000000000000000017701/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n4&v=3" crossOrigin="" />
        <link rel="preload" as="font" href="https://use.typekit.net/af/505d17/00000000000000003b9aee44/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n9&v=3" crossOrigin="" />
        <link rel="preload" as="font" href="https://use.typekit.net/af/74ffb1/000000000000000000017702/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=i4&v=3" crossOrigin="" />
        {styles.map(s => <link rel="stylesheet" href={s.url} />)}
        {scripts.map(s => <script type={s.type} src={s.url} defer />)}
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}

function dirToTitle(dir) {
  return dir
    .split('/')[0]
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function Nav({currentPageName, pages}) {
  let isIndex = /index\.html$/;
  let currentParts = currentPageName.split('/');
  let currentDir = currentParts[0];

  pages = pages.filter(p => {
    let pageParts = p.name.split('/');
    let pageDir = pageParts[0];

    // Pages within same directory (react-spectrum/Alert.html)
    if (currentParts.length > 1) {
      return currentDir === pageDir && !isIndex.test(p.name);
    }

    // Top-level index pages (react-spectrum/index.html)
    if (currentParts.length === 1 && pageParts.length > 1 && isIndex.test(p.name)) {
      return true;
    }

    // Other top-level pages
    return !isIndex.test(p.name) && pageParts.length === 1;
  });

  // Key by category
  let pageMap = {};
  let rootPages = [];
  pages.forEach(p => {
    let cat = p.category;
    if (cat) {
      if (cat in pageMap) {
        pageMap[cat].push(p);
      } else {
        pageMap[cat] = [p];
      }
    } else {
      rootPages.push(p);
    }
  });

  let title = currentParts.length > 1 ? dirToTitle(currentPageName) : 'React Spectrum';

  function SideNavItem({name, url, title}) {
    return (
      <li className={classNames(sideNavStyles['spectrum-SideNav-item'], {[sideNavStyles['is-selected']]: name === currentPageName})}>
        <a className={sideNavStyles['spectrum-SideNav-itemLink']} href={url}>{title}</a>
      </li>
    );
  }

  return (
    <nav className={docStyles.nav}>
      <header>
        {currentParts.length > 1 &&
          <a href="../index.html" className={docStyles.backBtn}>
            <ChevronLeft />
          </a>
        }
        <a href="./index.html" className={docStyles.homeBtn}>
          <svg viewBox="0 0 30 26" fill="#E1251B">
            <polygon points="19,0 30,0 30,26" />
            <polygon points="11.1,0 0,0 0,26" />
            <polygon points="15,9.6 22.1,26 17.5,26 15.4,20.8 10.2,20.8" />
          </svg>
          <h2 className={typographyStyles['spectrum-Heading4']}>
            {title}
          </h2>
        </a>
      </header>
      <ul className={sideNavStyles['spectrum-SideNav']}>
        {rootPages.map(p => <SideNavItem {...p} />)}
        {Object.keys(pageMap).sort().map(key => (
          <li className={sideNavStyles['spectrum-SideNav-item']}>
            <h3 className={sideNavStyles['spectrum-SideNav-heading']}>{key}</h3>
            <ul className={sideNavStyles['spectrum-SideNav']}>
              {pageMap[key].sort((a, b) => a.title < b.title ? -1 : 1).map(p => <SideNavItem {...p} />)}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={docStyles.pageFooter}>
      <hr className={classNames(ruleStyles['spectrum-Rule'], ruleStyles['spectrum-Rule--small'], ruleStyles['spectrum-Rule--horizontal'])} />
      <ul>
        <li>Copyright © {year} Adobe. All rights reserved.</li>
        <li><a className={linkStyle['spectrum-Link--secondary']} href="//www.adobe.com/privacy.html">Privacy</a></li>
        <li><a className={linkStyle['spectrum-Link--secondary']} href="//www.adobe.com/legal/terms.html">Terms of Use</a></li>
        <li><a className={linkStyle['spectrum-Link--secondary']} href="//www.adobe.com/privacy/cookies.html">Cookies</a></li>
      </ul>
    </footer>
  );
}

export function Layout({scripts, styles, pages, currentPage, publicUrl, children, toc}) {

  return (
    <Page title={currentPage.title} scripts={scripts} styles={styles}>
      <div className={docStyles.pageHeader} id="header" />
      <Nav currentPageName={currentPage.name} pages={pages} />
      <main>
        <article className={classNames(typographyStyles['spectrum-Typography'], {[docStyles.inCategory]: !!currentPage.category})}>
          <MDXProvider components={mdxComponents}>
            <ImageContext.Provider value={publicUrl}>
              <LinkProvider>{children}</LinkProvider>
            </ImageContext.Provider>
          </MDXProvider>
        </article>
        {toc.length ? <ToC toc={toc} /> : null}
        <Footer />
      </main>
    </Page>
  );
}
