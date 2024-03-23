const express = require('express');
const router = express.Router();

const PagesController = require('../controllers/PagesController');

router.get('/', PagesController.home);
router.get('/blog/:slug', PagesController.blog);
router.get('/policy/', PagesController.policy);

module.exports = router;
