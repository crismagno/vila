const bcrypt = require('bcrypt')
const saltBounds = 10

module.exports = app => {

    // criar usuário
    const save = async (req, res) => {
        let user = req.body

        if (!user.name || !user.email) {
            return res.status(400).json({ error: 'Request body error formatted'})
        }

        try {
            let userFromdb = await app.db('users').where({ email: user.email }).first()
            user.password = bcrypt.hashSync(user.password, saltBounds)
            
            if (!!userFromdb) {
                return res.status(400).json({ error: 'User invalid'})
            } else {
                await app.db('users').insert(user)
                return res.status(200).json({ success: 'Save user success'})
            }
            
        } catch (error) {
            console.log(error)
            return res.status(400).json({ error: 'Request error to save user'})
        }
    }

    // criar usuário
    const findAll = async (req, res) => {
        try {
            let users = await app.db('users')
            return res.status(200).json(users)
            
        } catch (error) {
            console.log(error)
            return res.status(400).json({ error: 'Request error to find all users'})
        }
    }

    return {
        save,
        findAll
    }
}