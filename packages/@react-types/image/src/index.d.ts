import {DOMProps, StyleProps} from '@react-types/shared';

export interface ImageProps {
  loaded?: boolean, // not real, just makes ts happy for now
  isPlaceholder?: boolean, // same thing
  objectFit?: any, // move to styleProps for images and type better
  src?: string,
  decorative?: boolean,
  alt?: string,
}

export interface SpectrumImageProps extends ImageProps, DOMProps, StyleProps {

}
