import express from 'express';

const router = express.Router();

router.get('/', function (req, res) {
    res.render('components/error');
});

export default router;
