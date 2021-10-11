const authCtrl = require('../controllers/authCtrl');

const mw = async function(req, res, next) {
   try {
      const userID = req.session.userID;
      const user = await authCtrl.identifyUser(userID);
      // console.log('* * * * ', user.status);
      req.dearUser = user;
      next();
   } catch (error) {
      req.dearUser = { status: 'identify error: user is not identify'}
      next();
      return;
   }
}

module.exports = mw;