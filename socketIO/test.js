module.exports = function (server) {
    // get IO object
    const io = require('socket.io')(server)
    // monitor connection (when a user connect callback)
    io.on('connection', function (socket) {
        console.log('soketio connected')
        // bind sendMsg monitor, receive the msg of client
        socket.on('sendMsg', function (data) {
            console.log('Server received msg from browser', data)
            // send msg to all clients (name, data)
            io.emit('receiveMsg', data.name + '_' + data.date)
            // socket.emit(...) // send msg to the current client in server
            console.log('Server sent msg to browser', data)
        })
    })
}

