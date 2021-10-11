const mongoose = require('mongoose');
const path = require ('path');

const { Schema } = mongoose;

const generalSchema = new Schema({
   name: {
      type: Schema.Types.String,
      maxlength: 100,
      index: true,
      required: true
   },
   picture: {
      type: Schema.Types.String
   },
   description: {
      type: Schema.Types.String,
      maxlength: 500,
      index: true,
      required: true
   },
   specifications: {
      type: Schema.Types.Mixed,
      default: {}
   },
   price: {
      type: Schema.Types.String,
      index: true,
      required: true
   },
   itemVersions: [{
      type: Schema.Types.ObjectId, ref: 'itemVersion'
   }],
   categories: [{
      type: Schema.Types.ObjectId, ref: 'categorie'
   }]
});

const modelName = path.basename(__filename, '.js');
const model = mongoose.model(modelName, generalSchema);

module.exports = model;

// // Товар:
// - картинка
// - описание
// - цена
// - характеристики
// категории товара
// - группа товара (это варианты одного и того же товара)

// Товар может быть в нескольких категориях сразу