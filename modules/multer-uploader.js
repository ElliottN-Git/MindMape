// Setup multer (files will temporarily be saved in the "temp" folder).
const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({

  destination: function(req, file, cb, res) {

    cb(null, 'public/uploads');

  },

  filename: function(req, file, cb, res) {

    const name = file.fieldname + '-' + Date.now() + path.extname(file.originalname);
    cb(null, name);

    return name;
  }
});

const upload = multer({
    storage: storage
});

// Export the "upload" object, which we can use to actually accept file uploads.
module.exports = upload;
