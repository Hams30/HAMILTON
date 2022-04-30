// axios
import axios from 'axios'

// cookie js
import cookieJs from 'js-cookie'


// get authToke from cookie
const authToken = cookieJs.get('_x_Auth')


// intercept request
axios.interceptors.request.use((config) => {

    // check if authToken
    if (authToken) {
        config.headers.authorization = authToken
    }

    // return config
    return config

})






// export axios 
export default axios