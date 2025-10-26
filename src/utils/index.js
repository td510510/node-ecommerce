const { Types } = require('mongoose');

const convertToObjectIdMongodb = (id) => {
  return new Types.ObjectId(id);
};

const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((s) => [s, 1]));
};

const unGetSelectData = (select = []) => {
  return Object.fromEntries(select.map((s) => [s, 0]));
};

const removeUndefinedObject = (object) => {
  Object.keys(object).forEach(
    (key) =>
      (object[key] === undefined || object[key] === null) && delete object[key]
  );
  return object;
};

const updateNestedObjectParser = (object) => {
  const final = {};
  Object.keys(object).forEach((key) => {
    if (typeof object[key] === 'object' && !Array.isArray(object[key])) {
      const temp = updateNestedObjectParser(object[key]);
      Object.keys(temp).forEach((k) => {
        final[`${key}.${k}`] = temp[k];
      });
    } else {
      final[key] = object[key];
    }
    ``;
  });
  return final;
};

module.exports = {
  getSelectData,
  unGetSelectData,
  removeUndefinedObject,
  updateNestedObjectParser,
  convertToObjectIdMongodb,
};
