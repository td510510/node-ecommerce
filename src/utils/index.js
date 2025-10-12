const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((s) => [s, 1]));
};

const unGetSelectData = (select = []) => {
  return Object.fromEntries(select.map((s) => [s, 0]));
};

module.exports = {
  getSelectData,
  unGetSelectData,
};
