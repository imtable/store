const mongoose = require('mongoose');
const path = require ('path');

require ('./user');

const { Schema } = mongoose;

const generalSchema = new Schema({
   authorId: { 
      type: Schema.Types.ObjectId, 
      ref: 'user',
      required: true,
      index: true,
   },
   text: {
      type: Schema.Types.String,
      required: true,
   },
   itemId: { 
      type: Schema.Types.ObjectId, 
      ref: 'item',
      required: true,
      index: true,
   }
});

const modelName = path.basename(__filename, '.js');
const model = mongoose.model(modelName, generalSchema);

module.exports = model;
