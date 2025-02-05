module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        c4: '#728A5C',
        c5: '#e4cab8',
        c6: '#D3A789',
        c7: '#B47659',
        c75: '#d0432f',
        c8: '#643B2B',
        c9: '#593229',
      },

      animation: {
        'spin-label': 'spinLabel 3s linear infinite',
        'spin-shadow': 'spinShadow 3s linear infinite',
        'spin-glass': 'spinGlass 3s ease-in-out infinite',
        'spin-cork': 'spinCork 3s ease-in-out infinite',
      },
      keyframes: {
        spinLabel: {
          '0%': { marginLeft: '0%', borderLeftWidth: '0px', marginRight: '100%', borderRightWidth: '2px' },
          '49%': { borderLeftWidth: '0px', borderRightWidth: '2px' },
          '50%': { marginLeft: '0%', borderLeftWidth: '2px', marginRight: '0%', borderRightWidth: '0px' },
          '98%': { borderLeftWidth: '2px' },
          '99%': { marginLeft: '100%', borderLeftWidth: '0px', marginRight: '0%', borderRightWidth: '0px' },
          '100%': { marginLeft: '0%', borderLeftWidth: '0px', marginRight: '100%', borderRightWidth: '0px' },
        },
        'spin-shadow': {
          '0%': { left: '0', width: '50px', marginLeft: '0px' },
          '50%': { left: '0', width: '0px', marginLeft: '0px' },
          '51%': { marginLeft: '50px' },
          '100%': { width: '50px', marginLeft: '0' },
        },
        'spin-glass': {
          '0%': { left: '25px', zIndex: '20' },
          '50%': { left: '185px', zIndex: '20' },
          '51%': { zIndex: '0' },
          '100%': { left: '25px', zIndex: '0' },
        },
        'spin-cork': {
          '0%': { left: '180px', zIndex: '0' },
          '50%': { left: '55px', zIndex: '0' },
          '51%': { zIndex: '20' },
          '100%': { left: '180px', zIndex: '20' },
        },
      },
    },
  },
  plugins: [],
}