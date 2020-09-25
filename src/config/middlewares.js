const bodyPArser = require("body-parser")
const cors = require("cors")
const logger = require('morgan')

module.exports = app => {
    app.use(logger('dev'));
    app.use(bodyPArser.json())
    app.use(bodyPArser.urlencoded({ extended: true }))
    app.use(cors())
}