

module.exports = app => {

    app.route('/users')
        .get(app.users.findAll)
        .post(app.users.save)
}