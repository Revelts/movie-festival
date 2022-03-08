
const multer = require('multer');
const { FILE_ERROR } = require('../../../Shared/constant');

// Gets a filename extension.
const getExtension = (filename) => {
    return filename.split(".").pop();
}
  
// Test if a file is valid based on its extension and mime type.
const isFileValid = (filename, mimetype) => {
    const allowedExts = ["mp4", "webm", "ogg"];
    const allowedMimeTypes = ["video/mp4", "video/webm", "video/ogg"];

    // Get file extension.
    const extension = getExtension(filename);
    return allowedExts.indexOf(extension.toLowerCase()) !== -1 && allowedMimeTypes.indexOf(mimetype) !== -1;
}
  

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if(!isFileValid(file.originalname, file.mimetype)) {
            cb(FILE_ERROR);
            return;
        }
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        const indexOfString = file.originalname.split(".").pop();
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + indexOfString);
    }
});
const upload = multer({ storage });

module.exports = upload