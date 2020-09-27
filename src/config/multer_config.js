const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, path.join(__dirname,'../upload_images'))
    },
    filename(req, file, callback) {
        let type = file.originalname.split('.').reverse()[0]
        callback(null, `${file.fieldname}_${file.originalname}_${Date.now()}.${type}`)
    },
})
const upload = multer({ storage })

module.exports = upload