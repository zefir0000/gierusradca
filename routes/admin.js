const express = require('express');
const admin = express.Router();
const multer = require("multer");
const path = require("path");
const auth = require('../middlewares/basicAuth');

const AdminController = require('../controllers/AdminController');

const storage = multer.diskStorage({
  destination: "public/images/",
  filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

admin.get('/new-page/', auth, AdminController.newPage);
admin.get('/manage-blog/', auth, AdminController.manageBlog);
admin.get('/edit-page/:slug', AdminController.editPage);

admin.post('/update/', auth, AdminController.update);
admin.post('/page/', upload.single("image"), AdminController.addPage);
admin.post('/update-page', auth, AdminController.updatePage);


module.exports = admin;
