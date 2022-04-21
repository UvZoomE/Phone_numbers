const express = require('express')
const morgan = require('morgan')
const app = express()
const fs = require('fs')
const path = require('path')
app.use(express.static('build'))

app.use(express.json())

morgan.token("code", function getCode(req) {
  return JSON.stringify(req.body);
 });

app.use(morgan(':method :url :status :response-time :code'))

let date = new Date('April 18, 2022 07:06:00');

let people = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get("/", (req, res) => {
  res.send("Landing page")
})

app.get("/api/persons", (req, res) => {
  res.status(200).json(people)
})

app.get("/info", (req, res) => {
  res.status(200).send(`Phonebook has info for ${people.length} people ${date}`)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = people.find(person => person.id === Number(id))
  response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  people = people.filter(person => person.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  let person = {}
  const values = Object.values(request.body)
  const keys = Object.keys(request.body)
  if (!(keys.includes("name"))) return response.status(400).send({error: "A name must be given"})
  else if ((people.some(el => el.name === values[0]))) return response.status(406).send({error: "Name must be unique"})
  person = {
    id: Math.floor(Math.random() * 100 + 1),
    name: values[0],
    number: values[1]
  }
  people = people.concat(person)
  response.json(people)
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Listening to port at ${PORT}`)
})
