/**
 * build connection to db
 */
const mongoose = require('mongoose')
// mongoose.connect('mongodb://localhost:27017/users')
mongoose.connect('mongodb+srv://sunkunbo:Woshishuik13!@bob-recruitment.lyej8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
const conn = mongoose.connection;
conn.on('connected', () => {
    console.log('db connected successfully');
})
/**
 * design Schema
 */
const userSchema = mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    type: { type: String, required: true },
    header: { type: String },
    position: { type: String },
    info: { type: String },
    company: { type: String },
    salary: { type: String }
})
/**
 * generate Model
 */
const UserModel = mongoose.model('user', userSchema);
/**
 * exports the Model 
 */
exports.UserModel = UserModel;

// define chat schema structure
const chatSchema = mongoose.Schema({
    from: { type: String, required: true }, // from which id
    to: { type: String, required: true }, // to which id
    chat_id: { type: String, required: true }, // string consists of from and to
    content: { type: String, required: true }, // content
    read: { type: Boolean, default: false }, // read or not already
    create_time: { type: Number } // create time
})
// generate model
const ChatModel = mongoose.model('chat', chatSchema)
// exports the model
exports.ChatModel = ChatModel