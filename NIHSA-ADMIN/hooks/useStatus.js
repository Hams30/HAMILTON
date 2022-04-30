// swr
import useSWR from "swr"

// axios
import axios from '../config/axios.config'



// init fetcher
const fetcher = url => axios.get(url).then(res => res.data)


// init useStatus 
const useStatus = (queryText = "") => {

    // init fetch statistics
    const { data, error } = useSWR(`${process.env.API_ROOT}/all/status?type=${queryText}`, fetcher)


    // return
    return {
        data: data,
        isLoading: !error && !data,
        isError: error
    }

}




// export
export default useStatus