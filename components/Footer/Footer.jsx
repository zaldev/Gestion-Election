import Link from 'next/link'
const Footer = ({ }) => {

    return (
        <footer className="footer w-full bg-secondary ">
            <ul className="flex flex-col my-auto items-center text-white">
                <li>Portail Electorale </li>
                <li><Link href="/admin"><a>Administration</a></Link></li>

            </ul>
        </footer>)
}
export default Footer
