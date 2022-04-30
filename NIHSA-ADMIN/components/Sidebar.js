import { useEffect, useState } from 'react';

// Link
import Link from 'next/link';

// useRouter
import { useRouter } from 'next/router';

// cookieJs
import cookieJs from 'js-cookie'

// useVerifyUser
import useVerifyUser from '../hooks/useVerifyUser';



// init Sidebar component
const Sidebar = () => {

    // init router
    const router = useRouter()

    // get authName from localStorage
    const [authUser, setAuthUser] = useState("")

    // invoke useVerifyUser
    const { data, isLoading, isError } = useVerifyUser()

    console.log("AUTHDATA SIDEBAR", data && data)

    // init useEffect
    useEffect(() => {

        // update authUser state 
        setAuthUser(data && data.data && data.data)

    }, [data])



    // init handleLogout
    const handleLogout = () => {

        // clear cookie
        cookieJs.remove("_x_Auth")

        // clear user's name
        cookieJs.remove('_authUser')

        // push to login
        return window.location.href = "/"

    }


    return (
        <>
            <div className="sidebar pe-4 pb-3">
                <nav className="navbar bg-light navbar-light">

                    <h3 className="mx-4 my-3">NIHSA</h3>

                    <div className="navbar-nav w-100">

                        {/* Dashboard */}
                        <Link href="/dashboard"><a className={`nav-item nav-link text-decoration-none ${router.pathname === '/dashboard' && 'active'}`}><i className="fa fa-tachometer-alt me-2"></i>Dashboard</a></Link>



                        {/* Reports */}
                        <Link href="/reports"><a className={`nav-link ${router.pathname === '/reports' && 'active'}`}><i className="fa fa-users me-2"></i>Reports</a></Link>

                        
                        {/* Alerts */}
                        {authUser && authUser.isAdmin && <Link href="/alerts"><a className={`nav-link ${router.pathname === '/alerts' && 'active'}`}><i className="fa fa-exclamation-triangle me-2"></i>Alerts</a></Link> }


                        {/* Status */}
                        {authUser && authUser.isAdmin &&  <Link href="/status"><a className={`nav-link ${router.pathname === '/status' && 'active'}`}><i className="fa fa-plus me-2"></i>Status</a></Link> }



                        {authUser && authUser.isAdmin &&  <div className="nav-item dropdown">
                            <a className={`nav-link dropdown-toggle cursor ${router.pathname === '/requests' && 'active'}`} data-bs-toggle="dropdown"><i className="fa fa-hands-helping me-2"></i>Help Request</a>
                            <div className="dropdown-menu bg-transparent border-0">
                                <Link href="/requests"><a className={`dropdown-item ms-5 nav-link cursor fs-small`}>View Requests</a></Link>
                                <Link href="/requests/request-type"><a className="dropdown-item ms-5 mt-2 nav-link cursor fs-small">Request Type</a></Link>

                            </div>
                        </div> }


                        {authUser && authUser.isAdmin && <Link href="/news"><a className={`nav-link ${router.pathname === '/news' && 'active'}`}><i className="fa fa-newspaper me-2"></i>Blog News</a></Link> }
                        <Link href="/forum"><a className={`nav-link ${router.pathname === '/forum' && 'active'}`}><i className="fa fa-comment-dots me-2"></i>Forum</a></Link>
                        {authUser && authUser.isAdmin && <Link href="/weather"><a className={`nav-link ${router.pathname === '/weather' && 'active'}`}><i className="fa fa-cloud me-2"></i>Weather Forecast</a></Link>}
                        {authUser && authUser.isAdmin && <Link href="/agencies"><a className={`nav-link ${router.pathname === '/agencies' && 'active'}`}><i className="fa fa-id-badge me-2"></i>Agencies</a></Link> }
                        <a className="nav-item nav-link cursor" onClick={() => handleLogout()}><i className="fa fa-sign-out-alt me-2"></i>Logout</a>

                    </div>
                </nav>
            </div>

        </>
    )
};





// export Sidebar component
export default Sidebar;
