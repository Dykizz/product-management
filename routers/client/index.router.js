const categoryMiddleware = require('../../middleware/client/category.middleware');
const clientaccountMiddleware = require('../../middleware/client/clientaccount.middleware');
const productsRouters = require('./products.router');
const homeRouters = require('./home.router');
const searchRouters = require('./search.router');
const userRouters = require('./user.router');
const cartRouters = require('./cart.router');
const checkoutRouter = require('./checkout.router');
const chatRouter = require('./chatRouter');
const usersRouter = require('./users.router');
module.exports = (app) =>{
    app.use((req, res, next) => {
        res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        next();
      });
    app.use(categoryMiddleware.index);
    app.use(clientaccountMiddleware.index);
    app.use('/',homeRouters);
    app.use('/products', productsRouters);
    app.use('/search',searchRouters);
    app.use('/user',userRouters);
    app.use('/cart',cartRouters);
    app.use('/checkout',checkoutRouter);
    app.use('/chat',chatRouter);
    app.use('/users',usersRouter);
} 