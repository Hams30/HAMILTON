import { useState, useEffect } from 'react';

// AuthHoc
import AuthHoc from '../../hoc/AuthHoc';

// Loading skeleton
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

// react hot toast
import { Toaster, toast } from 'react-hot-toast';

// badge 
import Badge from 'rsuite/Badge';

// useReports
import useReports from '../../hooks/useReports'

// Link
import Link from 'next/link';

// google map react
import GoogleMapReact from 'google-map-react'
// clusterer
import MarkerClusterer from '@google/markerclusterer'



// Marker component
const MarkerComponent = ({ text }) => <div><div className={`pin bounce`}></div><div className='pulse'></div></div>;






// init Report component
const Reports = () => {

  // invoke useReports
  const { data, isLoading, isError } = useReports()


  console.log(data && data.data)

  // init useEffect
  useEffect(() => {

    // check if error
    if (isError) {
      return toast.error("Oops! something went wrong")
    }

  }, [isError])
  //hamilton
  export default class GoogleMapContainer extends Component {
    componentDidMount () {
      const script = document.createElement('script')
      script.src = 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/markerclusterer.js'
      script.async = true
      document.body.appendChild(script)
    }
  
    setGoogleMapRef (map, maps) {
      this.googleMapRef = map
      this.googleRef = maps
      let locations = [
        {lat: -31.563910, lng: 147.154312},
        {lat: -33.718234, lng: 150.363181},
        {lat: -33.727111, lng: 150.371124}]
      let markers = locations && locations.map((location) => {
        return new this.googleRef.Marker({position: location})
      })
      let markerCluster = new MarkerClusterer(map, markers, {
        imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
        gridSize: 10,
        minimumClusterSize: 2
      })
    }
//////////////// end of Hamilton  


  // init config
  const config = {
    center: {
      lat: 9.0643305,
      lng: 7.4892974
    }
  }






  return (
    <>
      <Toaster />
      <div className="container-fluid pt-3 pb-5 mb-4 px-4">
        <div className="bg-light text-center rounded p-4 border-small mb-3">
          <div className="row g-3 justify-content-between">
            <div className="col-12">
              <div style={{ height: '400px', width: '100%' }}>
                <GoogleMapReact
                  bootstrapURLKeys={{ key: process.env.googleApiKey }}
                  defaultCenter={{ lat: config.center.lat, lng: config.center.lng }}
                  options={{ gestureHandling: "greedy" }}>
                  defaultZoom={5}
                  
                >
                  {data && data.data.docs && [...data.data.docs].length > 0 && [...data.data.docs].map((report, index) => {
                    return <MarkerComponent key={index}
                      lat={report.latitude}
                      lng={report.longitude}
                      text={report.isRead}
                    /> 
                  })}
                  
                </GoogleMapReact>
              </div>
            </div>
          </div>
        </div>


        <div className="bg-light text-center rounded p-4 border-small">
          <div className="row g-3 justify-content-between mb-5">
            <div className="col-auto">
              <h4 className="mb-0 me-3">Reports</h4>

            </div>

            {/* <div className="col">
              <div className="input-group mb-3">
                <input type="text" className="form-control fs-small" placeholder="Search" />
                <span className="input-group-text primary-btn " id="basic-addon2"><i className="fa fa-search"></i></span>
              </div>
            </div>

            <div className="col">
              <select className="form-select fs-small" aria-label="Default select example">
                <option value="">Sort Reports</option>
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>

            </div>


            <div className="col">
              <select className="form-select fs-small" aria-label="Default select example">
                <option value="">Filter by status</option>
                <option value="new">New</option>
                <option value="old">Old</option>
              </select>
            </div> */}


          </div>
          {isLoading ? <>

            <div className="row">
              <div className="col-12">
                <Skeleton height={80} />
              </div>
            </div>

          </> :

            <>
              <div className="table-responsive">
                <table className="table  text-start align-middle table-hover table-borderless mb-0">
                  <thead>
                    <tr className="text-dark">
                      <th scope="col">Name</th>
                      <th scope="col">Contact</th>
                      <th scope="col">State</th>
                      <th scope="col">LGA</th>
                      <th scope="col">Town/Area</th>
                      <th scope="col">Status</th>
                    </tr>
                  </thead>
                  <tbody>

                    {data && data.data.docs && [...data.data.docs].length > 0 ?
                      <>
                        {[...data.data.docs].map((report, index) => {
                          return  <Link key={index} href={`/reports/${report._id}`}><tr className="cursor">
                            {!report.isRead ? <td><Badge>{report.fullName}</Badge></td> : <td>{report.fullName}</td>}
                            <td>{report.phoneNumber}</td>
                            <td>{report.state}</td>
                            <td>{report.lga}</td>
                            <td>{report.town}</td>
                            <td><span className="badge text-white" style={{backgroundColor: `${report.status.colorCode}`}}>{report.status.title}</span></td>
                          </tr></Link>
                        })}

                      </> :


                      <> </>}



                  </tbody>
                </table>
              </div>

            </>
          }
        </div>
      </div>


    </>
  )
}




// init Report component
export default AuthHoc(Reports)