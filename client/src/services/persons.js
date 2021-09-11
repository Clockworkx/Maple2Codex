import axios from 'axios'

const baseUrl = '/api/persons'

const getAll = () => {
   const request = axios.get(baseUrl)
   return request.then(response => response.data)
}

const create = (person) => {
    const request = axios.post(baseUrl, person)
    return request.then(response => response.data)
}

const deletePerson = (id) => {
    const request = axios.delete(`${baseUrl}/${id}`)
    return request.then(response => response.data)
}

const change = (id, person) => {
    console.log('executed')
    console.log(`${baseUrl}/${id}`)
    console.log('object, number', person)
    const request = axios.put(`${baseUrl}/${id}`, person )
    return request.then(response => response.data)
}

export default {
    getAll, create, deletePerson, change
}