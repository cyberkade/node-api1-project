// BUILD YOUR SERVER HERE
const express = require('express')
const User = require('./users/model')

const server = express()

server.use(express.json())

server.get('/api/users', async (req, res) => {
    try {
        const users = await User.find()
        console.log(users)
        res.json(users)
    }
    catch (err) {
        res.status(500).json({
            message: err.message,
            customMessage: "The users information could not be retrieved"
        })
    }
})

server.get('/api/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        console.log(user)
        if(!user) {
            res.status(404).json({message: "The user with the specified ID does not exist"})
        } else {
            res.json(user)
        }
    }
    catch (err) {
        res.status(500).json({
            message: err.message,
            customMessage: "The user information could not be retrieved"
        })
    }
})


server.post('/api/users', async (req, res) => {
    try {
        const { name, bio } = req.body
        if(!name || !bio) {
            res.status(400).json({
                message: "Please provide name and bio for the user"
            })
        } else {
            const newUser = await User.insert({name, bio})
            res.status(201).json(newUser)
        }
    } 
    catch (err) {
        res.status(500).json({
            message: "There was an error while saving the user to the database"
        })
    }
})

server.delete('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params
        const deletedUser = await User.remove(id)
        if(!deletedUser) {
            res.status(404).json({ message: "The user with the specified ID does not exist" })
        } else {
            res.status(201).json(deletedUser)
        }
    }
    catch {
        res.status(500).json({
            message: "The user could not be removed"
        })
    }
})

server.put('/api/users/:id', async (req, res) => {
    try {
        const { name, bio } = req.body
        const { id } = req.params
        const user = await User.findById(id)

        if(!user) {
            res.status(404).json({ message: "The user with the specified ID does not exist" })
        } else if(!name || !bio) {
            res.status(400).json({ message: "Please provide name and bio for the user" })
        } else {
            const updatedUser = await User.update(id, {name, bio})
            res.status(200).json(updatedUser)
        }
    }
    catch {
        res.status(500).json({
            message: "The user information could not be modified"
        })
    }
})

module.exports = server; // EXPORT YOUR SERVER instead of {}
