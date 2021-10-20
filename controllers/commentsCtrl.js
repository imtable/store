const mongoose = require('mongoose');

const GeneralModel = require('../models/comment');

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
  const comments = await GeneralModel.find({ itemId: id }).populate('user');
  if (!comments) {
    console.log('= = = = get error: comments is not finded');
    return { status: 'get error: comments is not finded' };
  }

  console.log(`+ + + + success get comments`);

  return { status: 'success', payload: { comments } };
}

const asd = async () => {
  // createComment("61708baed707dc58caef2077", 'cmnt', "61708b06d707dc58caef2071")
  const docs = await GeneralModel.find({ itemId: "61708b06d707dc58caef2071" }).populate('user');
  console.log(docs[0]);

  // const zxc = await getCommentsOfItem("617074bb8676934aacdb4199")
  // console.log(zxc.payload.comments);
}
asd();
  
module.exports = {
  createComment,
  getCommentsOfItem,
};
