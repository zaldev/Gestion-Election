import { useState } from 'react'
import { useRouter } from 'next/router'
import styles from './Header.module.css'
import Link from 'next/link'
import { useSession, signIn, signOut } from "next-auth/react"
import { seConnecter } from '../../services/userService'




const Header = ({ }) => {
    const { data: session } = useSession()
    const User = {
        firstname: "Saliou",
        lastname: "Diaw",
        admin: true,
        cni: "1234567890",
        url_img: "",
        id_circonscription: "dep_gossas",
        address: "Kheur El Hadj, Gossas",
        date_nais: Date("12/12/1998"),
        lieu_nais: "Gossas",
    }
    const router = useRouter()

    const [logged, setLogged] = useState(true)

    const [userCred,setUserCred] = useState({
        cni:"",
        password:""
    })


    const loginUser = async () => {
        const res = await signIn("credentials", {
          redirect: false,
          cni: userCred.cni,
          password: userCred.password,
          callbackUrl: `${window.location.origin}`,
        })
        console.log(res)
    
        res.error ? console.log(res.error) : console.log(res)
      };
    
    const connecte = () => {
        setLogged(true) 
        loginUser()
        // seConnecter(userCred)
        // console.log(userCred)
    }
    const deconnecte = () => {
        signOut({
            redirect: false,})
        setLogged(false)
        console.log(session.user)
    }

    const handleChange = (e) => {
        const target = e.target
        const value = target.value
        const name = target.name
    
        setUserCred({
          ...userCred,
          [name]: value,
        })
      }

    return (
        <>
            <header className={styles.header}>
                <div className={styles.header_flex}>
                    <div className='border-r-8  rounded-r-full border-r-red-600'>
                        <div className='border-r-8 h-full rounded-r-full border-r-yellow-400'>
                            <div className={styles.header_left}>

                                <img className="w-auto h-40  aspect-square mx-auto" src="/Coat_of_arms_of_Senegal.svg" alt="" />

                            </div>
                        </div>
                        {/* <h1 className="text-center font-['Verdana'] text-white sm:text-2xl md:text-4xl text-lg">Portail pour la gestion des elections</h1> */}
                    </div>
                    <div className={styles.header_right}>
                        {session ?
                            <div className={styles.login}>
                                <Link href="/profil"><a><img src="/account_circle.svg" alt="" /></a></Link>
                                <h3 className={styles.username}>{User.firstname} {User.lastname}</h3>
                                <button type="button" onClick={deconnecte} className={styles.primary_button}>Deconnexion</button>




                            </div>
                            :
                            <form className={styles.login} >
                                <input
                                    type="text"
                                    name="cni"
                                    className={styles.primary_input}
                                    placeholder="CNI"
                                    value={userCred.cni}
                                    onChange={handleChange}
                                />
                                <input
                                    type="password"
                                    name="password"
                                    className={styles.primary_input}
                                    placeholder="Mot de passe"
                                    id=""
                                    value={userCred.password}
                                    onChange={handleChange}
                                />
                                <button type="button" onClick={connecte} className={styles.primary_button}>Connexion</button>
                                <a href="#" className={styles.text_wonder}>Suis-je sur la liste ?</a>
                            </form>
                        }

                    </div>
                </div>
            </header>
        </>
    )
}

export default Header
