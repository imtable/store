const mongoose = require('mongoose');

const GeneralModel = require('../models/item');

const db = mongoose.connection;

const getItems = async () => {
  let data = await GeneralModel.find();
  return data;
}

// сохранить в шаблоны_______________________
{
  const filterObj = (obj, value) => {
    // const obj = {
    //   key1: 'value1',
    //   key2: 'value2'
    // }
    // const value = "1";

    const keys = Object.keys(obj).filter(key => key.includes(value));
    const filteredObj = Object.fromEntries(
      keys
        .sort((a, b) => value.indexOf(a) - value.indexOf(b))
        .map(key => [key, obj[key]])
    );
    return filteredObj;
  }
}

const createItem = async (data) => {
  const item = new GeneralModel;

  for (let key in data) {
    if (key.includes('spec')) {
      let fieldName = key.replace('spec_', '');
      item.specifications[fieldName] = data[key];
    } else {
      item[key] = data[key];
    }
  }

  try {
    const doc = await item.save();
    console.log(doc._id);
    return doc._id;
  } catch (e) {
    console.log('Saving error===');
    return e;
  }
}

const updateItemVersions = async (itemId, itemVersionId) => {
  GeneralModel.findOneAndUpdate({ _id: itemId }, { $push: { itemVersions: itemVersionId } },
    function (error, success) {
      if (error) {
        console.log(error);
      } else {
        console.log(success);
      }
  });
}

const getItemsByCategorieId = async (catId) => {
  const items = await GeneralModel.find({ categories: catId });
  if (!items) {
    console.log('= = = = get error: items is not finded');
    return { status: 'get error: items is not finded' };
  }

  console.log(`+ + + + success get items`);
  return { status: 'success', payload: { items } };
}

const getItemById = async (id) => {
  const item = await GeneralModel.findOne({ _id: id });
  if (!item) {
    console.log('= = = = get error: item is not finded');
    return { status: 'get error: item is not finded' };
  }

  console.log(`+ + + + success get item`);
  return { status: 'success', payload: { item } };
}

module.exports = {
  getItems,
  createItem,
  updateItemVersions,
  getItemsByCategorieId,
  getItemById
};
