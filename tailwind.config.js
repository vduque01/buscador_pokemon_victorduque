module.exports = {
  content: ["./*.{html,js}", "./app/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        'start_gradient': '#DCE4FF',
        'end_gradient': '#E1D7FF',
        'morado': {
          100: '#D5DAEC',
          200: '#B8C1E0',
          300: '#4F64B0',
          'text': '#777E99',
        },
        'alert' : '#F30000'
      }
    },
  },
  plugins: [],
}