// swr
import useSWR from "swr"

// axios
import axios from '../config/axios.config'



// init fetcher
const fetcher = url => axios.get(url).then(res => res.data)


// init useBlogNews 
const useBlogNews = () => {

    // init fetch reports
    const { data, error } = useSWR(`${process.env.API_ROOT}/fetch/all/news`, fetcher)


    // return
    return {
        data: data,
        isLoading: !error && !data,
        isError: error
    }

}




// export
export default useBlogNews