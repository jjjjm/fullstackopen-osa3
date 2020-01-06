require('dotenv').config()
const express = require('express')
const app = express()


const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/person')

app.use(cors())
app.use(express.static('build'))
app.use(bodyParser.json())

morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


const PORT = process.env.PORT || process.env.PORT

app.get('/api/persons', (request, response, next) => {
    Person.find({})
        .then(result => { response.json(result) })
        .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => response.json(person.toJSON()))
        .catch(error => next(error))
})

app.get('/info', (request, response) => {
    response.send(
        `<div>Phonebook has info for ${(persons.length())} people</div>
         <div>${new Date()}</div>`
    )
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => { response.status(201).end() })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const newPerson = new Person({ ...body })

    newPerson.save()
        .then(person => { response.json(person.toJSON()) })
        .catch(error => next(error))

    // if (persons.map(person => person.name).includes(body.name)) {
    //     return response.status(400).json({
    //         error: 'name must be unique'
    //     })
    // }
    // const newPerson = { ...body, id: Math.floor(Math.random() * 100000) }
    // persons = persons.concat(newPerson)
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updated => { response.json(updated.toJSON()) })
        .catch(error => next(error))

})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError' && error.kind == 'ObjectId') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}

app.use(errorHandler)


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

let persons = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1
    },
    {
        name: "Ada Lovelace",
        number: "39-445323523",
        id: 2
    },
    {
        name: "Dan Abramov",
        number: "12-43-5323523",
        id: 3
    },
    {
        name: "Mary Poppendieck",
        number: "39-23-6423122",
        id: 4
    }
]