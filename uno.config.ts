import { defineConfig, presetUno, presetIcons, presetTypography } from 'unocss';

export default defineConfig({
  presets: [
    presetUno(),
    presetTypography(),
    presetIcons({
      scale: 1.2,
      cdn: 'https://esm.sh/'
    })
  ],
  theme: {
    colors: {
      primary: {
        50: '#e3f2fd',
        100: '#bbdefb',
        200: '#90caf9',
        300: '#64b5f6',
        400: '#42a5f5',
        500: '#2196f3',
        600: '#1e88e5',
        700: '#1976d2',
        800: '#1565c0',
        900: '#0d47a1',
      },
      secondary: {
        50: '#fce4ec',
        100: '#f8bbd0',
        200: '#f48fb1',
        300: '#f06292',
        400: '#ec407a',
        500: '#e91e63',
        600: '#d81b60',
        700: '#c2185b',
        800: '#ad1457',
        900: '#880e4f',
      }
    }
  },
  shortcuts: {
    'card': 'bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105',
    'card-poster': 'aspect-[2/3] w-full object-cover',
    'card-thumb': 'aspect-video w-full object-cover',
    'btn': 'px-4 py-2 rounded-md font-medium transition-colors',
    'btn-primary': 'btn bg-primary-600 text-white hover:bg-primary-700',
    'btn-secondary': 'btn bg-gray-200 text-gray-800 hover:bg-gray-300',
    'container-custom': 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    'section-title': 'text-2xl md:text-3xl font-bold mb-6',
    'slider-container': 'overflow-x-auto snap-x snap-mandatory',
    'slider-wrapper': 'flex gap-4 pb-4',
    'grid-responsive': 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4',
  },
  rules: []
});
