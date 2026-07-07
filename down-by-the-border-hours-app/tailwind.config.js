/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: {
            DEFAULT: '#EAD01D',
            dark: '#D4BC1A',
            light: '#F6EFD9',
          },
          blue: {
            DEFAULT: '#1D3776',
            dark: '#152A5C',
            medium: '#2E4A9A',
            light: '#E8EDF7',
            pale: '#F0F4FA',
          },
          ink: '#000000',
          heading: '#958F78',
          body: '#1A1A1A',
          muted: '#576275',
          subtle: '#999999',
          surface: '#F4F4F4',
          card: '#FFFFFF',
          border: '#E0E0E0',
          'border-strong': '#CCCCCC',
        },
      },
    },
  },
  plugins: [],
}
