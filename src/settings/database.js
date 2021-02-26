const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.DATABASE, 
    { 
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    }).then(db => 
        console.log('DB is connected!')
    ).catch(err => 
        console.error(err));