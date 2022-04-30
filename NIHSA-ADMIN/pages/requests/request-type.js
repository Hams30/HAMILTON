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

// useRequestType
import useRequestType from '../../hooks/useRequestType';

// router
import { useRouter } from 'next/router';




// init request Type
const RequestType = () => {

    // init rotuer
    const router = useRouter()

    // invoke useRequestType 
    const { data, isLoading, isError } = useRequestType()


    // init useEffect
    useEffect(() => {

        if (isError) {
            return toast.error("Oops! an error has occurred")
        }

    }, [])


    console.log("Request Type", data && data)


    // init isCreateLoading 
    const [isCreateLoading, setIsCreateLoading] = useState(false)

    // isDeleteLoading
    const [isDeleteLoading, setIsDeleteLoading] = useState(false)

    // init title
    const [title, setTitle] = useState("")


    // init selectedRequestType 
    const [selectedRequestTypeID, setSelectedRequestTypeID] = useState("")






    // init handleDelete
    const handleDelete = async () => {
        try {

            // get typeId
            const typeId = selectedRequestTypeID

            if (typeId) {

                // update isDeleteLoading
                setIsDeleteLoading(true)

                // delete request type 
                const response = await axios.delete(`${process.env.API_ROOT}/delete/request/type/${typeId}`)

                // check if success
                if (!response.data.success) {
                    setIsDeleteLoading(false)
                    return toast.error(response.data.message)
                }


                // show success
                toast.success("Request type deleted successfully")


                // refresh page 
                return router.reload()

            }

        } catch (error) {
            setIsDeleteLoading(false)
            console.log(error)
            return toast.error("Oops! an error has occurred")
        }
    }





    // init handleSubmit
    const handleSubmit = async () => {
        try {

            // isCreateLoading
            setIsCreateLoading(true)

            // get data
            const requestTypeData = {
                title: title
            }

            // validate
            if (!requestTypeData.title) {
                setIsCreateLoading(false)
                return toast.error("Please enter title")
            }


            // create request title
            const response = await axios.post(`${process.env.API_ROOT}/create/request/type`, requestTypeData)


            // not success
            if (!response.data.success) {
                setIsCreateLoading(false)
                return toast.error(response.data.message)
            }

            // show success
            toast.success("Request type created successfully")


            // reload
            return router.reload()

        } catch (error) {
            setIsCreateLoading(false)
            console.log(error)
            return toast.error("Oops! an error has occurred")
        }
    }






    return (
        <>
            <Toaster />
            <div className="container-fluid pt-3 pb-5 mb-4 px-4">
                <div className="bg-light rounded p-4 border-small mb-3">
                    <div className="row g-3 justify-content-between">
                        <div className="col-auto text-start">
                            <h4 className="mb-0 me-3">Request Type</h4>
                        </div>
                        <div className="col-auto ms-auto">
                            <button className="btn btn-secondary btn-sm" data-bs-toggle="modal" data-bs-target="#createRequestType"><i className="fa fa-plus me-2"></i>Create Request Type</button>
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
                                                    <th scope="col">Title</th>
                                                    <th scope="col">Action</th>

                                                </tr>
                                            </thead>
                                            <tbody>
                                                <>
                                                    {[...data.data].map((type, index) => {
                                                        return <tr key={index} className="cursor">
                                                            <td>{type.title}</td>
                                                            <td><button className="btn btn-danger btn-sm" onClick={() => setSelectedRequestTypeID(type._id)} data-bs-toggle="modal" data-bs-target="#deleteRequestType"><i className="fa fa-trash"></i></button></td>
                                                        </tr>
                                                    })}

                                                </>

                                            </tbody>
                                        </table>
                                    </div>

                                    :

                                    <>
                                        <div className="container mt-5">
                                            <p className="text-center">No Request Type Found</p>
                                        </div>

                                    </>}
                            </>
                        }
                    </div>
                </div>
            </div>




            {/* Create Request Type Modal */}
            <div className="modal fade" id="createRequestType" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog border-0 modal-dialog-centered">
                    <div className="modal-content border-0">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Delete Alert</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <input type="text" className="form-control" placeholder="Title" onChange={(event) => setTitle(event.target.value)} />
                            </form>
                        </div>
                        <div className="modal-footer">

                            {isCreateLoading ? <button type="button" className="btn btn-secondary btn-sm" disabled>Please wait...</button> :
                                <button type="button" className="btn btn-secondary btn-sm" onClick={() => handleSubmit()}>Submit</button>
                            }

                        </div>
                    </div>
                </div>
            </div>


            {/* Delete Request Type */}
            <div className="modal fade" id="deleteRequestType" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog border-0 modal-dialog-centered">
                    <div className="modal-content border-0">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Delete Alert</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            Do you want to delete this request type?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary btn-sm" data-bs-dismiss="modal">Close</button>
                            {isDeleteLoading ? <button type="button" className="btn btn-danger btn-sm" disabled>Please wait...</button> :
                                <button type="button" className="btn btn-danger btn-sm" onClick={() => handleDelete()}>Yes, delete</button>
                            }

                        </div>
                    </div>
                </div>
            </div>



        </>

    )
}




// init request Type
export default AuthHoc(RequestType)