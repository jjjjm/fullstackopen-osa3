const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('build'))

morgan.token('body', (req, res) =>  JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


const PORT = process.env.PORT || 3001

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const requestId = Number(request.params.id)
    const person = persons.find(person => person.id === requestId)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.get('/info', (request, response) => {
    response.send(
        `<div>Phonebook has info for ${persons.length} people</div>
         <div>${new Date()}</div>`
    )
})

app.delete('/api/persons/:id', (request, response) => {
    const requestId = Number(request.params.id)
    persons = persons.filter(person => person.id !== requestId)
    response.status(201).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    if(!body.name || !body.number) {
        return response.status(400).json({
            error: 'content missing'
        })
    }
    if(persons.map(person => person.name).includes(body.name)){
        return response.status(400).json({
            error: 'name must be unique'
        })
    }
    const newPerson = {...body, id : Math.floor(Math.random() * 100000)}
    persons = persons.concat(newPerson)
    response.json(newPerson)
})


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