const dashboardRouters = require('./dashboard.router');
const productRouters = require('./products.router');
const configSystem = require('../../config/system')
module.exports = (app) =>{
    const PATH_ADMIN = configSystem.prefixAdmin;
    app.use(PATH_ADMIN + '/dashboard',dashboardRouters);
    app.use(PATH_ADMIN + '/products',productRouters )
}