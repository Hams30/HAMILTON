import { useState, useEffect } from 'react';

// AuthHoc
import AuthHoc from '../../hoc/AuthHoc';

// Loading skeleton
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

// react hot toast
import { Toaster, toast } from 'react-hot-toast';

// useReports
import useSingleReport from '../../hooks/useSingleReport'

// useStatus
import useStatus from '../../hooks/useStatus';

// Link
import Link from 'next/link';

// axios
import axios from '../../config/axios.config';

// useRouter
import { useRouter } from 'next/router';

// Toggle
import Toggle from 'rsuite/Toggle'

// Button
import Button from 'rsuite/Button'


// timeago
import { format } from 'timeago.js'

// Swr config
import { useSWRConfig } from 'swr'







// init Report Detail Component
const ReportDetail = ({ authData }) => {

    // init mutate
    const { mutate } = useSWRConfig()

    // init router
    const router = useRouter()

    // get reportId
    const reportId = router.query.id

    // invoke useSingleReport
    const { data, isError, isLoading } = useSingleReport(reportId)

    console.log(data && data.data)

    // invoke useStatus 
    const { data: reportStatusList, isError: reportStatusError, isLoading: reportStatusLoading } = useStatus("report")

    console.log("Report Status List", reportStatusList)

    // init fileUrl
    const [fileUrl, setFileUrl] = useState("")

    // init fileExt
    const [fileExt, setFileExt] = useState("")

    // init reportData
    const [reportData, setReportData] = useState({})

    // init statusList
    const [statusList, setStatusList] = useState([])

    // init reportForum
    const [reportForum, setReportForum] = useState([])

    // init checked
    const [liveFeedCheck, setLiveFeedCheck] = useState(false);

    // init liveFeedLoading  
    const [liveFeedLoading, setLiveFeedLoading] = useState(false);

    // init isReadCheck
    const [isReadCheck, setIsReadCheck] = useState(false)

    // init isReadLoading
    const [isReadLoading, setIsReadLoading] = useState(false)

    // int statusLogs
    const [statusLogs, setStatusLogs] = useState([])


    // init useEffect
    useEffect(() => {

        // check if isErro
        if (isError) {
            return toast.error("Oops! An error has occurred")
        }

        // check if isReportStatusError
        if (reportStatusError) {
            return toast.error("Oops! Failed to get report status list")
        }

        // init _reportData
        const _reportData = data && data.data

        // get statusList
        const _statusList = reportStatusList && reportStatusList.data

        if (_reportData) {

            // update reportData state
            setReportData(_reportData)

            // update liveFeedCheck
            setLiveFeedCheck(_reportData.showLive)

            // update isReadCheck
            setIsReadCheck(_reportData.isRead)

            // update reportForum
            setReportForum(_reportData.forum)

            // update statusLogs
            setStatusLogs(reportData.statusLog)

            // get fileUrl
            const fileUrl = `${data && data.data ? data.data.fileUrl : ""}`

            // check if fileUrl
            if (fileUrl) {

                // check if fileUrl is an image
                const _fileExt = fileUrl.split('.').pop()

                // update fileExt
                setFileExt(_fileExt)

                // update fileUrl
                setFileUrl(fileUrl)

            }
        }


        // check if reportStatusList
        if (_statusList) {
            // update statusList
            setStatusList(_statusList)
        }


    }, [data, reportStatusList, statusLogs])




    // init isDeleting state 
    const [isDeleting, setIsDeleting] = useState(false)

    // init commentMessage
    const [commentMessage, setCommentMessage] = useState("")

    // init sendMessageBtnLoading state 
    const [sendMessageBtnLoading, setSendMessageBtnLoading] = useState(false)

    // init delAllMsgBtnLoading
    const [delAllMsgBtnLoading, setDelAllMsgBtnLoading] = useState(false)




    // init markReportAsLive function
    const markReportAsLive = async () => {
        try {

            // update liveFeedLoading state 
            setLiveFeedLoading(true)

            // api request to mark report as live
            const response = await axios.get(`${process.env.API_ROOT}/mark/live/report/${reportData && reportData._id}`)

            // check if success
            if (!response.data.success) {
                return toast.error("Failed to mark as live report")
            }

            // update liveChecked
            setLiveFeedCheck(true)

            // update liveFeedLoading
            setLiveFeedLoading(false)



        } catch (error) {
            console.log(error)
            // update liveFeedLoading
            setLiveFeedLoading(false)
            return toast.error("Oops! an error has occurred")
        }
    }




    // init markReportAsRead function
    const markReportAsRead = async () => {
        try {


            // update isReadLoading state 
            setIsReadLoading(true)

            // api request to mark report as live
            const response = await axios.get(`${process.env.API_ROOT}/mark/read/report/${reportData && reportData._id}`)

            // check if success
            if (!response.data.success) {
                return toast.error("Failed to mark report as seen")
            }

            // update isReadCheck
            setIsReadCheck(true)

            // update isReadLoading
            setIsReadLoading(false)


        } catch (error) {
            // update isReadLoading state 
            setIsReadLoading(false)
            console.log(error)
            return toast.error("Oops! an error has occurred")
        }
    }




    // init handleDeleteReport function
    const handleDeleteReport = async () => {
        try {

            // update isDeleting state
            setIsDeleting(true)

            // get reportData
            const _reportData = { ...reportData }

            // get reportId
            const reportId = _reportData._id

            // check if reportId
            if (!reportId) {
                // update isDeleting state
                setIsDeleting(false)
                return toast.error("Invalid report id")
            }


            // make request to delete report 
            const response = await axios.delete(`${process.env.API_ROOT}/delete/report/${reportId}`)


            // check if not success
            if (!response.data.success) {
                setIsDeleting(false)
                return toast.error("Oops! failed to delete report", { style: { maxWidth: 500 } })
            }


            // show success 
            toast.success("Report deleted successfully")

            // push user to report page 
            return window.location.replace('/reports')

        } catch (error) {
            // update isDeleting state
            setIsDeleting(false)
            console.log(error)
            return toast.error("Oops! an error has occurred")
        }
    }






    // init handleUpdateStatus function
    const handleUpdateStatus = async (report_status) => {
        try {

            // check if report_status
            if (report_status) {

                // init  _reportStatus
                const reportStatus = JSON.parse(report_status)

                // init statusData
                const statusData = {
                    userId: authData.id,
                    userFullName: authData.fullName,
                    title: reportStatus.title,
                    colorCode: reportStatus.colorCode
                }

                // show loading toast
                toast.loading("Please wait")

                // make axios request to update report status
                const response = await axios.put(`${process.env.API_ROOT}/update/status/report/${reportData._id}`, statusData)


                // check if not success
                if (!response.data.success) {
                    toast.dismiss()
                    return toast.error("Failed to update report status")
                }

                toast.dismiss()

                // show success
                toast.success("Report status updated successfully", { style: { maxWidth: 500 } })

                // reload
                return router.reload()

            }

        } catch (error) {
            toast.dismiss()
            console.log(error)
            return toast.error("Oops Error! Failed to update report status")
        }
    }






    // send comment/forum message for this report
    const handleSendCommentMessage = async () => {
        try {

            // update sendMessageBtnLoading
            setSendMessageBtnLoading(true)

            // check if commentMessage
            if (!commentMessage) {
                // update sendMessageBtnLoading
                setSendMessageBtnLoading(false)
                return toast.error("Please write a message")
            }


            // init  messageData
            const messageData = {
                userId: authData.id,
                userFullName: authData.fullName,
                message: commentMessage
            }


            console.log(messageData)

            // make request to send comment message 
            const response = await axios.post(`${process.env.API_ROOT}/create/forum/report/${reportData._id}`, messageData)


            // check if success
            if (!response.data.success) {
                setSendMessageBtnLoading(false)
                return toast.error("Oops! failed to send comment message", { style: { maxWidth: 500 } })
            }


            // show success
            toast.success("Message sent successfully")

            // disable sendMessageBtnLoading
            setSendMessageBtnLoading(false)

            // clear commemtMessage 
            setCommentMessage("")

            // reload
            return mutate(`${process.env.API_ROOT}/fetch/report/${reportData._id}`)


        } catch (error) {
            // update sendMessageBtnLoading state
            setSendMessageBtnLoading(false)
            console.log(error)
            return toast.error("Oops! an error has occurred")
        }
    }





    // Delete all forum/comment messages
    const handleDeleteAllMessages = async () => {
        try {
            // update DelAllMsgBtnLoading
            setDelAllMsgBtnLoading(true)

            // copy reportData
            const _reportData = { ...reportData }

            // get reportId
            const reportId = _reportData._id


            // make api request to delete all report message
            const response = await axios.delete(`${process.env.API_ROOT}/delete/report/forum/${reportId}`)

            // check if success
            if (!response.data.success) {
                setDelAllMsgBtnLoading(false)
                return toast.error("Oops! failed to delete all messages")
            }


            // show success
            toast.success("Messages deleted successfully")

            // reload
            return router.reload()


        } catch (error) {
            // update DelAllMsgBtnLoading state
            setDelAllMsgBtnLoading(false)
            console.log(error)
            return toast.error("Oops! an error has occurred")
        }
    }


    return (
        <>
            <Toaster />
            <div className="container-fluid pt-4 px-4">
                <div className="bg-light rounded p-4 border-small mb-3 border-main">
                    {isLoading ? <>

                        <div className="row">
                            <div className="col-12 col-md-12">
                                <Skeleton height="50px" />
                            </div>
                        </div>
                    </> :

                        <>

                            <div className="row">
                                <div className="col-12 col-md-6">
                                    {/* Reporter full name */}
                                    <h5 className="text-truncate">{reportData && reportData.fullName}</h5>

                                    {/* Report status */}
                                    <span className="badge text-white mt-2" style={{ backgroundColor: `${reportData && reportData.status && reportData.status.colorCode}` }}>{reportData && reportData.status && reportData.status.title}</span>
                                </div>

                                <div className="col-12 col-md-6 text-end">
                                    {/* Delete button */}
                                    {authData && authData.isAdmin && <button className="btn btn-outline-danger btn-sm me-3" data-bs-toggle="modal" data-bs-target="#deleteModal">Delete</button>}


                                    {/* View media button */}
                                    {fileUrl && <a href={`${fileUrl}`} target="_blank" className="btn btn-outline-secondary btn-sm me-3">View Media</a>}

                                    {/* Mark as live toggle */}
                                    {authData && authData.isAdmin &&
                                        <span>
                                            {liveFeedCheck ? <Toggle size="lg" className="me-2" checkedChildren="Live" checked={liveFeedCheck} onChange={markReportAsLive} readOnly /> :
                                                <Toggle size="lg" className="me-2" checkedChildren="Live" unCheckedChildren="Not Live" loading={liveFeedLoading} checked={liveFeedCheck} onChange={markReportAsLive} />
                                            }
                                        </span>
                                    }
                                    {/* Mark as read or seen toggle */}
                                    {isReadCheck ? <Toggle size="lg" checkedChildren="Seen" checked={isReadCheck} onChange={markReportAsRead} readOnly /> :
                                        <Toggle size="lg" checkedChildren="Read" unCheckedChildren="Unread" loading={isReadLoading} checked={isReadCheck} onChange={markReportAsRead} />
                                    }
                                </div>
                            </div>

                        </>
                    }
                </div>

                <div className="bg-light text-center rounded p-4 border-small border-main">
                    <div className="row g-3 justify-content-between mb-2">
                    </div>

                    {isLoading ? <>

                        <div className="row g-3 justify-content-between mb-5">
                            <div className="col-12 col-md-4">
                                <Skeleton height="100%" />
                            </div>

                            <div className="col-12 col-md-8">
                                <Skeleton count={5} />
                            </div>
                        </div>

                        <div className="row g-3 justify-content-between mb-5">
                            <div className="col-12 col-md-12">
                                <Skeleton count={7} />
                            </div>
                        </div>

                    </> :

                        <>
                            <div className="row">
                                <div className="col-12 col-md-8">
                                    {/* User Data */}
                                    <div className="table-responsive pt-4">
                                        <table className="table text-start table-hover table-borderless mb-0">
                                            <tbody>
                                                <tr className="cursor">
                                                    <td className="text-secondary">Full Name:</td>
                                                    <td className="text-dark">{reportData && reportData.fullName}</td>
                                                </tr>

                                                <tr className="cursor ">
                                                    <td className="text-secondary">Phone Number:</td>
                                                    <td className="text-dark">{reportData && `+${reportData.phoneNumber}`}</td>
                                                </tr>

                                                <tr className="cursor ">
                                                    <td className="text-secondary">State:</td>
                                                    <td className="text-dark">{reportData && reportData.state}</td>
                                                </tr>

                                                <tr className="cursor">
                                                    <td className="text-secondary">LGA:</td>
                                                    <td className="text-dark">{reportData && reportData.lga}</td>
                                                </tr>

                                                <tr className="cursor">
                                                    <td className="text-secondary">Town:</td>
                                                    <td className="text-dark">{reportData && reportData.town}</td>
                                                </tr>

                                                <tr className="cursor">
                                                    <td className="text-secondary">Location of flooded area:</td>
                                                    <td className="text-dark">{reportData && reportData.formattedAddress}</td>
                                                </tr>
                                            </tbody>

                                        </table>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    {/* Update status select  */}
                                    <div className="mb-4">
                                        <select className="form-select fs-small" onChange={(event) => handleUpdateStatus(event.target.value)} aria-label="Default select example">
                                            <option value="">Update Report Status</option>
                                            {statusList && statusList.length > 0 && statusList.map((status, index) => {
                                                return <option key={index} value={JSON.stringify(status)}>{status.title}</option>
                                            })}
                                        </select>
                                    </div>

                                    {/* Status logs */}
                                    <div className="bg-light">
                                        <h5 className="text-start mb-2">Status Logs</h5>
                                        <div className="status-logs">
                                            {statusLogs && statusLogs.map((status, index) => {
                                                return <div key={index} className="d-flex border-bottom py-2">
                                                    <div className="w-100 ms-3">
                                                        <div className="d-flex w-100 justify-content-between">
                                                            <h6 className="mb-0 fs-smallest">{status.userFullName}</h6>
                                                        </div>
                                                        <p className="text-start fs-small">updated status to <span className="badge text-white" style={{ backgroundColor: `${status.colorCode}` }}>{status.title}</span></p>
                                                    </div>
                                                </div>
                                            })}

                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Reporters story */}
                            <div className="row mt-4">
                                <div className="col-12 text-start px-3">
                                    <h5 className="fs-5 fw-bold">Story</h5>
                                    <p className="mt-3">{reportData && reportData.reportMessage}</p>

                                </div>
                            </div>

                        </>}


                </div>


                {/* COMMENT/FORUM MESSAGE */}
                <div className="bg-light rounded p-4 border-small mb-5 border-main mt-3">
                    <div className="row">
                        <div className="col-12 col-md-12 mb-4">
                            <div className="mb-3">
                                <textarea className="form-control" onChange={(event) => setCommentMessage(event.target.value)} value={commentMessage} rows="4" placeholder="Message"></textarea>
                            </div>
                            {sendMessageBtnLoading ? <Button appearance="ghost" disabled loading>Send Message</Button> :
                                <Button appearance="ghost" onClick={() => handleSendCommentMessage()} >Send Message</Button>
                            }

                        </div>
                        <div className="col-12 col-md-12">
                            {reportForum && reportForum.length > 0 && <div className="mb-3 text-end">
                                {authData && authData.isAdmin &&
                                    <button className="btn btn-outline-danger btn-sm" data-bs-toggle="modal" data-bs-target="#deleteAllMessagesModal">Delete all messages</button>
                                }
                            </div>
                            }



                            {reportForum.length > 0 && reportForum.map((forum, index) => {
                                return <div key={index} className="d-flex align-items-center border-bottom py-3">
                                    <div className="w-100 ms-3">
                                        <div className="d-flex w-100 justify-content-between">
                                            <h6 className="mb-0">{forum.userFullName}</h6>
                                            <small>{format(new Date(forum.createdAt))}</small>
                                            {/* {authData && authData.id === forum.userId && <button className="btn btn-sm btn-danger"><i className="fa fa-trash cursor"></i></button>} */}

                                        </div>
                                        <span>{forum.message}</span>

                                    </div>
                                </div>
                            })}

                        </div>
                    </div>
                </div>

            </div>


            {/* Delete Modal */}
            <div className="modal fade" id="deleteModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered border-0">
                    <div className="modal-content border-0">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Delete Report</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            Do you want to delete this report ?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            {isDeleting ? <button type="button" className="btn btn-danger" disabled>Deleting...</button> :
                                <button type="button" className="btn btn-danger" onClick={() => handleDeleteReport()}>Yes, Delete</button>
                            }

                        </div>
                    </div>
                </div>
            </div>



            {/* Delete All Messages */}
            <div className="modal fade" id="deleteAllMessagesModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered border-0">
                    <div className="modal-content border-0">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Delete All Messages</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            Do you want to delete all messages ?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            {delAllMsgBtnLoading ? <button type="button" className="btn btn-danger" disabled>Deleting...</button> :
                                <button type="button" className="btn btn-danger" onClick={() => handleDeleteAllMessages()}>Yes, Delete</button>
                            }

                        </div>
                    </div>
                </div>
            </div>



        </>
    )
}




export default AuthHoc(ReportDetail)