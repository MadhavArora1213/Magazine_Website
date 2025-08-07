module.exports = {
  theme: {
    extend: {
      colors: {
        'blue': {
          900: '#162048',
        },
        'black': '#1a1a1a',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}