module.exports = {
  isValidPhone: (number) => {
    return /^[0-9]{10}$/.test(number);
  },

  isNotEmpty: (value) => {
    return value !== undefined && value !== null && value !== '';
  }
};
