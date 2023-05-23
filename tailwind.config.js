/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
    colors: {
      transparent: 'transparent',
      white: '#ffffff',
      blue: {
        main: '#00CBF8',
        primary: '#1890ff',
      },
      gray: {
        main: '#e6e6e6',
        dark: '#8c8c8c',
        light: '#f2f2f2',
      },
      green: {
        main: '#21bf96',
      },
      red: {
        main: '#FF3300',
      },
      black: '#333333',
    },
  },
  plugins: [],
};
