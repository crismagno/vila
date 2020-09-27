const multerConfig = require('./../config/multer_config')

module.exports = app => {
    app.post('/users/', app.users.create)
    app.put('/users/avatar/:id', multerConfig.single('avatar'), app.users.updateAvatar)
    app.put('/users/:id', app.users.updateUser)
    app.delete('/users/:id', app.users.removeUser)
    app.get('/users/', app.users.findAll)
    app.get('/users/signIn', app.users.findUserLogin)
    app.get('/users/:id', app.users.findUser)
}