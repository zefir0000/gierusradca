const express = require('express');
const router = express.Router();

const PagesController = require('../controllers/PagesController');

router.get('/', PagesController.home);
router.get('/blog', PagesController.blogList);
router.get('/blog/:slug', PagesController.blog);
router.get('/policy/', PagesController.policy);
router.post('/newsletter/signup', PagesController.signNewslater)
router.get('/confirm-mail', PagesController.confirmMail)
router.get('/unsubscribe', PagesController.unsubscribe)

module.exports = router;
