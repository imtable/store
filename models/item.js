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
      index: true,
      default: {}
   },
   price: {
      type: Schema.Types.String,
      index: true,
      required: true
   },
   itemVersions: [{
      type: Schema.Types.ObjectId, ref: 'itemVersion',
      index: true,
   }],
   categories: [{
      type: Schema.Types.ObjectId, ref: 'categorie',
      index: true,
   }]
});

const modelName = path.basename(__filename, '.js');
const model = mongoose.model(modelName, generalSchema);

module.exports = model;
