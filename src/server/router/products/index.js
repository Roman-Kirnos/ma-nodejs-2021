const router = require('@awaitjs/express').Router();

const { products } = require('../../controllers');

const discounts = require('./discounts');
const types = require('./types');
const colors = require('./colors');

router.useAsync('/discounts', discounts);

router.postAsync('/', products.createProduct);
router.getAsync('/', products.getAllProducts);
router.getAsync('/:id', products.getProduct);
router.patchAsync('/:id', products.updateProduct);
router.deleteAsync('/:id', products.deleteProduct);

router.useAsync('/type', types);
router.useAsync('/color', colors);

module.exports = router;