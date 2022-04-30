// swr
import useSWR from "swr"

// axios
import axios from '../config/axios.config'



// init fetcher
const fetcher = url => axios.get(url).then(res => res.data)


// init useRequests 
const useRequests = () => {

    // init fetch reports
    const { data, error } = useSWR(`${process.env.API_ROOT}/fetch/requests`, fetcher)


    // return
    return {
        data: data,
        isLoading: !error && !data,
        isError: error
    }

}




// export
export default useRequests