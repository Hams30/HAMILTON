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

// Naija States
import NaijaStates from 'naija-state-local-government';

// router
import { useRouter } from 'next/router';

// Button
import Button from 'rsuite/Button'


// init Weather component
const Weather = () => {

    // init router
    const router = useRouter()

    // init stateList
    const [stateList, setStateList] = useState([])

    // init selectedState
    const [selectedState, setSelectedState] = useState("")

    // init forecastLoading
    const [forecastLoading, setForecastLoading] = useState(false)

    // init foreCastResult
    const [forecastResult, setForecastResult] = useState({})

    // // init showForecast
    const [showForecast, setShowForeCast] = useState(false)




    // init useEffect
    useEffect(() => {

        setStateList(NaijaStates.all())

    }, [])


    // init handleForecase
    const handleForecast = async () => {
        try {

            // update forecastLoading
            setForecastLoading(true)

            // get selectedState
            const selected_state = selectedState


            // validate
            if (!selected_state) {
                setForecastLoading(false)
                return toast.error("Please select a state to proceed")
            }


            // make api request to forecase
            const response = await axios.get(`https://api.weatherapi.com/v1/current.json?key=0233d84416ab4098ba0142642221202&q=${selected_state}`)


            // check if no success
            if (response.status !== 200) {
                setForecastLoading(false)
                return toast.error("Failed to forecast weather")
            }

            // get location
            const resultData = {
                location: response.data.location.name,
                region: response.data.location.region,
                feelsLikeTemp: response.data.current.feelslike_c,
                text: response.data.current.condition.text,
                icon: response.data.current.condition.icon,
                wind: response.data.current.wind_kph,
                humidity: response.data.current.humidity,
                rain: response.data.current.precip_mm
            }


            // update setShowForecase
            setShowForeCast(true)

            // update forecastResult
            setForecastResult(resultData)

            setForecastLoading(false)

        } catch (error) {
            setForecastLoading(false)
            console.log(error)
            return toast.error(error.message)
        }
    }


    return (
        <>
            <Toaster />
            <div className="container-fluid pt-3 pb-5 mb-4 px-4">
                <div className="bg-light rounded p-4 border-small mb-3">
                    <div className="row g-3 justify-content-between">
                        <div className="col-auto text-start">
                            <h4 className="mb-0 me-3">Weather Forecast</h4>
                        </div>

                    </div>

                    <div className="row mt-5">
                        <div className="col-md-6 mx-auto">
                            <select className="form-select" onChange={(event) => setSelectedState(event.target.value)}>
                                <option value="">Select State</option>
                                {stateList && stateList.length > 0 && stateList.map((state, index) => {
                                    return <option key={index} value={state.state}>{state.state}</option>
                                })}
                            </select>

                            <div className="mt-4">
                                {forecastLoading ? <Button appearance="ghost" disabled loading>Loading...</Button> :
                                    <Button appearance="ghost" onClick={() => handleForecast()}>Forecast</Button>
                                }

                            </div>
                        </div>
                    </div>


                </div>


                {showForecast &&
                    <div className="bg-light rounded p-4 border-small mb-3">
                        <div className="row g-3 justify-content-between">

                            <div className="col-12">
                                <h4>{forecastResult.location} Weather Now</h4>
                                <hr />
                            </div>

                        </div>

                        <div className="row g-3 justify-content-between">
                            <div className="col">
                                <img src={forecastResult.icon} />
                                <h6 className="fw-normal ms-3">{forecastResult.text}</h6>
                            </div>


                            <div className="col">
                                <h2>{forecastResult.feelsLikeTemp}</h2>
                                <p>Feels {forecastResult.feelsLikeTemp} c</p>
                            </div>

                            <div className="col">
                                <p>Wind <b>{forecastResult.wind} km/h</b></p>
                                <p>Humidity <b>{forecastResult.humidity}%</b></p>
                                <p>Rain <b>{forecastResult.rain} mm</b></p>
                            </div>

                        </div>
                    </div>
                }
            </div>



        </>

    )
}



// init Weather component
export default AuthHoc(Weather)