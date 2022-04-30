
import 'rsuite/dist/rsuite.min.css';
// Head
import Head from 'next/head'

// Script
import Script from 'next/script'

// Navbar
import Navbar from '../components/Navbar'

// Sidebar
import Sidebar from '../components/Sidebar'

// router
import { useRouter } from 'next/router'





// init MyApp component
function MyApp({ Component, pageProps }) {

  // init router
  const router = useRouter()






  return (
    <>
      <Head>
        <meta charset="utf-8" />
        <title>NIHSA ADMIN</title>
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <meta content="" name="keywords" />
        <meta content="" name="description" />

        {/* Font awesome */}
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.0/css/all.min.css" rel="stylesheet" />

        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous" />

        <link href="/css/style.css" rel="stylesheet" />
      </Head>


      <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous" strategy="beforeInteractive" />

      <Script src="/js/main.js" strategy="beforeInteractive" />


      <div className="position-relative bg-white d-flex p-0">

        {router.pathname === '/' ?

          <>

            <Component {...pageProps} />


          </> :


          <>

            <Sidebar />
            <div className="content">
              <Navbar />
              <Component {...pageProps} />
            </div>


          </>}
      </div>



    </>
  )
}

export default MyApp
