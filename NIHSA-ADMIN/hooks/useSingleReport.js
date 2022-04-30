// swr
import useSWR from "swr"

// axios
import axios from '../config/axios.config'



// init fetcher
const fetcher = url => axios.get(url).then(res => res.data)


// init useSingleReport 
const useSingleReport = (reportId) => {

    // init fetch reports
    const { data, error } = useSWR(reportId ? `${process.env.API_ROOT}/fetch/report/${reportId}` : null, fetcher, { refreshInterval: 2000 })

    // return
    return {
        data: data,
        isLoading: !error && !data,
        isError: error
    }

}




// export
export default useSingleReport