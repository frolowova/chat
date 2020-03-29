const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const createObj = (name, text, id) => ({ name, text, id })
const users = require('./users')()

io.on('connection', socket => {
    console.log("IO Connected")

    socket.on('userJoined', (data, cb) => {
        if (!data.name || !data.room) {
            return cb('Ошибка. Необходимо указать Имя и Комнату')
        }

        socket.join(data.room)
        users.remove(socket.id)
        users.add({
            id: socket.id,
            name: data.name,
            room: data.room
        })
        cb({ userId: socket.id })
        io.to(data.room).emit('updateUsers', users.getByRoom(data.room)) // Обновляем список пользователей в комнате
        socket.emit('newMessage', createObj('admin', `${data.name}, мы рады вас видеть`))
        socket.broadcast
            .to(data.room)
            .emit('newMessage', createObj('admin', `С нами теперь ${data.name}`))
    })

    socket.on('createMessage', (data, cb) => {
        if (!data.text) {
            return cb('Текст не может быть пустым')
        }
        const user = users.get(data.id)
        if (user) {
            io.to(user.room).emit('newMessage', createObj(user.name, data.text, data.id))
        }
        cb()
    })

    socket.on('userLeft', (id, cb) => {
        const user = users.remove(id)
        if (user) {
            io.to(user.room).emit('updateUsers', users.getByRoom(user.room))    // Обновляем список пользователей в комнате
            io.to(user.room).emit('newMessage', createObj('admin', `${user.name} ушёл из комнаты`))
        }
        cb()
    })

    socket.on('disconnect', () => {
        const user = users.remove(socket.id)
        if (user) {
            io.to(user.room).emit('updateUsers', users.getByRoom(user.room))
            io.to(user.room).emit('newMessage', createObj('admin', `${user.name} ушёл из комнаты`))
        }
    })

})

module.exports = { app, server }