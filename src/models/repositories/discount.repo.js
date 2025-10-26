'use struct';

const { unGetSelectData, getSelectData } = require('../../utils');

const findAllDiscountCodesUnselected = async ({
  filter,
  limit = 50,
  page = 1,
  sort = 'ctime',
  selected,
  model,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
  const documents = await model
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(selected))
    .lean();

  return documents;
};

const checkDiscountExists = async ({ model, filter }) => {
  return await model.findOne(filter).lean();
};

module.exports = {
  findAllDiscountCodesUnselected,
  checkDiscountExists,
};
