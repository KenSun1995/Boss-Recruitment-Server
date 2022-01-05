// reference mongoose
const mongoose = require('mongoose')
// md5
const md5 = require('blueimp-md5')
// connect database
mongoose.connect('mongodb://localhost:27017/gzhipin2');
// get connection object
const conn = mongoose.connection;
// confirm connected
conn.on('connected', ()=>{
    console.log('Mongodb connected successfully!');
})

/**
 * get related collection module
 */
// define Schema (describe document structure)
const userSchema = mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    type: {type: String, required: true},
    header: {type: String}
})
// define model to operate the collection
const UserModel = mongoose.model('user', userSchema); // figure to collection 'users'

/**
 * CRUD operation
 */
// use model's save function to save doc
function testSave(){
    const userModel = new UserModel({username: 'Bob', password: md5('123'), type: 'expert'});
    userModel.save((error, user)=>{
        console.log("save() error: " + error);
        console.log("save() return: " + user);
    });
}
// testSave();
function testQuery(){
    UserModel.find({'username': 'Bob'}, (error, users)=>{
        console.log('find(): ', error, users);
    });

    UserModel.findOne({'username': 'Bob'}, (error, user)=>{
        console.log('findOne(): ', error, user);
    })
}
// testQuery();
function testUpdate(){
    UserModel.findByIdAndUpdate({_id: '619e76cf303b7108a7a7d1e6'}, {username: 'JuBao'}, (error, doc)=>{
        console.log(doc);
    })
}
// testUpdate();
function testDelete(){
    UserModel.remove({_id: '619e76cf303b7108a7a7d1e6'}, (error, doc)=>{
        console.log(doc);
    })
}
// testDelete();