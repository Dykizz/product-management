const dashboardRouters = require('./dashboard.router');
const productRouters = require('./products.router');
const categoriesRouter = require('./categories.router');
const rolesRouter = require('./roles.router');
const accountsRouter = require('./accounts.router');
const authRouter = require('./auth.router');
const configSystem = require('../../config/system');
const authRequire = require('../../middleware/admin/auth.middleware');
const myprofileRouter = require('./myprofile.router');
const settingRouter = require('./setting.router');
module.exports = (app) => {
    const PATH_ADMIN = configSystem.prefixAdmin;
    app.use(PATH_ADMIN + '/dashboard', authRequire.requireAuth, dashboardRouters);
    app.use(PATH_ADMIN + '/products', authRequire.requireAuth, productRouters);
    app.use(PATH_ADMIN + '/categories', authRequire.requireAuth, categoriesRouter);
    app.use(PATH_ADMIN + '/roles', authRequire.requireAuth, rolesRouter);
    app.use(PATH_ADMIN + '/accounts', authRequire.requireAuth, accountsRouter);
    app.use(PATH_ADMIN + '/auth', authRouter);
    app.use(PATH_ADMIN + '/myprofile',authRequire.requireAuth, myprofileRouter);
    app.use(PATH_ADMIN + '/setting',authRequire.requireAuth,settingRouter);
}