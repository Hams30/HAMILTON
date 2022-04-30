import { useState, useEffect } from 'react';

// Avatar
import Avatar from 'react-avatar';

// cookieJs
import cookieJs from 'js-cookie'

// router
import { useRouter } from 'next/router';

// useVerifyUser
import useVerifyUser from '../hooks/useVerifyUser';


// init Navbar component
const Navbar = () => {

    // init router
    const router = useRouter()

    // get authName from localStorage
    const [authUser, setAuthUser] = useState("")

    // invoke useVerifyUser
    const { data, isLoading, isError } = useVerifyUser()


    // init useEffect
    useEffect(() => {

        // update authUser state 
        setAuthUser(data && data.data && data.data.fullName)


    }, [data])




    // init handleLogout
    const handleLogout = () => {

        // clear cookie
        cookieJs.remove("_x_Auth")


        // push to login
        return window.location.href = "/"

    }



    return (
        <>

            <nav className="navbar navbar-expand bg-light navbar-light sticky-top px-4 py-0">

                <a className="sidebar-toggler flex-shrink-0 cursor">
                    <i className="fa fa-bars text-dark"></i>
                </a>
                <div className="navbar-nav align-items-center ms-auto">
{/* 
                    <div className="nav-item dropdown">
                        <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
                            <i className="fa fa-bell me-lg-2"></i>
                            <span className="d-none d-lg-inline-flex">Notifications</span>
                        </a>
                        <div className="dropdown-menu dropdown-menu-end bg-light border-0 rounded-0 rounded-bottom m-0">
                            <a href="#" className="dropdown-item">
                                <h6 className="fw-normal mb-0">Profile updated</h6>
                                <small>15 minutes ago</small>
                            </a>
                            <hr className="dropdown-divider" />
                            <a href="#" className="dropdown-item">
                                <h6 className="fw-normal mb-0">New user added</h6>
                                <small>15 minutes ago</small>
                            </a>
                            <hr className="dropdown-divider" />
                            <a href="#" className="dropdown-item">
                                <h6 className="fw-normal mb-0">Password changed</h6>
                                <small>15 minutes ago</small>
                            </a>
                            <hr className="dropdown-divider" />
                            <a href="#" className="dropdown-item text-center">See all notifications</a>
                        </div>
                    </div> */}
                    <div className="nav-item dropdown">
                        <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
                            <Avatar name={authUser ? authUser : ""} round={true} color="#269c53" size="40" />
                            <span className="d-none d-lg-inline-flex ms-1">{authUser ? authUser : "Loading..."}</span>
                        </a>
                        <div className="dropdown-menu dropdown-menu-end bg-light border-0 rounded-0 rounded-bottom m-0">
                            <a className="dropdown-item cursor" onClick={() => handleLogout()}>Log Out</a>
                        </div>
                    </div>
                </div>
            </nav>

        </>
    )
};






// export Navbar component
export default Navbar;
