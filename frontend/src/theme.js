import { extendTheme } from '@chakra-ui/react';

const config = {
  initialColorMode: 'system',
  useSystemColorMode: true,
};

const styles = {
  global: {
    'html, body, #root': { height: '100%' },
    body: { bg: 'gray.50', _dark: { bg: 'gray.900' } },
  },
};

const fonts = {
  heading: `'Inter', system-ui, -apple-system, Segoe UI, Roboto, sans-serif`,
  body: `'Inter', system-ui, -apple-system, Segoe UI, Roboto, sans-serif`,
};

export const theme = extendTheme({ config, styles, fonts });
