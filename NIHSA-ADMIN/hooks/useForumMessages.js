// swr
import useSWR from "swr"

// axios
import axios from '../config/axios.config'



// init fetcher
const fetcher = url => axios.get(url).then(res => res.data)


// init useForumMessages 
const useForumMessages = () => {

    // init fetch reports
    const { data, error } = useSWR(`${process.env.API_ROOT}/all/forum/messages`, fetcher, { refreshInterval: 2000, refreshWhenHidden: true, refreshWhenOffline: true })


    // return
    return {
        data: data,
        isLoading: !error && !data,
        isError: error
    }

}




// export
export default useForumMessages