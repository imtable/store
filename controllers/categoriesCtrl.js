const mongoose = require('mongoose');

const GeneralModel = require('../models/categorie');

const db = mongoose.connection;

const createCategorie = async (name) => {
  const categorie = new GeneralModel;
  categorie.name = name;
  try {
    const doc = await categorie.save();
    console.log(doc._id);
  } catch (e) {
    console.log('Saving error===');
    return e;
  }
}

const getCategories = async () => {
  let data = await GeneralModel.find().select('name');
  return data;
}

const getCategorieByID = async (catID) => {
  const cat = await GeneralModel.findOne({ _id: catID });
  if (!cat) {
    console.log('= = = = get error: cat is not finded');
    return { status: 'get error: cat is not finded' };
  }

  console.log(`+ + + + success get ${cat.name} cat`);
  const id = cat._id;
  return { status: 'success', payload: { id } };
}

module.exports = {
  getCategories,
  createCategorie,
  getCategorieByID,
};
