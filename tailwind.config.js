module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      width: {
        '1/1': '90%',
        '1/7': '14.2857143%',
        '1/9': '11.1111111%',
        '7/7': '77%',
      },
      height: {
        '11.1': '40px',
        '11.1/2': '60px',
        '11.2': '80px',
        '11.2/2': '100px',
        '11.3': '120px',
        '11.3/2': '140px',
        '11.4': '160px',
        '11.4/2': '180px',
      },
      backgroundColor: {
        '#039BE5': '#039BE5',
        '#AD1457': '#AD1457',
        '#137333': '#137333',
      },
      borderColor: {
        '#039BE5': '#039BE5',
        '#AD1457': '#AD1457',
        '#137333': '#137333',
      },
      textColor: {
        '#039BE5': '#039BE5',
        '#AD1457': '#AD1457',
        '#137333': '#137333',
      },
      inset: {
        '0/2': '0',
        '0/3': '0',
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
