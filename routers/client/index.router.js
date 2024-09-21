const categoryMiddleware = require('../../middleware/client/category.middleware');
const clientaccountMiddleware = require('../../middleware/client/clientaccount.middleware');
const productsRouters = require('./products.router');
const homeRouters = require('./home.router');
const searchRouters = require('./search.router');
const authRouters = require('./auth.router');
module.exports = (app) =>{
    app.use(categoryMiddleware.index);
    app.use(clientaccountMiddleware.index);
    app.use('/',homeRouters);
    app.use('/products', productsRouters);
    app.use('/search',searchRouters);
    app.use('/auth',authRouters);
} 