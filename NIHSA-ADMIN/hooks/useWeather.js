// swr
import useSWR from "swr"

// axios
import axios from '../config/axios.config'



// init fetcher
const fetcher = url => axios.get(url).then(res => res.data)


// init useWeather 
const useWeather = (state = "auto:ip") => {

    // init fetch reports
    const { data, error } = useSWR(`https://api.worldweatheronline.com/premium/v1/weather.ashx?key=2b1827c4c3a0490f81824834221402&q=${state}&format=json`, fetcher)


    // return
    return {
        data: data,
        isLoading: !error && !data,
        isError: error
    }

}




// export
export default useWeather