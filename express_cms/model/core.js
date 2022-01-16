const mongoose=require('mongoose');
const config=require('../config/config');

mongoose.connect(config.dbUrl,{ useNewUrlParser: true, useUnifiedTopology: true },function(err){
        if(err){
            console.log(err);
            return;
        }
        console.log('Database connection succeeded')
});

module.exports=mongoose;
