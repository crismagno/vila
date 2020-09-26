const router = require('express').Router()
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

    router.post('/', app.users.create)
    router.put('/avatar/:id', upload.single('avatar'), app.users.updateAvatar)
    router.put('/:id', app.users.updateUser)
    router.delete('/:id', app.users.removeUser)
    router.get('/', app.users.findAll)
    router.get('/signIn', app.users.findUserLogin)
    router.get('/:id', app.users.findUser)
    
    app.use('/users', router)
}