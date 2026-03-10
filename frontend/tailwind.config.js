/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'mine-shaft': {
          '100': '#f5f7fa',
          '200': '#cbd5e1',
          '500': '#334155',
          '900': '#0b1220',
        },
        'bright-sun': {
          '300': '#FCEFC0',
          '400': '#F6C84C',
          '500': '#F2B12E',
        },
        'deepSlate': {
          '50': '#f6f6f6',
          '100': '#e7e7e7',
          '200': '#d1d1d1',
          '300': '#b0b0b0',
          '400': '#888888',
          '500': '#6d6d6d',
          '600': '#5d5d5d',
          '700': '#4f4f4f',
          '800': '#454545',
          '900': '#3d3d3d',
          '950': '#2d2d2d',
        },
        'oceanTeal': {
        '50': '#e6fafa',
        '100': '#b3ebeb',
        '200': '#80dbdb',
        '300': '#4dcccc',
        '400': '#1abcbd',
        '500': '#009a9b',
        '600': '#007a7a',
        '700': '#005a5a',
        '800': '#003a3a',
        '900': '#001a1a',
        '950': '#000a0a',
    },
    
      },
      keyframes: {
        'option-animation': {
          from: { opacity: '0', transform: 'translateX(-20px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        'option-animation': 'option-animation 200ms ease forwards',
      },
    },
    screens: {
      'xsm': '350px',
      'xs': '476px',
      'sm': '640px',
      'md': '768px',
      'bs': '900px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',


      '2xl-mx': { 'max': '1535px' },
      'xl-mx': { 'max': '1279px' },
      'lg-mx': { 'max': '1023px' },
      'bs-mx': { 'max': '900px' },
      'md-mx': { 'max': '767px' },
      'sm-mx': { 'max': '639px' },
      'xs-mx': { 'max': '475px' },
      'xsm-mx': { 'max': '349px' }
    }
  },
  plugins: [],
}