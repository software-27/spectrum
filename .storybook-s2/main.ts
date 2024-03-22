import type { StorybookConfig } from "@storybook/types";

// const excludedProps = new Set([
//   'id',
//   'slot',
//   'onCopy',
//   'onCut',
//   'onPaste',
//   'onCompositionStart',
//   'onCompositionEnd',
//   'onCompositionUpdate',
//   'onSelect',
//   'onBeforeInput',
//   'onInput'
// ]);

const config: StorybookConfig = {
  stories: [
    '../docs/**/*.@(md|mdx)',
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    // "@storybook/addon-styling-webpack",
    // re-enable when we get single components in Figma
    "@storybook/addon-designs",
    "storybook-dark-mode"
  ],
  framework: {
    name: "storybook-react-parcel",
    options: {},
  },
  // typescript: {
  //   reactDocgen: 'react-docgen-typescript',
  //   reactDocgenTypescriptOptions: {
  //     tsconfigPath: '../tsconfig.json',
  //     shouldExtractLiteralValuesFromEnum: true,
  //     compilerOptions: {
  //       allowSyntheticDefaultImports: false,
  //       esModuleInterop: false,
  //     },
  //     propFilter: (prop) => !prop.name.startsWith('aria-') && !excludedProps.has(prop.name),
  //   },
  // },
};
export default config;
