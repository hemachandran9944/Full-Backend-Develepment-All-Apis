
const express   = require('express');
const app  = express();
require('dotenv').config(); 
const database_connection = require('./database');
const database_portnumber = 3000
const routers  = require ('./type of apis/five_types_apis.js'); 







app.use(express.json());


const Middlerwhare = "ReturURL:"

app.use((req, res, next)=>{
    console.log(Middlerwhare,req.url)
    next();
});




app.use('/node/apiS',routers); 





app.use((req, res, next)=>{
    const URL_error = "404 Page not found plese check URL"
    res.status(404).json(URL_error);
});





const port_number_listen_let   = "Server Connecting Successfully and listening on Port:"

app.listen(database_portnumber, ()=>{
    console.log(port_number_listen_let,database_portnumber)
});