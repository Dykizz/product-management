const dashboardRouters = require('./dashboard.router');
const productRouters = require('./products.router');
const categoriesRouter = require('./categories.router');
const rolesRouter = require('./roles.router');
const accountsRouter = require('./accounts.router')
const configSystem = require('../../config/system');
module.exports = (app) =>{
    const PATH_ADMIN = configSystem.prefixAdmin;
    app.use(PATH_ADMIN + '/dashboard',dashboardRouters);
    app.use(PATH_ADMIN + '/products',productRouters );
    app.use(PATH_ADMIN + '/categories',categoriesRouter);
    app.use(PATH_ADMIN + '/roles',rolesRouter);
    app.use(PATH_ADMIN + '/accounts',accountsRouter);
}