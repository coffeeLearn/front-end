import express from 'express';

const router = express.Router();

router.get('/', function (req, res) {
    res.render('mypage/mypage');
});

router.get('/user_info', function (req, res) {
    res.render('mypage/user_info');
});

router.get('/order_modify', function (req, res) {
    res.render('mypage/order_modify');
});

router.get('/inquiry', function (req, res) {
    res.render('mypage/inquiry_writing');
});
router.get('/inquiry_list', function (req, res) {
    res.render('mypage/inquiry_list');
});

export default router;
