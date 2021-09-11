const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const phoneNumber = process.argv[4]

const url =
  `mongodb+srv://Marco:${password}@cluster0.zkfgb.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: Number
})

const Person = mongoose.model('Person', personSchema)

if (!name || !phoneNumber) {
    console.log('Phonebook')
    Person.find({}).then(persons =>{
        console.log(`Phonebook has ${persons.length} entries`)
        persons.forEach((person, index) => {
            console.log(`Entry number: ${index+1} Name: ${person.name} Number: ${person.number}`)
        });
        mongoose.connection.close()
    })
    return console.log('Number and or person were not provided, so only all entries are listed')
}

const person = new Person({
  name: name,
  number: phoneNumber,
})

person.save().then(result => {
  console.log('person saved!')
  console.log(result)
  mongoose.connection.close()
})