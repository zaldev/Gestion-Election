import '../css/style.css'
import '../css/home.css'
import type { AppProps } from "next/app";
import DefaultLayout from '../components/layouts/DefaultLayout'
import AdminLayout from '../components/layouts/AdminLayout'
import { SessionProvider, useSession } from "next-auth/react";
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import { useRouter } from 'next/router'

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const router = useRouter()
  const pat = router.pathname
  if (pat.includes('/404')) {
    return (<Component {...pageProps} />)
  }
  if (pat.includes('/admin'))
    return (
      <SessionProvider session={session}>
        <AdminLayout>
          <Component {...pageProps} />
        </AdminLayout>
      </SessionProvider>
    )
  return (

    // <SessionProvider session={session}>
    // <div>
    //   <Header />
    //   <Component {...pageProps} />
    //   <Footer />
    // </div>
    <SessionProvider session={session}>
      <DefaultLayout>
        <Component {...pageProps} />
      </DefaultLayout>
    </SessionProvider>

    // </SessionProvider>
  );
}

export default MyApp;
