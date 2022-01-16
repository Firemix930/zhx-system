const multer = require('multer');
const path = require('path');
const sd = require('silly-datetime');
const mkdirp = require('mkdirp');
const md5 = require('md5');

let tools={
    multer(){

        var storage = multer.diskStorage({
            //Configure the uploaded directory
            destination: async (req, file, cb)=>{
                //1、Get current date 
                let day=sd.format(new Date(), 'YYYYMMDD');
                // static/upload
                let dir=path.join("static/upload",day)
                //2、Generating a picture storage directory by date mkdirp is an asynchronous method
                await mkdirp(dir)   
                
                cb(null, dir) //The directory must exist before uploading
            },
            //Modify the uploaded file name
            filename: (req, file, cb)=> {
                //1、Get suffix
                let extname= path.extname(file.originalname);
                //2、Generate file name based on Timestamp
                cb(null, Date.now()+extname)
            }
        })
        
        var upload = multer({ storage: storage })

        return upload;
        
    },
    md5(str){
        return md5(str)
    },
    getUnix(){
        var d=new Date()
        return d.getTime()
    },
    formatTime(unixStr){
        let day=sd.format(unixStr, 'YYYY-MM-DD');
        return day
    },
    unixToDay(unixStr){
        let day=sd.format(unixStr, 'DD');
        return day
    },
    unixToYearAndMonth(unixStr){
        let day=sd.format(unixStr, 'YYYY-MM');
        return day
    }
}

module.exports=tools