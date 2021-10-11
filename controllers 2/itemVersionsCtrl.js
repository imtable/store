const mongoose = require('mongoose');
require('../bin/runners/db')

const ItemVersionModel = require('../models/itemVersion');

const db = mongoose.connection;

const getItemVersions = async () => {
  let data = await ItemVersionModel.find().select('name');
  return data;
}

const createItemVersion = async (data) => {
  const itemVersion = new ItemVersionModel;

  for (let key in data) {
    if (key.includes('spec')) {
      let fieldName = key.replace('spec_', '');
      itemVersion.specifications[fieldName] = data[key];
    } else {
      itemVersion[key] = data[key];
    }
  }

  try {
    const doc = await itemVersion.save();
    console.log(doc._id);
    return doc._id;
  } catch (e) {
    console.log('Saving error===');
    return e;
  }
}

module.exports = {
  getItemVersions,
  createItemVersion,
};
