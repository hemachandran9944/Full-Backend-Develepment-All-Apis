

const  Success_const  = "Sueccessfulley Connecting Cluster Data Base!"
const  failed_const  =  "falied Connecting Cluster Data Base!"


const mongoose = require ('mongoose')
const { error } = require('node:console')

//mongoose.connect(cluster_databseing)
//const cluster_databseing = "mongodb://hemachandranhema8754_db_user:F09oZcrRvHjg9hvj@ac-cduwql2-shard-00-00.62bc372.mongodb.net:27017,ac-cduwql2-shard-00-01.62bc372.mongodb.net:27017,ac-cduwql2-shard-00-02.62bc372.mongodb.net:27017/learn_backend?ssl=true&replicaSet=atlas-fmbi4s-shard-0&authSource=admin&retryWrites=true&w=majority";



const database_url = "mongodb://localhost:27017/learn_backend"

mongoose.connect(database_url)
    .then(()=>{
        console.log(Success_const);
    })


    .catch((error)=>{
        console.log(failed_const,error.message);
    });






