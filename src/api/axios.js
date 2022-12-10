import axios from 'axios'

export default axios.create({
    baseURL: 'https://cors-anywhere.herokuapp.com/http://qsappdev.somee.com/api'
})