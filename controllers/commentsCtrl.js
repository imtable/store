const mongoose = require('mongoose');

const GeneralModel = require('../models/comment');
const UserModel = require('../models/user');

const db = mongoose.connection;

const createComment = async (authorId, text, itemId) => {
  const comment = new GeneralModel;
  comment.authorId = authorId;
  comment.text = text;
  comment.itemId = itemId;
  try {
    const doc = await comment.save();
    console.log(doc._id);
  } catch (e) {
    console.log('Saving error===');
    return e;
  }
}

const getCommentsOfItem = async (id) => {
  const comments = await GeneralModel.find({ itemId: id }).populate('users');
  if (!comments) {
    console.log('= = = = get error: comments is not finded');
    return { status: 'get error: comments is not finded' };
  }

  console.log(`+ + + + success get comments`);
  // console.log(comments);


  return { status: 'success', payload: { comments } };
}

const asd = async () => {
  const zxc = await getCommentsOfItem('6155d5a3a07e603da6033b0a')
  console.log(zxc.payload.comments[0]);

}
// asd()
  
module.exports = {
  createComment,
  getCommentsOfItem,
};
