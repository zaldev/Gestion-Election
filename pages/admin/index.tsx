import { useSession } from 'next-auth/react'
import NavAdmin from '../../components/NavAdmin/NavAdmin'

function DashBoard() {
    const {data:session}=useSession()
    console.log(session)
    return (
        <>
        <div className='h-[100vh]'>
            ok ffffffffffffff
        </div>
        </>
    )
}

export default DashBoard