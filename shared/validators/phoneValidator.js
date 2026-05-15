module.exports = function validatePhone(phone) {
  if (!phone) return false;
  return /^[6-9]\d{9}$/.test(phone);
};
