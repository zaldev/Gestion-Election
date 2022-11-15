import Link from 'next/link'
import { useSession } from "next-auth/react"
const Footer = ({ }) => {
    const { data: session, status } = useSession()
    const user = session?.user

    return (
        <footer className="footer w-full bg-secondary ">
            <ul className="flex flex-col my-auto items-center text-white">
                <li><Link href="/"><a>Portail Electorale</a></Link> </li>
                {status === "authenticated" ?
                    <>{user?.admin ?
                        < li > <Link href="/admin"><a>Admin</a></Link></li>
                        : null
                    }
                    </>
                    :
                    null
                }


            </ul>
        </footer >)
}
export default Footer
