const bcrypt = require('bcrypt')
const saltBounds = 10
const jwt = require('jwt-simple')
const moment = require('moment');

module.exports = app => {

    // criar usuário
    const create = async (req, res) => {
        let user = req.body

        try {
            if (!user.name || !user.email) return res.status(400).json({ error: 'Request body error formatted'})
            
            let userFromdb = await app.db('users').where({ email: user.email }).first()
            
            if (!!userFromdb) {
                return res.status(400).json({ error: 'User invalid'})
            } else {
                user.password = bcrypt.hashSync(user.password, saltBounds)
                user.created_at = moment().utc().format();
                await app.db('users').insert(user)
                return res.status(200).json({ success: 'Save user success'})
            }
        } catch (error) {
            console.log(error)
            return res.status(400).json({ error: 'Request error to save user'})
        }
    }

    // login do usuário
    const findUserLogin = async (req, res) => {
        const { email, password } = req.body

        try {

            if (!email || !password) return res.status(400).json({ error: 'Request body invalid' })
            
            let user = await app.db('users').where({ email }).first()

            if (!user) return res.status(404).json({ error: 'User not a found' })
            
            let passwordCompare = bcrypt.compareSync(password, user.password)

            if (!passwordCompare) return res.status(400).json({ error: 'Password Invalid' }) 

            let payload = {
                ...user,
                tokenCreatedAt: Date.now()
            }

            let token = jwt.encode(payload, process.env.AUTH_SECRET)
            user['token'] = token
            return res.status(200).json(user)
            
        } catch (error) {
            console.log(error)
            return res.status(400).json({ error: 'Request error user login'})
        }
    }

    // buscar usuário
    const findUser = async (req, res) => {
        const { id } = req.params
        
        try {
            if (!id) return res.status(400).json({ error: 'Request params invalid' })
            
            let user = await app.db('users').where({ id }).first()

            if (!user) return res.status(404).json({ error: 'User not a found' })
            
            return res.status(200).json(user)
        } catch (error) {
            console.log(error)
            return res.status(400).json({ error: 'Request error to find user'})
        }
    }

    // buscar todos os usuários
    const findAll = async (req, res) => {
        try {
            let users = await app.db('users')
            return res.status(200).json(users)
        } catch (error) {
            console.log(error)
            return res.status(400).json({ error: 'Request error to find all users'})
        }
    }

    // atualizar usuário
    const updateUser = async (req, res) => {
        const { currentEmail, newEmail, name, password, confirmPassword, admin } = req.body
        const { id } = req.params

        try {

            if (!id || !name || !currentEmail || !newEmail || !password || !confirmPassword) {
                return res.status(400).json({ error: 'Request body error formatted'})
            }

            // validação se usuário existe
            if (password !== confirmPassword) return res.status(400).json({ error: 'Password is not equal' })

            const userFromDB = await app.db('users').where({ id }).first()

            // validação se usuário existe
            if (!userFromDB) return res.status(400).json({ error: 'User not found' })

            // validação se email atual é o mesmo do usuário do banco
            if (userFromDB.email !== currentEmail) return res.status(400).json({ error: 'User current email is not possible update' })

            const newUser = {
                name,
                email: newEmail,
                password: bcrypt.hashSync(password, saltBounds),
                admin,
                updated_at: moment().utc().format()
            }

            let userUpdated = await app.db('users').update(newUser).where({ id }).returning('*')

            return res.status(200).json({ ...userUpdated[0] })
        } catch (error) {
            console.log(error)
            return res.status(400).json({ error: 'Request error to update user'})
        }
    }

    // deletar usuário
    const removeUser = async (req, res) => {
        const { id } = req.params

        try {
            if (!id) return res.status(400).json({ error: 'Request params invalid' })

            let user = await app.db('users').where({ id }).delete()
            return res.status(200).json(user)
        } catch (error) {
            console.log(error)
            return res.status(400).json({ error: 'Request error to remove user'})
        }
    }

    // atualizar avatar do usuário
    const updateAvatar = async (req, res) => {
        const { id } = req.params

        if (!id || !req.file) return res.status(400).json({ error: 'Error update avatar file' })
        
        const { path: avatar } = req.file

        try {
            let user = await app.db('users').where({ id }).first()

            if (!user) return res.status(404).json({ error: 'User not a found' })

            let userUpdated = await app.db('users').update({ avatar, updated_at: moment().utc().format() }).where({ id }).returning('*')
            
            return res.status(200).json({ ...userUpdated[0] })
        } catch (error) {
            console.error(error)
            return res.status(400).json({ error: 'Request error to update avatar user'})
        }
    }

    return {
        create,
        findUserLogin,
        findAll,
        findUser,
        updateUser,
        removeUser,
        updateAvatar
    }
}