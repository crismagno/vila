const path = require('path')
const multer = require('multer')
const Storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, path.join(__dirname,'../upload_images'))
    },
    filename(req, file, callback) {
        let type = file.originalname.split('.').reverse()[0]
        callback(null, `${file.fieldname}_${file.originalname}_${Date.now()}.${type}`)
    },
})
const upload = multer({ storage: Storage })

module.exports = app => {
    app.post('/users/', app.users.create)
    app.put('/users/avatar/:id', upload.single('avatar'), app.users.updateAvatar)
    app.put('/users/:id', app.users.updateUser)
    app.delete('/users/:id', app.users.removeUser)
    app.get('/users/', app.users.findAll)
    app.get('/users/signIn', app.users.findUserLogin)
    app.get('/users/:id', app.users.findUser)
}