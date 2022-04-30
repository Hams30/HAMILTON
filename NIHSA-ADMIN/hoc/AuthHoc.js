// react
import { useState, useEffect } from 'react'

// router
import { useRouter } from 'next/router'

//  axios
import axios from '../config/axios.config'

// cookies
import cookieJS from 'js-cookie'


// init AuthHoc
const AuthHoc = (Component) => {
    return (props) => {

        // init router
        const router = useRouter()

        // init isLoading state
        const [isLoading, setIsLoading] = useState(true)

        // init authData
        const [authData, setAuthData] = useState({})


        // init useEffect
        useEffect(() => {

            (async () => {
                try {
                   
                    // make api request to verify user
                    const response = await axios.get(`${process.env.API_ROOT}/verify/user`)

                    // check if not success
                    if (!response.data.success) {
                       
                        return window.location.replace('/')
                    }

                    console.log("AUTH DATA", response.data.data)

                    // update isLoading
                    setIsLoading(false)

                    // update authData
                    setAuthData(response.data.data)

                    // set fullName to local sr
                    cookieJS.set("_authUser", response.data.data.fullName)

                } catch (error) {
                    console.log(error)
                    return router.replace({ pathname: '/' })
                }
            })()

        }, [])

        if (!isLoading) {
            return (
                <>

                    <Component {...props} authData={authData} />

                </>
            )
        } else {
            return (
                <>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-6 mx-auto mt-4">
                                <div className="d-flex justify-content-center mt-5">
                                    <div className="spinner-border" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    
                                </div>
                                <p className="text-center mt-3">Loading...</p>
                            </div>
                        </div>
                    </div>


                </>
            )
        }


    }
}




// export 
export default AuthHoc