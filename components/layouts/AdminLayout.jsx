import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import NavAdmin from '../NavAdmin/NavAdmin'



export default function AdminLayout({ children }) {
  return (
    <>
      <NavAdmin />
      <main className='ml-16 mt-4'>{children}</main>
      {/* <Footer /> */}
    </>
  )
}
