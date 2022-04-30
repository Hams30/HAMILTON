import { useState, useEffect } from 'react';

// Input
import Input from 'rsuite/Input'

// Input Group
import InputGroup from 'rsuite/InputGroup'

// Button
import Button from 'rsuite/Button'

// react hot toast
import { Toaster, toast } from 'react-hot-toast'

// validators
import { loginValidator } from '../utils/validators';

// axios
import axios from 'axios'

// cookie Js
import cookieJs from 'js-cookie'

// useRouter
import { useRouter } from 'next/router';




// init Home component
const Home = () => {

  // init router
  const router = useRouter()

  // init visible
  const [visible, setVisible] = useState(false);

  // init email state 
  const [email, setEmail] = useState("")

  // init password
  const [password, setPassword] = useState("")

  // init isLoading
  const [isLoading, setIsLoading] = useState(false)


  // init handleToggleVisibility
  const handleToggleVisibility = () => {

    // update visible state
    setVisible(!visible);

  }



  // init handleSubmit
  const handleSubmit = async () => {
    try {

      // update isLoading state 
      setIsLoading(true)

      // get loginData
      const loginData = {
        email: email,
        password: password
      }


      // validate loginData
      const error = loginValidator(loginData)


      // if error
      if (error) {
        // update isLoading state 
        setIsLoading(false)
        return toast.error(error)
      }


      // make api request to login user
      const response = await axios.post(`${process.env.API_ROOT}/login`, loginData)


      // check if not success
      if (!response.data.success) {
        // update isLoading state 
        setIsLoading(false)
        return toast.error(response.data.message)
      }

      // get token
      const token = response.data.data

      // save token in cookie
      cookieJs.set('_x_Auth', token,  {secure: true})

      // show success
      toast.success("Login successful")

      // redirect user to dashboard
      return window.location.replace('/dashboard')


    } catch (error) {
      // update isLoading state 
      setIsLoading(false)
      console.log(error)
      return toast.error("Oops! failed to login")
    }
  }



  return (
    <>
      <Toaster />
      <div className="container-fluid">
        <div className="row h-100 align-items-center justify-content-center mt-5">
          <div className="col-12 col-sm-8 col-md-6 col-lg-5 col-xl-4">
            <div className="bg-light rounded p-4 p-sm-5 my-4 mx-3">
              <div className="d-flex align-items-center justify-content-between mb-3">

                <h3>NIHSA</h3>

                <h3 className="text-secondary">Sign In</h3>
              </div>
              <div className="form-floating mb-3">
                <Input placeholder="Email address" onChange={(value) => setEmail(value)} />

              </div>
              <div className="form-floating mb-4">
                <InputGroup inside>
                  <Input type={visible ? 'text' : 'password'} placeholder="Password" onChange={(value) => setPassword(value)} />
                  <InputGroup.Button onClick={handleToggleVisibility}>
                    {visible ? <i className="fa fa-eye"></i> : <i className="fa fa-eye-slash"></i>}
                  </InputGroup.Button>
                </InputGroup>
              </div>
              {isLoading ? <Button className="primary-btn" appearance="primary" block loading disabled>Login</Button> :
                <Button className="primary-btn" appearance="primary" block onClick={() => handleSubmit()} >Login</Button>
              }


            </div>
          </div>
        </div>
      </div>


    </>
  )
};





// export Home component
export default Home;
