const crypto = require('crypto');
const fs = require('fs-extra');
const path = require('path');
const multer = require('multer');

const fileFilter = (req, file, cb) => {
  const { mimetype } = file;
  if ( !/image\/*/.test(mimetype) ) {
    cb(null, false);
    return;
  }
  cb(null, true);
}

const uploadFile = () => {
  const dest = 'temp/';
  const upload = multer({ fileFilter, dest });

  return upload.single('picture');
}

const calcHash = (filePath) => new Promise((resolve, reject) => {
  const readStream = fs.createReadStream(filePath);
  const hash = crypto.createHash('sha1');
  hash.setEncoding('hex');
  
  hash.on('finish', () => {
    const hashsum = hash.read();
    resolve(hashsum);
  });

  readStream.pipe(hash);
});

const getFileByHash = async (hashsum) => {
  const hashedFilePath = path.resolve(`public/uploads/${hashsum}/pic.png`);
  const shortFilePath = `/uploads/${hashsum}/pic.png`;
  return { hashedFilePath, shortFilePath };
}

const checkExisting = async (req, res, next) => {
  if (!req.hasOwnProperty('file')) {
    next();
    return;
  }
  const { path: filePath } = req.file;

  const hashsum = await calcHash(filePath);
  const { hashedFilePath, shortFilePath } = await getFileByHash(hashsum);

  const exist = await fs.pathExists(hashedFilePath);
  if (exist) {
    await fs.remove(filePath);
    req.body.picture = shortFilePath;
    next()
  } else {
    await fs.move(filePath, hashedFilePath);
    req.body.picture = shortFilePath;
    next()
  }
}

const uploadPic = (req, res) => {
  return [ uploadFile(), checkExisting ];
}

module.exports = {
  uploadPic
};