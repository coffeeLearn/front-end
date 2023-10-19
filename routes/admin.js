import express from 'express';

const router = express.Router();

router.get('/additem', function (req, res) {
    res.render('admin/additem');
});

router.get('/product', function (req, res) {
    res.render('admin/itemlist');
});

router.get('/category', function (req, res) {
    res.render('admin/categorylist');
});

router.get('/order', function (req, res) {
    res.render('admin/orderlist');
});

router.get('/productdetails/:productId', function (req, res) {
    const productId = req.params.productId;
    res.render('admin/product_details', { productId });
});

router.get('/addcategory', function (req, res) {
    res.render('admin/add_category');
});
router.get('/categorydetails/:categoryId', function (req, res) {
    const categoryId = req.params.categoryId;
    res.render('admin/category_details', { categoryId });
});

router.get('/users', function (req, res) {
    res.render('admin/users');
});

export default router;
