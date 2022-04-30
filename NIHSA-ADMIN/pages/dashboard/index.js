import { useState, useEffect } from 'react';

// AuthHoc
import AuthHoc from '../../hoc/AuthHoc';


// useStatistics 
import useStatistics from '../../hooks/useStatistics';


// Loading skeleton
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'


// react hot toast
import { Toaster, toast } from 'react-hot-toast';



// init Dashboard component
const Dashboard = () => {


  // invoke useStatistics
  const { data, isLoading, isError } = useStatistics()

  console.log(data && data)

  // init useEffect
  useEffect(() => {

    // check if error
    if(isError) {
      return toast.error("Oops! something went wrong")
    }

    
  }, [])



  console.log(data)


  return (
    <>



      <div className="container-fluid pt-4 px-4">
        {isLoading ? <>
          <div className="row g-4">
            <div className="col-sm-6 col-xl-3">
              <Skeleton count={1} height={80} />
            </div>
            <div className="col-sm-6 col-xl-3">
              <Skeleton count={1} height={80} />
            </div>
            <div className="col-sm-6 col-xl-3">
              <Skeleton count={1} height={80} />
            </div>
            <div className="col-sm-6 col-xl-3">
              <Skeleton count={1} height={80} />
            </div>
          </div>

        </>



          : <>




            <div className="row g-4">
              <div className="col-sm-6 col-xl-3">
                <div className="bg-light rounded d-flex align-items-center justify-content-between p-4 border-small">
                  <div className="ms-3">
                    <p className="mb-3">Reports</p>
                    <h6 className="mb-0 fs-3">{data && data.data.reportCount}</h6>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-xl-3">
                <div className="bg-light rounded d-flex align-items-center justify-content-between p-4 border-small">

                  <div className="ms-3">
                    <p className="mb-3">Alerts</p>
                    <h6 className="mb-0 fs-3">{data && data.data.alertCount}</h6>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-xl-3">
                <div className="bg-light rounded d-flex align-items-center justify-content-between p-4 border-small">

                  <div className="ms-3">
                    <p className="mb-3">Help Requests</p>
                    <h6 className="mb-0 fs-3">{data && data.data.requestCount}</h6>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-xl-3">
                <div className="bg-light rounded d-flex align-items-center justify-content-between p-4 border-small">

                  <div className="ms-3">
                    <p className="mb-3">News</p>
                    <h6 className="mb-0 fs-3">{data && data.data.newsCount}</h6>
                  </div>
                </div>
              </div>
            </div>

          </>
          
          }
      </div>


    </>
  )
}




// export Dashboard component
export default AuthHoc(Dashboard)
