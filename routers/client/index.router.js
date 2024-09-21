const categoryMiddleware = require('../../middleware/client/category.middleware');
const productsRouters = require('./products.router');
const homeRouters = require('./home.router');
const searchRouters = require('./search.router');
module.exports = (app) =>{
    app.use(categoryMiddleware.index);
    app.use('/',homeRouters);
    app.use('/products', productsRouters);
    app.use('/search',searchRouters)
} 