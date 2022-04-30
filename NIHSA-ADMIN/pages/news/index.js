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

// useBlogNews
import useBlogNews from '../../hooks/useBlogNews'

// date fns
import { format } from 'date-fns'

// html to text
import { convert } from 'html-to-text'

// next dynamic
import dynamic from 'next/dynamic';



// init JoditEditor
const JoditEditor = dynamic(() => import('jodit-react'), {
    ssr: false
})


// init BlogNews component
const BlogNews = () => {

    // init router
    const router = useRouter()

    // init editorRef
    const editor = useRef(null);

    // invoke useBlogNews
    const { data, isLoading, isError } = useBlogNews()

    console.log("Blog News", data && data)


    // init useEffect
    useEffect(() => {

        if (isError) {
            return toast.error("Oops! An error has occurred")
        }

    }, [])



    // init isCreateLoading state 
    const [isCreateLoading, setIsCreateLoading] = useState(false)

    // init isUpdateLoading state
    const [isUpdateLoading, setIsUpdateLoading] = useState(false)

    // init isDeleteLoading state
    const [isDeleteLoading, setIsDeleteLoading] = useState(false)

    // init title state 
    const [title, setTitle] = useState("")

    // init body state
    const [body, setBody] = useState("");

    // init updateTitle
    const [updateTitle, setUpdateTitle] = useState("")

    // init updateBody
    const [updateBody, setUpdateBody] = useState("")


    // set config
    const config = {
        readonly: false,
        height: 400
    }

    // init selectedNews
    const [selectedNews, setSelectedNews] = useState({})

    // init selectedNewsId
    const [selectedNewsId, setSelectedNewsId] = useState("")



    // init handleViewNews funnction
    const handleViewNews = (news_data) => {

        // update title state
        setUpdateTitle(news_data.title)

        // update body state 
        setUpdateBody(convert(news_data.body, { wordwrap: 130 }))

        // update selectedNews state 
        setSelectedNews(news_data)
    }








    // init handleSubmit
    const handleSubmit = async () => {
        try {

            // update isCreateLoading
            setIsCreateLoading(true)

            // get newsData
            const newsData = {
                title: title,
                body: body
            }


            // validate
            if (!newsData.title) {
                // update isCreateLoading
                setIsCreateLoading(false)
                return toast.error("Please enter a title")
            }

            if (!newsData.body) {
                // update isCreateLoading
                setIsCreateLoading(false)
                return toast.error("Please write some content in the body", { style: { maxWidth: 500 } })
            }


            // make request to create new
            const response = await axios.post(`${process.env.API_ROOT}/create/news`, newsData)


            // check if not success
            if (!response.data.success) {
                return toast.error(response.data.message)
            }


            // show successs
            toast.success("News created successfully")


            // reload
            return router.reload()

        } catch (error) {
            console.log(error)
            return toast.error("Oops! An error has occurred")
        }
    }






    // init handleUpdateNews function
    const handleUpdateNews = async () => {
        try {
            // update isUpdateLoading
            setIsUpdateLoading(true)

            // get updateNewsData
            const updateNewsData = {
                title: updateTitle,
                body: updateBody
            }

            // get newsId
            const newsId = selectedNews._id

            // check if not newsId
            if (!newsId) {
                return toast.error("News id is not valid")
            }

            // validate
            if (!updateNewsData.title) {
                // update isCreateLoading
                setIsCreateLoading(false)
                return toast.error("Please enter a title")
            }

            if (!updateNewsData.body) {
                // update isCreateLoading
                setIsCreateLoading(false)
                return toast.error("Please write some content in the body", { style: { maxWidth: 500 } })
            }


            // make request to update news
            const response = await axios.put(`${process.env.API_ROOT}/update/news/${newsId}`, updateNewsData)


            // check if not success
            if (!response.data.success) {
                return toast.error(response.data.message)
            }


            // show success
            toast.success(response.data.message)


            // reload
            return router.reload()


        } catch (error) {
            setIsUpdateLoading(false)
            console.log(error)
            return toast.error("Failed to update news")
        }
    }






    // init handleDeleteNews
    const handleDeleteNews = async () => {
        try {

            // update isDeleteLoading
            setIsDeleteLoading(true)

            // get newsid
            const newsId = selectedNewsId

            // check if newsid
            if(!newsId) {
                return toast.error("Invalid news id")
            }


            // make request to delete news
            const response = await axios.delete(`${process.env.API_ROOT}/delete/news/${newsId}`)

            // check if success
            if(!response.data.success) {
                return toast.error(response.data.message)
            }

            // show success
            toast.success("News deleted successfully")


            // reload
            return router.reload()


        } catch (error) {
            setIsDeleteLoading(false)
            console.log(error)
            return toast.error("Failed to delete news")
        }
    }



    return (
        <>
            <Toaster />
            <div className="container-fluid pt-3 pb-5 mb-4 px-4">
                <div className="bg-light rounded p-4 border-small mb-3">
                    <div className="row g-3 justify-content-between">
                        <div className="col-auto text-start">
                            <h4 className="mb-0 me-3">News</h4>
                        </div>
                        <div className="col-auto ms-auto">
                            <button className="btn btn-secondary btn-sm" data-bs-toggle="modal" data-bs-target="#createNewsModal"><i className="fa fa-plus me-2"></i>Create News</button>
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
                                                    <th scope="col">Status</th>
                                                    <th scope="col">Created At</th>
                                                    <th scope="col">Action</th>

                                                </tr>
                                            </thead>
                                            <tbody>
                                                <>
                                                    {[...data.data].map((news, index) => {
                                                        return <tr key={index} className="cursor">
                                                            <td className="text-truncate" data-bs-toggle="modal" data-bs-target="#viewNewsModal" onClick={() => handleViewNews(news)}>{news.title}</td>
                                                            <td className="text-truncate">{news.isPublished ? 'published' : 'pending'}</td>
                                                            <td>{format(new Date(news.createdAt), `yyyy/MM/dd HH:mm aaa`)}</td>
                                                            <td><button className="btn btn-danger btn-sm" onClick={() => setSelectedNewsId(news._id)} data-bs-toggle="modal" data-bs-target="#deleteNewsModal"><i className="fa fa-trash"></i></button></td>
                                                        </tr>
                                                    })}

                                                </>
                                            </tbody>
                                        </table>
                                    </div>

                                    :
                                    <>
                                        <div className="container mt-5">
                                            <p className="text-center">No News Found</p>
                                        </div>

                                    </>}
                            </>
                        }
                    </div>
                </div>
            </div>




            {/* Create News Modal */}
            <div className="modal fade" id="createNewsModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog border-0 modal-dialog-centered modal-dialog-scrollable modal-lg">
                    <div className="modal-content border-0">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Create News</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {/* Form */}
                            <form>
                                {/* title */}
                                <div className="mb-3">
                                    <label htmlFor="title" className="fs-6 fw-bold">Title</label>
                                    <input type="text" className="form-control mt-2" id="title" placeholder="Title" onChange={(event) => setTitle(event.target.value)} />
                                </div>

                                {/* Body */}
                                <div className="mb-3 mt-5">
                                    <label htmlFor="editor" className="fs-6 fw-bold">Body</label>
                                    <div className="mt-2" id="editor">
                                        {useMemo(() => <JoditEditor
                                            ref={editor}
                                            value={body}
                                            config={config}
                                            onBlur={(val) => { setBody(val) }}
                                        />, [])}
                                    </div>

                                </div>

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



            {/* View News Modal */}
            <div className="modal fade" id="viewNewsModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog border-0 modal-dialog-centered modal-dialog-scrollable modal-lg">
                    <div className="modal-content border-0">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Update News</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {/* Form */}
                            <form>
                                {/* title */}
                                <div className="mb-3">
                                    <label htmlFor="updateTitle" className="fs-6 fw-bold">Title</label>
                                    <input type="text" className="form-control mt-2" id="updateTitle" placeholder="Title" value={updateTitle} onChange={(event) => setUpdateTitle(event.target.value)} />
                                </div>

                                {/* Body */}
                                <div className="mb-3 mt-5">
                                    <label htmlFor="updateEditor" className="fs-6 fw-bold">Body</label>
                                    <div className="mt-2" id="updateEditor">
                                        {useMemo(() => <JoditEditor
                                            ref={editor}
                                            value={updateBody}
                                            config={config}
                                            onBlur={(val) => setUpdateBody(val)}
                                        />, [updateBody])}
                                    </div>

                                </div>

                            </form>
                        </div>
                        <div className="modal-footer">

                            {isUpdateLoading ? <button type="button" className="btn btn-secondary btn-sm" disabled>Please wait...</button> :
                                <button type="button" className="btn btn-secondary btn-sm" onClick={() => handleUpdateNews()}>Submit</button>
                            }

                        </div>
                    </div>
                </div>
            </div>



            {/* Delete News Modal */}
            <div className="modal fade" id="deleteNewsModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog border-0 modal-dialog-centered modal-sm">
                    <div className="modal-content border-0">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Delete Alert</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            Do you want to delete this News?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary btn-sm" data-bs-dismiss="modal">Close</button>
                            {isDeleteLoading ? <button type="button" className="btn btn-danger btn-sm" disabled>Deleting...</button> :
                                <button type="button" className="btn btn-danger btn-sm" onClick={() => handleDeleteNews()}>Yes, Delete</button>
                            }

                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}



// export BlogNews component
export default AuthHoc(BlogNews)