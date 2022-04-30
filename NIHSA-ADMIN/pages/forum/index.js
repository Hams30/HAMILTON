import { useState, useEffect, useRef, useMemo } from 'react';

// AuthHoc
import AuthHoc from '../../hoc/AuthHoc';

// Loading skeleton
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

// react hot toast
import { Toaster, toast } from 'react-hot-toast';

// axios
import axios from '../../config/axios.config'

// router
import { useRouter } from 'next/router';

// useForumMessages
import useForumMessages from '../../hooks/useForumMessages'

// swrConfig
import { useSWRConfig } from 'swr'

// Button
import Button from 'rsuite/Button'

// Modal
import Modal from 'rsuite/Modal'

// date fns
import { format } from 'timeago.js'







// init Forum component
const Forum = ({ authData }) => {

    // init mutate
    const { mutate } = useSWRConfig()

    // init router
    const router = useRouter()

    // invole useStatus
    const { data, isLoading, isError } = useForumMessages()


    console.log("Forum message:", data && data)

    console.log("Forum Auth Data", authData)


    // init useEffect
    useEffect(() => {

        // check if isError
        if (isError) {
            return toast.error("Oops! Failed to get messages")
        }

    }, [])


    // init openDeleteAllModal
    const [openDeleteAllModal, setOpenDeleteAllModal] = useState(false);

    // init openDeleteSingleModal
    const [openDeleteSingleModal, setOpenDeleteSingleModal] = useState(false)



    // init messageText state 
    const [messageText, setMessageText] = useState("")

    // init sendMessageLoading
    const [sendMessageLoading, setSendMessageLoading] = useState(false)

    // init isDeleteAllLoading
    const [isDeleteAllLoading, setIsDeleteAllLoading] = useState(false)

    // init isDeleteSingleLoading
    const [isDeleteSingleLoading, setIsDeleteSingleLoading] = useState(false)

    // init messageId
    const [messageId, setMessageId] = useState("")




    // init handleOpenDeleteSingleModal function
    const handleOpenDeleteSingleModal = (message_id) => {

        // update messageId
        setMessageId(message_id)

        // update openDeleteSingleModal
        setOpenDeleteSingleModal(true)

    }



    // init handleSendMessage
    const handleSendMessage = async () => {
        try {

            // update sendMessageLoading
            setSendMessageLoading(true)

            // init messageData
            const messageData = {
                userId: authData.id,
                userFullName: authData.fullName,
                message: messageText
            }


            // validate
            if (!messageData.message) {
                // update sendMessageLoading
                setSendMessageLoading(false)
                return toast.error("Please write a message")
            }


            if (!messageData.userId) {
                // update sendMessageLoading
                setSendMessageLoading(false)
                return toast.error("Invalid user id. Please try again")
            }


            // make api request to send message
            const response = await axios.post(`${process.env.API_ROOT}/create/forum/message`, messageData)


            // check if not success
            if (!response.data.success) {
                setSendMessageLoading(false)
                return toast.error("Failed to send message")
            }

            // clear message state
            setMessageText("")

            // show success
            toast.success("Delivered")

            // mutate cache
            mutate(`${process.env.API_ROOT}/all/forum/messages`)


            // set loading to false
            return setSendMessageLoading(false)


        } catch (error) {
            setSendMessageLoading(false)
            console.log(error)
            return toast.error("Oops! failed to send message")
        }
    }






    // init handleDeleteAllMessages
    const handleDeleteAllMessages = async () => {
        try {

            // update isDeleteAllMessages
            setIsDeleteAllLoading(true)

            // make api request to delete all messages
            const response = await axios.delete(`${process.env.API_ROOT}/delete/all/forum/messages`)

            // check if success
            if (!response.data.success) {
                setIsDeleteAllLoading(false)
                return toast.error(response.data.message)
            }

            // show success
            toast.success("Messages deleted successfully")

            // revalidate
            mutate(`${process.env.API_ROOT}/all/forum/messages`)

            // update OpenDeleteAllModal
            setOpenDeleteAllModal(false)

            // stop loading
            return setIsDeleteAllLoading(false)

        } catch (error) {
            setIsDeleteAllLoading(false)
            console.log(error)
            return toast.error("Failed to delete all messages")
        }
    }



    // init handleDeleteSingleMessage
    const handleDeleteSingleMessage = async () => {
        try {

            // update IsDeleteSingleLoading
            setIsDeleteSingleLoading(true)


            // get messageId
            const _messageId = messageId

            // check if messageId
            if (!_messageId) {
                setIsDeleteSingleLoading(false)
                return toast.error("Failed to delete message, Id not valid", { style: { maxWidth: 500 } })
            }

            // make api request to delete message
            const response = await axios.delete(`${process.env.API_ROOT}/delete/forum/message/${_messageId}`)


            // check if not success
            if (!response.data.success) {
                setIsDeleteSingleLoading(false)
                return toast.error(response.data.message)
            }


            // show success
            toast.success("Message deleted successfully")

            // revalidate
            mutate(`${process.env.API_ROOT}/all/forum/messages`)

            // update openDeleteSingleModal
            setOpenDeleteSingleModal(false)

            // stop loading
            return setIsDeleteSingleLoading(false)


        } catch (error) {
            setIsDeleteSingleLoading(false)
            console.log(error)
            return toast.error("Failed to delete message")
        }
    }



    return (
        <>
            <Toaster />
            <div className="container-fluid pt-3 pb-5 mb-4 px-4">
                <div className="bg-light rounded p-4 border-small mb-3">
                    <div className="row g-3 justify-content-between">
                        <div className="col-auto text-start">
                            <h4 className="mb-0 me-3">Forum</h4>
                        </div>
                        <div className="col-auto ms-auto">
                            {authData && authData.isAdmin && <button className="btn btn-danger btn-sm" onClick={() => setOpenDeleteAllModal(true)}><i className="fa fa-trash me-2"></i>Delete All Messages</button>}
                        </div>
                    </div>


                    {/* Message Box */}
                    <div className="row mt-4">
                        <div className="col-12">
                            <div className="mb-3">
                                <textarea className="form-control" id="exampleFormControlTextarea1" onChange={(event) => setMessageText(event.target.value)} value={messageText} rows="4" placeholder="Enter message here"></textarea>

                            </div>
                            {sendMessageLoading ? <Button appearance="ghost" disabled loading>Loading...</Button> :
                                <Button appearance="ghost" onClick={() => handleSendMessage()}>Send <i className="fa fa-paper-plane"></i></Button>
                            }

                        </div>
                    </div>

                    {isLoading ? <>
                        <div className="row mt-4">
                            <div className="col-12">
                                <Skeleton height="70px" />
                            </div>
                        </div>

                    </> :




                        <>

                            {/* message display */}
                            <div className="row mt-4">
                                <div className="col-12">
                                    {data && data.data.docs && [...data.data.docs].length > 0 && [...data.data.docs].map((forum, index) => {
                                        return <div key={index} className="d-flex align-items-center border-bottom py-3">
                                            <div className="w-100 ms-3">
                                                <div className="d-flex w-100 justify-content-between mb-2">
                                                    <h6 className="mb-0">{forum.userFullName}</h6>
                                                    <small>{format(new Date(forum.createdAt))}</small>
                                                    {authData && authData.id === forum.userId && <button className="btn btn-sm btn-danger" onClick={() => handleOpenDeleteSingleModal(forum._id)}><i className="fa fa-trash cursor"></i></button>}

                                                </div>
                                                <span>{forum.message}</span>

                                            </div>
                                        </div>
                                    })}
                                </div>

                            </div>


                        </>}


                </div>
            </div>



            {/* Delete All Message Modal */}
            <Modal open={openDeleteAllModal} onClose={() => setOpenDeleteAllModal(false)} size="xs">
                <Modal.Header>
                    <Modal.Title>Delete All Message</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p> Do you want to delete all messages?</p>
                </Modal.Body>
                <Modal.Footer>
                    <button type="button" className="btn btn-secondary btn-sm me-2" data-bs-dismiss="modal">Close</button>
                    {isDeleteAllLoading ? <button type="button" className="btn btn-danger btn-sm" disabled>Deleting...</button> :
                        <button type="button" className="btn btn-danger btn-sm" onClick={() => handleDeleteAllMessages()}>Yes, Delete</button>
                    }
                </Modal.Footer>
            </Modal>



            {/* Delete Single Message Modal */}
            <Modal open={openDeleteSingleModal} onClose={() => setOpenDeleteSingleModal(false)} size="xs">
                <Modal.Header>
                    <Modal.Title>Delete Message</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>  Do you want to delete this messages?</p>
                </Modal.Body>
                <Modal.Footer>
                    <button type="button" className="btn btn-secondary btn-sm me-2" onClick={() => setOpenDeleteSingleModal(false)}>Close</button>
                    {isDeleteSingleLoading ? <button type="button" className="btn btn-danger btn-sm" disabled>Deleting...</button> :
                        <button type="button" className="btn btn-danger btn-sm" onClick={() => handleDeleteSingleMessage()}>Yes, Delete</button>
                    }
                </Modal.Footer>
            </Modal>
        </>
    )
}




// export Forum component
export default AuthHoc(Forum)