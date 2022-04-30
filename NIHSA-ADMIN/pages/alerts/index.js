import { useState, useEffect } from 'react';

// AuthHoc
import AuthHoc from '../../hoc/AuthHoc';

// Loading skeleton
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

// react hot toast
import { Toaster, toast } from 'react-hot-toast';

// useAlerts
import useAlerts from '../../hooks/useAlerts';

// useStatus
import useStatus from '../../hooks/useStatus';

// axios
import axios from '../../config/axios.config'

// Naija States
import NaijaStates from 'naija-state-local-government';

// router
import { useRouter } from 'next/router';

// validator
import { createAlertValidator } from '../../utils/validators';






// init Alerts components
const Alerts = () => {

  // init router
  const router = useRouter()


  // invoke useAlerts
  const { data, isError, isLoading } = useAlerts()

  // invole useStatus
  const { data: statusData, isLoading: statusLoading, isError: statusError } = useStatus("alert")

  console.log("Alert", data && data)
  console.log("Status", statusData)


  // init state list 
  const [stateList, setStateList] = useState([])

  // init lga List
  const [lgaList, setLgaList] = useState([])


  // init useEffect
  useEffect(() => {

    if (isError) {
      return toast.error("Oops! an error has occurred")
    }

    if (statusError) {
      return toast.error("Oops! failed to fetch alert status")
    }

    // update selectedState
    setStateList(NaijaStates.all())

  }, [])



  // init selectedAlert state 
  const [selectedAlert, setSelectedAlert] = useState({})

  // init isDeleting alert
  const [isDeleteAlertLoading, setIsDeleteAlertLoading] = useState(false)

  // init createAlertLoading
  const [createAlertLoading, setCreateAlertLoading] = useState(false)

  // init title state
  const [title, setTitle] = useState("")

  // init description
  const [description, setDescription] = useState("")

  // init selectedState
  const [selectedState, setSelectedState] = useState("")

  // init selectedLga 
  const [selectedLga, setSelectedLga] = useState("")

  // init town
  const [town, setTown] = useState("")

  // init alertStatus
  const [alertStatus, setAlertStatus] = useState("")

  // init showAffected
  const [showAffected, setShowAffected] = useState(true)





  // init handleSelectedState
  const handleSelectState = (selected_state) => {

    if (selected_state) {
      // update selectedState
      setSelectedState(selected_state)

      // get lgas
      const lgas = NaijaStates.lgas(selected_state)

      console.log(lgas)

      // update lgas list
      setLgaList(lgas.lgas)
    } else {

      setLgaList([])

    }

  }




  // init handleDeleteAlert function
  const handleDeleteAlert = async () => {
    try {

      // get alertId
      const alertId = selectedAlert._id

      // check if alertid
      if (alertId) {

        // update isDeleteAlertLoading
        setIsDeleteAlertLoading(true)


        // make axios request to delete alert
        const response = await axios.delete(`${process.env.API_ROOT}/delete/alert/${alertId}`)

        // check if not success
        if (!response.data.success) {
          setIsDeleteAlertLoading(false)
          return toast.error(response.data.message)
        }

        // show success
        toast.success("Alert deleted successfully")

        // reload 
        return router.reload()

      }

    } catch (error) {
      setIsDeleteAlertLoading(false)
      console.log(error)
      return toast.error("Oops! Error failed to delete alert")
    }
  }




  // init handleSubmitAlert
  const handleSubmitAlert = async () => {
    try {

      // update createAlertLoading
      setCreateAlertLoading(true)

      // get alertData
      const alertData = {
        title: title,
        description: description,
        state: selectedState,
        lga: selectedLga,
        town: town,
        status: {
          title: alertStatus ? JSON.parse(alertStatus).title : "",
          colorCode: alertStatus ? JSON.parse(alertStatus).colorCode : ""
        }
      }

      // validate
      const error = createAlertValidator(alertData)

      // check if error
      if (error) {
        setCreateAlertLoading(false)
        return toast.error(error)
      }


      console.log(alertData)


      // make api request to create alert status
      const response = await axios.post(`${process.env.API_ROOT}/create/alert`, alertData)


      // check if not success
      if (!response.data.success) {
        return toast.error(response.data.message)
      }


      // show success
      toast.success("Alert created successfully")


      // reload page 
      return router.reload()


    } catch (error) {
      setCreateAlertLoading(false)
      console.log(error)
      return toast.error("Oops! failed to create alert")
    }
  }




  return (
    <>

      <Toaster />
      <div className="container-fluid pt-3 pb-5 mb-4 px-4">
        <div className="bg-light rounded p-4 border-small mb-3">
          <div className="row g-3 justify-content-between">
            <div className="col-auto text-start">
              <h4 className="mb-0 me-3">Alerts</h4>
            </div>
            <div className="col-auto ms-auto">
              <button className="btn btn-secondary btn-sm" data-bs-toggle="modal" data-bs-target="#createAlertModal"><i className="fa fa-plus me-2"></i>Create Alert</button>
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

                {data && data.data.docs && [...data.data.docs].length > 0 ?
                  <div className="table-responsive mt-5">
                    <table className="table  text-start align-middle table-hover table-borderless mb-0">
                      <thead>
                        <tr className="text-dark">
                          <th scope="col">Title</th>
                          <th scope="col">Description</th>
                          <th scope="col">State</th>
                          <th scope="col">LGA</th>
                          <th scope="col">Town/Area</th>
                          <th scope="col">Responses</th>
                          <th scope="col">Status</th>

                        </tr>
                      </thead>
                      <tbody>


                        <>
                          {[...data.data.docs].map((alert, index) => {
                            return <tr key={index} className="cursor" data-bs-toggle="modal" data-bs-target="#viewAlertModal" onClick={() => setSelectedAlert(alert)}>
                              <td className="text-truncate" style={{ maxWidth: 25 }}>{alert.title}</td>
                              <td className="text-truncate" style={{ maxWidth: 28 }}>{alert.description}</td>
                              <td>{alert.state}</td>
                              <td>{alert.lga}</td>
                              <td>{alert.town}</td>
                              <td>{[...alert.responses].length}</td>
                              <td><span className="badge text-white" style={{ backgroundColor: `${alert.status.colorCode}` }}>{alert.status.title}</span></td>
                            </tr>
                          })}

                        </>

                      </tbody>
                    </table>
                  </div>

                  :

                  <>
                    <div className="container mt-5">
                      <p className="text-center">No Alerts Found</p>
                    </div>

                  </>}
              </>
            }
          </div>
        </div>
      </div>



      {/* View Alert modal */}
      <div className="modal fade" id="viewAlertModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-scrollable border-0">
          <div className="modal-content border-0">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Alert Details</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">

              <div className="row">
                {/* title */}
                <div className="col-auto">
                  <h6>{selectedAlert.title}</h6>
                </div>
                {/* delete button */}
                <div className="col-auto ms-auto">
                  <button className="btn btn-danger btn-sm" data-bs-toggle="modal" data-bs-target="#deleteAlertModal"><i className="fa fa-trash"></i></button>
                </div>

              </div>

              {/* Description */}
              <div className="row mt-4 mb-3">
                <div className="col-12">
                  <p>{selectedAlert.description}</p>
                </div>
              </div>


              {showAffected ? <>

                {/* Affected table */}
                <div className="row mt-4 mb-3">
                  <div className="col-12">
                    <h6>{selectedAlert.responses && [...selectedAlert.responses].filter((resp) => resp.isAffected).length} Affected</h6>
                    <div className="table-responsive mt-2">
                      <table className="table  text-start align-middle table-hover table-borderless mb-0">
                        <thead>
                          <tr className="text-dark">
                            <th scope="col">Full Name</th>
                            <th scope="col">Phone Number</th>
                            <th scope="col">Address</th>
                            <th scope="col">Latitude</th>
                            <th scope="col">Longitude</th>

                          </tr>
                        </thead>
                        <tbody>
                          <>
                            {selectedAlert.responses && [...selectedAlert.responses].filter((resp) => resp.isAffected).map((result, index) => {
                              return <tr key={index} className="cursor">
                                <td>{result.fullName}</td>
                                <td>{result.phoneNumber}</td>
                                <td>{result.formattedAddress}</td>
                                <td>{result.latitude}</td>
                                <td>{result.longitude}</td>
                              </tr>
                            })}

                          </>

                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

              </> :



                <>

                  {/* Not Affected table */}
                  <div className="row mt-4 mb-3">
                    <div className="col-12">
                      <h6>{selectedAlert.responses && [...selectedAlert.responses].filter((resp) => !resp.isAffected).length} Not Affected</h6>
                      <div className="table-responsive mt-2">
                        <table className="table  text-start align-middle table-hover table-borderless mb-0">
                          <thead>
                            <tr className="text-dark">
                              <th scope="col">Full Name</th>
                              <th scope="col">Phone Number</th>
                              <th scope="col">Address</th>
                              <th scope="col">Latitude</th>
                              <th scope="col">Longitude</th>

                            </tr>
                          </thead>
                          <tbody>
                            <>
                              {selectedAlert.responses && [...selectedAlert.responses].filter((resp) => !resp.isAffected).map((result, index) => {
                                return <tr key={index} className="cursor">
                                  <td>{result.fullName}</td>
                                  <td>{result.phoneNumber}</td>
                                  <td>{result.formattedAddress}</td>
                                  <td>{result.latitude}</td>
                                  <td>{result.longitude}</td>
                                </tr>
                              })}

                            </>

                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>



                </>}
            </div>
            <div className="modal-footer">
              {/* Alert response counter */}
              <div className="row me-auto">
                <div className="col-auto">
                  <button type="button" className="btn btn-secondary btn-sm position-relative me-4" onClick={() => setShowAffected(true)}>
                    Affected
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {selectedAlert.responses && [...selectedAlert.responses].filter((resp) => resp.isAffected).length}
                      <span className="visually-hidden">unread messages</span>
                    </span>
                  </button>

                  <button type="button" className="btn btn-secondary btn-sm position-relative" onClick={() => setShowAffected(false)}>
                    Not Affected
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success">
                      {selectedAlert.responses && [...selectedAlert.responses].filter((resp) => !resp.isAffected).length}
                      <span className="visually-hidden">unread messages</span>
                    </span>
                  </button>
                </div>
              </div>

              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>



      {/* Create Alert Modal */}
      <div className="modal fade" id="createAlertModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog border-0 modal-dialog-centered">
          <div className="modal-content border-0">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Create Alert</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">

              <form>
                {/* title */}
                <div className="mb-3">
                  <input type="text" onChange={(event) => setTitle(event.target.value)} className="form-control " placeholder="Title" />
                </div>

                {/* description */}
                <div className="mb-3">
                  <textarea className="form-control" onChange={(event) => setDescription(event.target.value)} placeholder="Description" />
                </div>

                {/* state */}
                <div className="mb-3">
                  <select className="form-select" onChange={(event) => handleSelectState(event.target.value)}>
                    <option value="">Select State</option>
                    {stateList && stateList.length > 0 && stateList.map((state, index) => {
                      return <option key={index} value={`${state.state}`}>{state.state}</option>
                    })}

                  </select>
                </div>

                {/* lga */}
                <div className="mb-3">
                  <select className="form-select" onChange={(event) => setSelectedLga(event.target.value)}>
                    <option value="">Select LGA</option>
                    {lgaList && lgaList.length > 0 && lgaList.map((lga, index) => {
                      return <option key={index} value={lga}>{lga}</option>
                    })}

                  </select>
                </div>

                {/* town */}
                <div className="mb-3">
                  <input type="text" className="form-control" placeholder="Town" onChange={(event) => setTown(event.target.value)} />
                </div>


                {/* Alert status */}
                <div className="mb-3">
                  <select className="form-select " onChange={(event) => setAlertStatus(event.target.value)}>
                    <option value="">Select Alert Status</option>
                    {statusData && statusData.data && [...statusData.data].length > 0 && [...statusData.data].map((status, index) => {
                      return <option key={index} value={JSON.stringify(status)}>{status.title}</option>
                    })}
                  </select>
                </div>
              </form>

            </div>
            <div className="modal-footer">
              {createAlertLoading ? <button type="button" className="btn btn-secondary" disabled>Loading...</button> :
                <button type="button" className="btn btn-secondary" onClick={() => handleSubmitAlert()}>Submit</button>
              }

            </div>
          </div>
        </div>
      </div>



      {/* Delete Alert Modal */}
      <div className="modal fade" id="deleteAlertModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog border-0 modal-dialog-centered modal-sm">
          <div className="modal-content border-0">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Delete Alert</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              Do you want to delete this Alert?
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary btn-sm" data-bs-dismiss="modal">Close</button>
              {isDeleteAlertLoading ? <button type="button" className="btn btn-danger btn-sm" disabled>Deleting...</button> :
                <button type="button" className="btn btn-danger btn-sm" onClick={() => handleDeleteAlert()}>Yes, Delete</button>
              }

            </div>
          </div>
        </div>
      </div>


    </>
  )
}



// init Alerts components
export default AuthHoc(Alerts)