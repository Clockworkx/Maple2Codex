import React, { useState, useEffect } from 'react'
import personService from './services/persons'

const Search = ({ handleSearchChange }) => {
  return (
    <div>Search for a Person
      <input onChange={handleSearchChange} />
    </div>
  )
}

const PersonForm = (props) => {
  return (
    <div>
      <form onSubmit={props.addName}>
        <div>Name <input value={props.newName} onChange={props.handleNameChange} /></div>
        <div>Number <input value={props.newNumber} onChange={props.handleNumberChange} /></div>
        <div><button type="submit" >Add</button></div>
      </form>
    </div>
  )
}
const NumberDisplay = ({personsFiltered, handleDelete}) => {
  
  return (
    <div>
      <ul>
        {personsFiltered.map(person =>
          <li className='person' key={person.name}>
            {console.log('iddid', person.id)}{person.name} {person.number} <button onClick={() => handleDelete(person.id)}>Delete</button>
          </li>
        )}
      </ul>
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [notification, setNotification] = useState({message: null, style: null})

  useEffect(() => {
    let i = 0
    console.log('effect ', i )
   personService.getAll()
    .then(response => {
      setPersons(response)
    }).catch(error => {
      console.log('error')
      
    })
  }, [])

  const Notification = ({notificationDetails}) => {
    console.log(notificationDetails)
    const error = {
      color: 'red',
      background: 'lightgrey',
      fontSize: 20,
      borderStyle: 'solid',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10
    }

    const success = {
      color: 'green',
      background: 'lightgrey',
      fontSize: 20,
      borderStyle: 'solid',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10
    }
    if (notificationDetails.message === null) return null
    let style = undefined

    if (notificationDetails.style === 'success')
    style = success

    if (notificationDetails.style === 'error')
    style = error

    return (
      <div style={style}>
        {notificationDetails.message}
      </div>
    )
  }

  const addName = (event) => {
    event.preventDefault()
    if (persons.some(person => person.name === newName)) {
      let existingPerson = persons.find(person => person.name === newName)
      if (window.confirm(`${existingPerson.name} already exists in the phonebook, replace the old with the new number?`)){
        personService.change(existingPerson.id, {...existingPerson, number: newNumber}).then(response => {
          const changedPersons = persons.map(p => p.id !== existingPerson.id ? p : {...p, number: newNumber} )

          setPersons(changedPersons)
          setNewName('')
          setNewNumber('')
        })
        .catch(error => {
          setNotification({message: `${existingPerson.name} is not found on the server`, style: 'error'})
          setTimeout(() => setNotification({message: null}), 5000)
        })
      }
      return
    }

    const person = {
      name: newName,
      number: newNumber
    }

    console.log(newName)
    personService.create(person).then(response => {
      setPersons(persons.concat(response))
      setNewName('')
      setNewNumber('')
      setNotification(({message: `Added ${response.name} to the Phonebook`, style: 'success'}))
      setTimeout(() => setNotification({message: null}), 5000)
    })
  }

  const handleDelete = (id) => {
    if (window.confirm("hi")){
      personService.deletePerson(id)
      setPersons(persons.filter(person => person.id !== id))
    }
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleSearchChange = (event) => {
    console.log(event.target.value)
    setSearchName(event.target.value)
  }

  const [searchName, setSearchName] = useState('')

  const personsFiltered = searchName ?
    persons.filter(person =>
      person.name.toLowerCase().includes(searchName.toLowerCase())) : persons

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification notificationDetails={notification}/>
      <Search handleSearchChange={handleSearchChange} />
      <h2>Add a new</h2>
      <PersonForm addName={addName} newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <NumberDisplay personsFiltered={personsFiltered} handleDelete={handleDelete}/>
    </div>
  )
}

export default App