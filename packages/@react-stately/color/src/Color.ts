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

/** A list of supported color formats. */
type ColorFormat = 'hex' | 'hexa' | 'rgb' | 'rgba' | 'hsl' | 'hsla' | 'hsb' | 'hsba';

/** A list of color channels. */
type ColorChannel = 'hue' | 'saturation' | 'brightness' | 'lightness' | 'red' | 'green' | 'blue' | 'alpha';

export class Color {
  private value: ColorValue;

  constructor(value: string) {
    let parsed: ColorValue | void = RGBColor.parse(value);
    if (parsed) {
      this.value = parsed;
    } else {
      throw new Error('Invalid color value: ' + value);
    }
  }

  private static fromColorValue(value: ColorValue): Color {
    let x: Color = Object.create(Color.prototype);
    x.value = value;
    return x;
  }

  toFormat(format: ColorFormat): Color {
    switch (format) {
      case 'hex':
      case 'hexa':
      case 'rgb':
      case 'rgba':
        return Color.fromColorValue(this.value.toRGB());
      case 'hsl':
      case 'hsla':
        return Color.fromColorValue(this.value.toHSL());
      case 'hsb':
      case 'hsba':
        return Color.fromColorValue(this.value.toHSB());
      default:
        throw new Error('Invalid color format: ' + format);
    }
  }

  toString(format: ColorFormat) {
    switch (format) {
      case 'hex':
      case 'hexa':
      case 'rgb':
      case 'rgba':
        return this.value.toRGB().toString(format);
      case 'hsl':
      case 'hsla':
        return this.value.toHSL().toString(format);
      case 'hsb':
      case 'hsba':
        return this.value.toHSB().toString(format);
      default:
        throw new Error('Invalid color format: ' + format);
    }
  }

  getChannelValue(channel: ColorChannel): number {
    if (channel in this.value) {
      return this.value[channel];
    }

    throw new Error('Unsupported color channel: ' + channel);
  }
}

interface ColorValue {
  toRGB(): ColorValue,
  toHSB(): ColorValue,
  toHSL(): ColorValue,
  toString(format: ColorFormat): string
}

const HEX_REGEX = /^#(?:([0-9a-f]{3})|([0-9a-f]{6}))$/i;

class RGBColor implements ColorValue {
  constructor(private red: number, private green: number, private blue: number, private alpha: number) {}

  static parse(value: string): RGBColor | void {
    let m;
    if ((m = value.match(HEX_REGEX))) {
      if (m[1]) {
        let r = parseInt(m[1][0] + m[1][0], 16);
        let g = parseInt(m[1][1] + m[1][1], 16);
        let b = parseInt(m[1][2] + m[1][2], 16);
        return new RGBColor(r, g, b, 1);
      } else if (m[2]) {
        let r = parseInt(m[2][0] + m[2][1], 16);
        let g = parseInt(m[2][2] + m[2][3], 16);
        let b = parseInt(m[2][4] + m[2][5], 16);
        return new RGBColor(r, g, b, 1);
      }
    } else {
      // TODO: check rgb and rgba strings
    }
  }

  toString(format: ColorFormat) {
    switch (format) {
      case 'hex':
        return '#' + (1 << 24 | this.red << 16 | this.green << 8 | this.blue).toString(16).slice(1).toUpperCase();
      case 'rgb':
        return `rgb(${this.red}, ${this.green}, ${this.blue})`;
      case 'rgba':
        return `rgba(${this.red}, ${this.green}, ${this.blue}, ${this.alpha})`;
      default:
        throw new Error('Unsupported color format: ' + format);
    }
  }

  toRGB(): ColorValue {
    return this;
  }

  toHSB(): ColorValue {
    throw new Error('Not implemented');
  }

  toHSL(): ColorValue {
    throw new Error('Not implemented');
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class HSBColor implements ColorValue {
  constructor(private hue: number, private saturation: number, private brightness: number, private alpha: number) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static parse(value: string): HSBColor | void {
    // TODO
  }

  toString(format: ColorFormat) {
    switch (format) {
      case 'hsb':
        return `hsb(${this.hue}, ${this.saturation}%, ${this.brightness}%)`;
      case 'hsba':
        return `hsba(${this.hue}, ${this.saturation}%, ${this.brightness}%, ${this.alpha})`;
      default:
        throw new Error('Unsupported color format: ' + format);
    }
  }

  toRGB(): ColorValue {
    throw new Error('Not implemented');
  }

  toHSB(): ColorValue {
    return this;
  }

  toHSL(): ColorValue {
    throw new Error('Not implemented');
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class HSLColor implements ColorValue {
  constructor(private hue: number, private saturation: number, private lightness: number, private alpha: number) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static parse(value: string): HSLColor | void {
    // TODO
  }

  toString(format: ColorFormat) {
    switch (format) {
      case 'hsl':
        return `hsl(${this.hue}, ${this.saturation}%, ${this.lightness}%)`;
      case 'hsla':
        return `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${this.alpha})`;
      default:
        throw new Error('Unsupported color format: ' + format);
    }
  }

  toRGB(): ColorValue {
    throw new Error('Not implemented');
  }

  toHSB(): ColorValue {
    throw new Error('Not implemented');
  }

  toHSL(): ColorValue {
    return this;
  }
}
