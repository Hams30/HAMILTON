import { useState, useEffect } from 'react';

// AuthHoc
import AuthHoc from '../../hoc/AuthHoc';


// useStatus 
import useStatus from '../../hooks/useStatus';

// Loading skeleton
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'


// react hot toast
import { Toaster, toast } from 'react-hot-toast';


// axios
import axios from '../../config/axios.config'

// router
import { useRouter } from 'next/router';






// init Status components
const Status = () => {

    // init router
    const router = useRouter()

    // invoke useStatus
    const { data, isLoading, isError } = useStatus()


    console.log(data && data)


    // init useEffect
    useEffect(() => {

        if (isError) {
            return toast.error("Oops! An error has occurred")
        }

    }, [])



    // init isAddBtnLoading
    const [isAddBtnLoading, setIsAddBtnLoading] = useState(false)

    // init isDeleteBtnLoading 
    const [isDeleteBtnLoading, setIsDeleteBtnLoading] = useState(false)

    // init title state 
    const [title, setTitle] = useState("")

    // init colorCode state
    const [colorCode, setColorCode] = useState("")

    // init statusType
    const [statusType, setStatusType] = useState("")

    // init statusId
    const [statusId, setStatusId] = useState("")




    // init handleCreateStatus function
    const handleCreateStatus = async () => {
        try {

            // update isAddBtnLoading
            setIsAddBtnLoading(true)

            // get statusData
            const statusData = {
                title: title,
                colorCode: colorCode,
                statusType: statusType
            }


            // validate 
            if (!statusData.title) {
                // update isAddBtnLoading
                setIsAddBtnLoading(false)

                return toast.error("Please enter a title")
            }

            if (!statusData.statusType) {
                // update isAddBtnLoading
                setIsAddBtnLoading(false)
                return toast.error("Please select a status type")
            }

            if (!statusData.colorCode) {
                // update isAddBtnLoading
                setIsAddBtnLoading(false)
                return toast.error("Please select a color code")
            }


            // make request to create status
            const response = await axios.post(`${process.env.API_ROOT}/create/status`, statusData)

            // if not success
            if (!response.data.success) {
                // update isAddBtnLoading
                setIsAddBtnLoading(false)
                return toast.error("Oops! failed to create status")
            }


            // show success
            toast.success("Status created successfully")


            // refresh page 
            return router.reload()


        } catch (error) {
            // update isAddBtnLoading
            setIsAddBtnLoading(false)
            console.log(error)
            return toast.error("Oops! failed to create status")
        }
    }





    // init handleDeleteStatus function
    const handleDeleteStatus = async () => {
        try {

            // update isDeleteBtnLoading
            setIsDeleteBtnLoading(true)


            // get Status Id
            const _statusId = statusId

            // check if _status id
            if (!_statusId) {
                // update isDeleteBtnLoading
                setIsDeleteBtnLoading(false)
                return toast.error("Status id not valid, please try again", { style: { maxWidth: 500 } })
            }

            // make request to delete status
            const response = await axios.delete(`${process.env.API_ROOT}/delete/status/${_statusId}`)

            // check if not success
            if (!response.data.success) {
                // update isDeleteBtnLoading
                setIsDeleteBtnLoading(false)
                return toast.error("Oops! failed to delete status")
            }


            // show success
            toast.success("Status deleted successfully")

            // refresh page 
            return router.reload()

        } catch (error) {
            // update isDeleteBtnLoading
            setIsDeleteBtnLoading(false)
            console.log(error)
            return toast.error("Oops! failed to delete status")
        }
    }



    return (
        <>
            <Toaster />
            <div className="container-fluid pt-3 pb-5 mb-4 px-4">
                <div className="bg-light rounded p-4 border-small mb-3">
                    <div className="row">
                        <div className="col-6">
                            <h4 className="mb-0 me-3">Status</h4>
                        </div>
                        <div className="col-6 text-end">
                            <button className="btn btn-secondary btn-sm" data-bs-toggle="modal" data-bs-target="#addStatus"><i className="fa fa-plus me-2"></i>Add Status</button>
                        </div>
                    </div>

                    {isLoading ? <>
                        <div className="row mt-5">
                            <div className="col-12">
                                <Skeleton height="80px" />
                            </div>
                        </div>


                    </> :



                        <>
                            <div className="row mt-5">
                                <div className="col-12">

                                    <div className="table-responsive">
                                        <table className="table  text-start align-middle table-hover table-borderless mb-0">
                                            <thead>
                                                <tr className="text-dark">
                                                    <th scope="col">Title</th>
                                                    <th scope="col">Color Code</th>
                                                    <th scope="col">Status Type</th>
                                                    <th scope="col">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>

                                                {data && data.data && [...data.data].length > 0 &&
                                                    <>
                                                        {[...data.data].map((status, index) => {
                                                            return <tr key={index}>
                                                                <td>{status.title}</td>
                                                                <td><i className="fa fa-circle me-2" style={{ color: `${status.colorCode}` }}></i>{`${status.colorCode}`.toUpperCase()}</td>
                                                                <td>{status.statusType}</td>
                                                                <td><button className="btn btn-sm btn-danger" onClick={() => setStatusId(status._id)} data-bs-toggle="modal" data-bs-target="#deleteStatus"><i className="fa fa-trash cursor"></i></button></td>
                                                            </tr>
                                                        })}

                                                    </>}
                                            </tbody>
                                        </table>
                                    </div>

                                </div>
                            </div>

                        </>}

                </div>




                {/* Add Status Modal*/}
                <div className="modal fade" id="addStatus" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered border-0">
                        <div className="modal-content border-0">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Create Status</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">

                                <form>
                                    {/* title */}
                                    <div className="mb-3">
                                        <input type="text" className="form-control" placeholder="Title" onChange={(event) => setTitle(event.target.value)} />
                                    </div>

                                    {/* Status type*/}
                                    <div className="mb-3">
                                        <select className="form-select" onChange={(event) => setStatusType(event.target.value)} aria-label="Default select example">
                                            <option value="">Select Status Type</option>
                                            <option value="report">Report</option>
                                            <option value="alert">Alert</option>

                                        </select>
                                    </div>

                                    {/* Status color */}
                                    <div className="mb-3">
                                        <label htmlFor="exampleColorInput" className="fs-small fw-bold">Select Status Color</label>
                                        <input type="color" className="form-control form-control-color mt-2" id="exampleColorInput" value={colorCode} onChange={(event) => setColorCode(event.target.value)} title="Select Status Color" />

                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                {isAddBtnLoading ? <button type="button" className="btn btn-secondary" disabled>Please wait...</button> :
                                    <button type="button" className="btn btn-secondary" onClick={() => handleCreateStatus()}>Submit</button>
                                }

                            </div>
                        </div>
                    </div>
                </div>



                {/* Delete Status Modal */}
                <div className="modal fade" id="deleteStatus" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered border-0">
                        <div className="modal-content border-0">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Delete Status</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <p>Do you want to delete this status ?</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                {isDeleteBtnLoading ? <button type="button" className="btn btn-danger" disabled>Deleting...</button> :
                                    <button type="button" className="btn btn-danger" onClick={() => handleDeleteStatus()}>Yes, Delete</button>
                                }

                            </div>
                        </div>
                    </div>
                </div>



            </div>


        </>
    )
}




// export status component
export default AuthHoc(Status)