const express = require('express');
const admin = express.Router();
const multer = require("multer");
const auth = require('../middlewares/basicAuth');
const helper = require('../services/helper')
const AdminController = require('../controllers/AdminController');

const storage = multer.diskStorage({
  destination: "public/images/",
  filename: (req, file, cb) => {
    const slugFile = helper.createImageSlug(file.originalname);
    req.savedFileName = slugFile;
      cb(null, slugFile);
  }
});
const upload = multer({ storage });
admin.post("/page/image", upload.single("image"), (req, res) => {
  res.json({ filename: req.savedFileName }); // np. "1685293848123.jpg"
});
admin.get('/new-page/', auth, AdminController.newPage);
admin.get('/manage-blog/', auth, AdminController.manageBlog);
admin.get('/edit-page/:slug', AdminController.editPage);

admin.post('/update/', auth, AdminController.update);
admin.post('/page/', upload.single("image"), AdminController.addPage);
admin.post('/update-page', auth, AdminController.updatePage);
admin.get('/add-image', AdminController.uploadImage);

admin.post('/page/image', upload.single("image"), AdminController.addImage);

module.exports = admin;
