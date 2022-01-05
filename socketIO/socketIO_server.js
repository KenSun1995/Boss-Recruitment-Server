const { ChatModel } = require('../db/models')

module.exports = function (server) {
    // get IO object
    const io = require('socket.io')(server)
    // monitor connection (when a user connect callback)
    io.on('connection', function (socket) {
        console.log('soketio connected')
        // bind sendMsg monitor, receive the msg of client
        socket.on('sendMsg', function ({ from, to, content }) {
            console.log('Server received msg from browser', { from, to, content })
            // deal with data (save msg)
            const chat_id = [from, to].sort().join('_');
            const create_time = Date.now();
            new ChatModel({ from, to, content, chat_id, create_time }).save((error, chatMsg) => {
                io.emit('receiveMsg', chatMsg);
            });
        })
    })
}

