const express = require('express');


require('dotenv').config();

const database = require('./config/database');
const systemConfig = require('./config/system')
database.connect();

const routeClient = require('./routers/client/index.router');
const routeAdmin = require('./routers/admin/index.router');
const app = express();
const port = process.env.PORT ;

app.set('views','./views');
app.set('view engine','pug');
app.use(express.static('public'));

// App Locals Variable
app.locals.prefixAdmin = systemConfig.prefixAdmin;

// Routers
routeClient(app);
routeAdmin(app);

app.listen(port, ()=>{
    console.log(`Example app listening on port ${port}`)
})