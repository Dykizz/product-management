const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
require('dotenv').config();

const database = require('./config/database');
const systemConfig = require('./config/system')
database.connect();

const routeClient = require('./routers/client/index.router');
const routeAdmin = require('./routers/admin/index.router');
const app = express();
const port = process.env.PORT ;

app.set('views',`${__dirname}/views`);
app.set('view engine','pug');
app.use(express.static(`${__dirname}/public`));
/* New Route to the TinyMCE Node module */
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret : 'JDIW7BSBD9QU3QZ',
    cookie : {maxAge : 1000}
}));
app.use(require('flash')());
// App Locals Variable
app.locals.prefixAdmin = systemConfig.prefixAdmin;

// Routers
routeClient(app);
routeAdmin(app);

app.listen(port, ()=>{
    console.log(`Example app listening on port ${port}`)
})