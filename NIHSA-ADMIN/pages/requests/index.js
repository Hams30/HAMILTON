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

// use requests
import useRequests from '../../hooks/useRequests';


// Naija States
import NaijaStates from 'naija-state-local-government';

// router
import { useRouter } from 'next/router';

//time ago
import { format } from 'timeago.js'



// google map react
import GoogleMapReact from 'google-map-react'


// Marker component
const MarkerComponent = ({ text }) => <div><img src="https://img.icons8.com/fluency/48/000000/place-marker.png" /></div>;








// init Request component
const Requests = () => {


  // init rotuer
  const router = useRouter()

  // invoke useRequests 
  const { data, isLoading, isError } = useRequests()


  // init useEffect
  useEffect(() => {

    if (isError) {
      return toast.error("Oops! an error has occurred")
    }

  }, [])

  console.log("Requests", data && data)


  // init SelectedRequest
  const [selectedRequest, setSelectedRequest] = useState({})


  // init isDeletingLoading
  const [isDeletingLoading, setIsDeletingLoading] = useState(false)



  // init handleDeleteRequest
  const handleDeleteRequest = async() => {
    try {


      setIsDeletingLoading(true)

      // get selectedrequest
      const _request = {...selectedRequest}

      // get requestId
      const requestId = _request._id


      // delete request
      const response = await axios.delete(`${process.env.API_ROOT}/delete/request/${requestId}`)


      // check if not success
      if(!response.data.success) {
        return toast.error(response.data.message)
      }


      // show success
      toast.success("Help request deleted successfully")



      // reload
      return router.reload()


    }catch(error) {
      setIsDeletingLoading(false)
      console.log(error) 
      return toast.error("Oops! failed to delete request")
    }
  }




  return (

    <>
      <Toaster />
      <div className="container-fluid pt-3 pb-5 mb-4 px-4">
        <div className="bg-light rounded p-4 border-small mb-3">
          <div className="row g-3 justify-content-between">
            <div className="col-auto text-start">
              <h4 className="mb-0 me-3">Help Requests</h4>
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
                          <th scope="col">Phone Number</th>
                          <th scope="col">Title</th>
                          <th scope="col">State</th>
                          <th scope="col">LGA</th>
                          <th scope="col">Created At</th>


                        </tr>
                      </thead>
                      <tbody>
                        <>
                          {[...data.data].map((request, index) => {
                            return <tr key={index} className="cursor" data-bs-toggle="modal" data-bs-target="#viewRequest" onClick={() => setSelectedRequest(request)}>
                              <td>{request.fullName}</td>
                              <td>{request.phoneNumber}</td>
                              <td>{request.title}</td>
                              <td>{request.state}</td>
                              <td>{request.lga}</td>
                              <td>{format(new Date(request.createdAt))}</td>
                            </tr>
                          })}

                        </>

                      </tbody>
                    </table>
                  </div>

                  :

                  <>
                    <div className="container mt-5">
                      <p className="text-center">No Request Found</p>
                    </div>

                  </>}
              </>
            }
          </div>
        </div>
      </div>



      {/* View Request modal */}
      <div className="modal fade" id="viewRequest" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-scrollable border-0">
          <div className="modal-content border-0">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Request Details</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-auto">
                  <h6>{selectedRequest.fullName}</h6>
                </div>
                {/* delete button */}
                <div className="col-auto ms-auto">
                  <button className="btn btn-danger btn-sm" data-bs-toggle="modal" data-bs-target="#deleteRequest"><i className="fa fa-trash"></i></button>
                </div>
              </div>

              {/* Map */}
              <div className="row mt-3">
                <div className="col-12">
                  <div style={{ height: '200px', width: '100%' }}>
                    <GoogleMapReact
                      bootstrapURLKeys={{ key: process.env.googleApiKey }}
                      defaultCenter={{ lat: 9.0643305, lng: 7.4892974 }}
                      defaultZoom={5}

                    >
                      <MarkerComponent
                        lat={selectedRequest.latitude}
                        lng={selectedRequest.longitude}
                        text={selectedRequest.isRead}
                      />


                    </GoogleMapReact>
                  </div>
                </div>
              </div>


              <div className="row">
                <div className="col-12">
                  <div className="table-responsive mt-2">
                    <table className="table  text-start align-middle table-hover table-borderless mb-0">
                      <tbody>
                        <tr>
                          <td className="fw-bold">Full Name</td>
                          <td>{selectedRequest.fullName}</td>
                        </tr>

                        <tr>
                          <td className="fw-bold">Phone Number</td>
                          <td>{selectedRequest.phoneNumber}</td>
                        </tr>

                        <tr>
                          <td className="fw-bold">Title</td>
                          <td>{selectedRequest.title}</td>
                        </tr>

                        <tr>
                          <td className="fw-bold">State</td>
                          <td>{selectedRequest.state}</td>
                        </tr>

                        <tr>
                          <td className="fw-bold">Local Government Area (LGA)</td>
                          <td>{selectedRequest.lga}</td>
                        </tr>

                        <tr>
                          <td className="fw-bold">Town</td>
                          <td>{selectedRequest.town ? selectedRequest.town : "Nil"}</td>
                        </tr>

                        <tr>
                          <td className="fw-bold">Address</td>
                          <td>{selectedRequest.formattedAddress ? selectedRequest.formattedAddress : "Nil"}</td>
                        </tr>

                        <tr>
                          <td className="fw-bold">Latitude</td>
                          <td>{selectedRequest.latitude ? selectedRequest.latitude : "Nil"}</td>
                        </tr>

                        <tr>
                          <td className="fw-bold">Longitude</td>
                          <td>{selectedRequest.longitude ? selectedRequest.longitude : "Nil"}</td>
                        </tr>

                      </tbody>
                    </table>
                  </div>

                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>





      {/* Delete Request Modal */}
      <div className="modal fade" id="deleteRequest" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog border-0 modal-dialog-centered modal-sm">
          <div className="modal-content border-0">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Delete Request</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              Do you want to delete this Request?
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary btn-sm" data-bs-dismiss="modal">Close</button>
              {isDeletingLoading ? <button type="button" className="btn btn-danger btn-sm" disabled>Deleting...</button> :
                <button type="button" className="btn btn-danger btn-sm" onClick={() => handleDeleteRequest()}>Yes, Delete</button>
              }

            </div>
          </div>
        </div>
      </div>

    </>
  )
}






export default AuthHoc(Requests)