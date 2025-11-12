exports.joinTruthyStrings = (...strings) => {
  return strings.filter(Boolean).join(" ");
};

exports.urlSafeSlug = (string) => {
  return string.toString().trim().toLowerCase().replace(/\s+/g, '-');
};

exports.randomString = (length) => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++)
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  return result;
};
