const express = require('express');
const router = express.Router();

const PagesController = require('../controllers/PagesController');

router.get('/', PagesController.home);
router.get('/blog/:slug', PagesController.blog);


module.exports = router;
