import type { ThemeOptions } from '@mui/material';

interface TokenParamsTypes {
  mode: 'dark' | 'light';
}

export const colorToken = ({ mode }: TokenParamsTypes) => ({
  ...(mode === 'dark'
    ? {
        grey: {
          100: '#e0e0e0',
          200: '#c2c2c2',
          300: '#a3a3a3',
          400: '#858585',
          500: '#666666',
          600: '#525252',
          700: '#3d3d3d',
          800: '#292929',
          900: '#141414',
        },
        primary: {
          100: '#d0d1d5',
          200: '#a1a4ab',
          300: '#727681',
          400: '#434957',
          500: '#141b2d',
          600: '#101624',
          700: '#0c101b',
          800: '#080b12',
          900: '#040509',
        },
        greenAccent: {
          100: '#dbf5f4',
          200: '#b7ebea',
          300: '#94e2df',
          400: '#70d8d5',
          500: '#4cceca',
          600: '#3da5a2',
          700: '#2e7c79',
          800: '#1e5251',
          900: '#0f2928',
        },
        redAccent: {
          100: '#f8dcdb',
          200: '#f1b9b7',
          300: '#e99592',
          400: '#e2726e',
          500: '#db4f4a',
          600: '#af3f3b',
          700: '#832f2c',
          800: '#58201e',
          900: '#2c100f',
        },
        blueAccent: {
          100: '#e1e2fe',
          200: '#c3c6fd',
          300: '#a4a9fc',
          400: '#868dfb',
          500: '#6870fa',
          600: '#535ac8',
          700: '#3e4396',
          800: '#2a2d64',
          900: '#151632',
        },
      }
    : {
        grey: {
          100: '#141414',
          200: '#292929',
          300: '#3d3d3d',
          400: '#525252',
          500: '#666666',
          600: '#858585',
          700: '#a3a3a3',
          800: '#c2c2c2',
          900: '#e0e0e0',
        },
        primary: {
          100: '#040509',
          200: '#080b12',
          300: '#0c101b',
          400: '#101624',
          500: '#141b2d',
          600: '#434957',
          700: '#727681',
          800: '#a1a4ab',
          900: '#d0d1d5',
        },
        greenAccent: {
          100: '#0f2928',
          200: '#1e5251',
          300: '#2e7c79',
          400: '#3da5a2',
          500: '#4cceca',
          600: '#70d8d5',
          700: '#94e2df',
          800: '#b7ebea',
          900: '#dbf5f4',
        },
        redAccent: {
          100: '#2c100f',
          200: '#58201e',
          300: '#832f2c',
          400: '#af3f3b',
          500: '#db4f4a',
          600: '#e2726e',
          700: '#e99592',
          800: '#f1b9b7',
          900: '#f8dcdb',
        },
        blueAccent: {
          100: '#151632',
          200: '#2a2d64',
          300: '#3e4396',
          400: '#535ac8',
          500: '#6870fa',
          600: '#868dfb',
          700: '#a4a9fc',
          800: '#c3c6fd',
          900: '#e1e2fe',
        },
      }),
});

const globalDesignToken = ({ mode }: TokenParamsTypes): ThemeOptions => {
  const colorPalette = colorToken({ mode });
  return {
    palette: {
      mode,
      ...(mode === 'dark'
        ? {
            primary: {
              main: colorPalette.primary[500],
            },
            secondary: {
              main: colorPalette.greenAccent[500],
            },
            neutral: {
              dark: colorPalette.grey[700],
              main: colorPalette.grey[500],
              light: colorPalette.grey[100],
            },
            background: {
              default: colorPalette.primary[500],
            },
            text: {
              primary: colorPalette.grey[100],
              secondary: colorPalette.grey[300],
            },
          }
        : {
            primary: {
              main: colorPalette.primary[900],
            },
            secondary: {
              main: colorPalette.greenAccent[500],
            },
            neutral: {
              dark: colorPalette.grey[700],
              main: colorPalette.grey[500],
              light: colorPalette.grey[100],
            },
            background: {
              default: '#fcfcfc',
            },
            text: {
              primary: colorPalette.grey[100],
              secondary: colorPalette.grey[300],
            },
          }),
    },
    typography: {
      fontFamily: ['Roboto', 'sans-serif'].join(','),
      button: {
        textTransform: 'none',
        fontSize: '16px',
      },
    },
    components: {
      MuiAppBar: {
        defaultProps: {
          color: 'inherit',
        },
      },
      MuiButton: {
        defaultProps: {
          color: 'inherit',
        },
      },
    },
  };
};

export { globalDesignToken };
