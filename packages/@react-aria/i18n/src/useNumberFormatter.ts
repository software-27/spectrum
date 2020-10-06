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

import {numberFormatSignDisplayPolyfill} from './utils';
import {useLocale} from './context';

let formatterCache = new Map<string, Intl.NumberFormat>();

// @ts-ignore
const supportsSignDisplay = (new Intl.NumberFormat('de-DE', {signDisplay: 'exceptZero'})).resolvedOptions().signDisplay === 'exceptZero';

/**
 * Provides localized number formatting for the current locale. Automatically updates when the locale changes,
 * and handles caching of the number formatter for performance.
 * @param options - Formatting options.
 */
export function useNumberFormatter(options?: Intl.NumberFormatOptions): Intl.NumberFormat {
  let {locale} = useLocale();

  let cacheKey = locale + (options ? Object.entries(options).sort((a, b) => a[0] < b[0] ? -1 : 1).join() : '');
  if (formatterCache.has(cacheKey)) {
    return formatterCache.get(cacheKey);
  }

  let numberFormatter = new Intl.NumberFormat(locale, options);
  // @ts-ignore
  let {signDisplay} = options || {};
  formatterCache.set(cacheKey, (!supportsSignDisplay && signDisplay != null) ? new Proxy(numberFormatter, {
    get(target, property) {
      if (property === 'format') {
        return (v) => numberFormatSignDisplayPolyfill(numberFormatter, signDisplay, v);
      } else {
        return target[property];
      }
    }
  }) : numberFormatter);
  return numberFormatter;
}
