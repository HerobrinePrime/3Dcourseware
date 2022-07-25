import axios from "axios";
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'

const request = axios.create({
    // baseURL: 'http://150.158.94.140:3658',
    baseURL: 'http://127.0.0.1:3658',
    timeout: 50000,
})

request.interceptors.request.use(config => {
    config.headers["Authorization"] = `Bearer ${localStorage.getItem('token')}`
    nprogress.start()
    return config
})

request.interceptors.response.use(res => {
    nprogress.done()
    return res
}, err => {
    console.log(err);
    return {
        data: {
            msg: err.message,
            code: 500
        }
    }
})

export {
    request
}