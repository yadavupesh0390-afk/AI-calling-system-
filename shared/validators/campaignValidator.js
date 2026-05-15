module.exports = function validateCampaign(data) {
  if (!data.name) return 'Campaign name required';
  if (!data.phoneNumbers || !data.phoneNumbers.length) return 'Phone numbers required';
  return null;
};
