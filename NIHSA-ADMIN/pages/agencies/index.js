import { useState, useEffect } from 'react';

// AuthHoc
import AuthHoc from '../../hoc/AuthHoc';

// Loading skeleton
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

// react hot toast
import { Toaster, toast } from 'react-hot-toast';

// axios
import axios from '../../config/axios.config'

// useAgencies
import useAgency from '../../hooks/useAgency';

// router
import { useRouter } from 'next/router';

// Button
import Button from 'rsuite/Button'

// validator
import { createAgencyValidator } from '../../utils/validators'




// init Agencies component
const Agencies = () => {

    // init rotuer
    const router = useRouter()

    // invoke useAgency
    const { data, isLoading, isError } = useAgency()

    console.log(data && data)


    // init useEffect
    useEffect(() => {

        if (isError) {
            return toast.error("Oops! An error has occurred")
        }

    }, [])  

    // init agencyID
    const [agencyId, setAgencyId] = useState("")

    // init isAddLoading
    const [isAddLoading, setIsAddLoading] = useState(false)

    // init isDeleteLoading
    const [isDeleteLoading, setIsDeleteLoading] = useState(false)

    // init fullName
    const [fullName, setFullName] = useState("")

    // init email
    const [email, setEmail] = useState("")

    // init phone
    const [phone, setPhone] = useState("")

    // init password
    const [password, setPassword] = useState("")



    // init handleSubmit
    const handleSubmit = async () => {
        try {

            setIsAddLoading(true)

            // init agencyData
            const agencyData = {
                fullName: fullName,
                email: email,
                phone: phone,
                password: password
            }

            // validator
            const error = createAgencyValidator(agencyData)

            // check if error
            if (error) {
                setIsAddLoading(false)
                return toast.error(error)
            }


            console.log(agencyData)

            // make request to create agency
            const response = await axios.post(`${process.env.API_ROOT}/create/agency`, agencyData)


            // check if not success
            if (!response.data.success) {
                setIsAddLoading(false)
                return toast.error(response.data.message)
            }


            // show success
            toast.success("Agency created successfully")


            // reload
            return router.reload()



        } catch (error) {
            setIsAddLoading(false)
            console.log(error)
            return toast.error("Failed to create agency")
        }
    }



    // init handleDeleteAgency
    const handleDeleteAgency = async() => {
        try {
            setIsDeleteLoading(true)

            // get agencyId
            const _agencyId = agencyId

            if(!_agencyId) {
                setIsDeleteLoading(false)
                return toast.error("Oops! failed to delete agency, Invalid id", {style: {maxWidth: 500}})
            }

            // make api request to delete 
            const response = await axios.delete(`${process.env.API_ROOT}/delete/user/${_agencyId}`)


            // not success
            if(!response.data.success) {
                return toast.error(response.data.message)
            }

            // show success toast
            toast.success("Agency deleted successfully")


            // reload
            return router.reload()
            

        }catch(error) {
            setIsDeleteLoading(false)
            console.log(error)
            return toast.error("Failed to delete agency")
        }
    }



    return (
        <>
            <Toaster />
            <div className="container-fluid pt-3 pb-5 mb-4 px-4">
                <div className="bg-light rounded p-4 border-small mb-3">
                    <div className="row g-3 justify-content-between">
                        <div className="col-auto text-start">
                            <h4 className="mb-0 me-3">Agencies</h4>
                        </div>
                        <div className="col-auto ms-auto">
                            <button className="btn btn-secondary btn-sm" data-bs-toggle="modal" data-bs-target="#addAgencyModal"><i className="fa fa-plus me-2"></i>Add Agency</button>
                        </div>
                    </div>




                    <div className="row">
                        {isLoading ? <>

                            <div className="row mt-5">
                                <div className="col-12">
                                    <Skeleton height={80} />
                                </div>
                            </div>

                        </> :
                            <>

                                {data && data.data && [...data.data].length > 0 ?
                                    <div className="table-responsive mt-5">
                                        <table className="table  text-start align-middle table-hover table-borderless mb-0">
                                            <thead>
                                                <tr className="text-dark">
                                                    <th scope="col">Full Name</th>
                                                    <th scope="col">Email</th>
                                                    <th scope="col">Phone Number</th>
                                                    <th scope="col">Email</th>
                                                    <th scope="col">Action</th>

                                                </tr>
                                            </thead>
                                            <tbody>


                                                <>
                                                    {[...data.data].map((user, index) => {
                                                        return <tr key={index}>
                                                            <td>{user.fullName}</td>
                                                            <td >{user.email}</td>
                                                            <td>{user.phone}</td>
                                                            <td>{user.email}</td>
                                                            <td><button className="btn btn-danger btn-sm" onClick={() => setAgencyId(user._id)}  data-bs-toggle="modal" data-bs-target="#deleteAgencyModal"><i className="fa fa-trash"></i></button></td>
                                                        </tr>
                                                    })}

                                                </>

                                            </tbody>
                                        </table>
                                    </div>

                                    :

                                    <>
                                        <div className="container mt-5">
                                            <p className="text-center">No Agency Found</p>
                                        </div>

                                    </>}
                            </>
                        }
                    </div>
                </div>
            </div>


            {/* Add Agency Modal */}
            <div className="modal fade" id="addAgencyModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog border-0 modal-dialog-centered">
                    <div className="modal-content border-0">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Add Agency</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <input type="text" className="form-control" onChange={(event) => setFullName(event.target.value)} placeholder="Full Name" />
                                </div>
                                <div className="mb-3">
                                    <input type="email" className="form-control" onChange={(event) => setEmail(event.target.value)} placeholder="Email Address" />
                                </div>
                                <div className="mb-3">
                                    <input type="text" className="form-control" onChange={(event) => setPhone(event.target.value)} placeholder="Phone Number" />
                                </div>

                                <div className="mb-3">
                                    <input type="password" className="form-control" onChange={(event) => setPassword(event.target.value)} placeholder="Password" />
                                </div>

                            </form>
                        </div>
                        <div className="modal-footer">

                            {isAddLoading ? <button type="button" className="btn btn-secondary btn-sm" disabled>Please wait...</button> :
                                <button type="button" className="btn btn-secondary btn-sm" onClick={() => handleSubmit()}>Submit</button>
                            }

                        </div>
                    </div>
                </div>
            </div>




            {/* Delete Agency Modal */}
            <div className="modal fade" id="deleteAgencyModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog border-0 modal-dialog-centered modal-sm">
                    <div className="modal-content border-0">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Delete Agency</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            Do you want to delete this Agency?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary btn-sm" data-bs-dismiss="modal">Close</button>
                            {isDeleteLoading ? <button type="button" className="btn btn-danger btn-sm" disabled>Deleting...</button> :
                                <button type="button" className="btn btn-danger btn-sm" onClick={() => handleDeleteAgency()}>Yes, Delete</button>
                            }

                        </div>
                    </div>
                </div>
            </div>


        </>
    )
}



// init Agencies component
export default AuthHoc(Agencies)