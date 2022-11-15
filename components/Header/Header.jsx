import { useRouter } from 'next/router'
import styles from './Header.module.css'
import Link from 'next/link'
import { useSession, signIn, signOut } from "next-auth/react"
import { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { verifCNI } from '../../services/userService';
import { GiConfirmed } from "react-icons/gi"
import { BsInfoCircle, BsInfoSquareFill } from "react-icons/bs"
import { CgCloseO } from "react-icons/cg"
import { HiInformationCircle } from "react-icons/hi"


const Header = ({ }) => {
    const { data: session } = useSession()
    const User = session?.user
    const router = useRouter()
    const [invalideCred, setInvalideCred] = useState(false)

    const [cni, setCni] = useState('')
    const [cniResult, setCniResult] = useState(0)

    const [logged, setLogged] = useState(true)

    const [userCred, setUserCred] = useState({
        cni: "",
        password: ""
    })


    const loginUser = async () => {
        const res = await signIn("credentials", {
            redirect: false,
            cni: userCred.cni,
            password: userCred.password,
            callbackUrl: `${window.location.origin}`,
        })

        if (res.error != null) {
            setInvalideCred(true)
        } else {
            setLogged(true)
            setUserCred({
                cni: "",
                password: ""
            })
        }


        res.error ? console.log(res.error) : console.log(res)
    };

    const connecte = () => {
        loginUser()
    }
    const deconnecte = () => {
        signOut({
            redirect: false,
        }).then(() => {
            setLogged(false)
            router.push('/')
        })

    }

    const handleChange = (e) => {
        const target = e.target
        const value = target.value
        const name = target.name

        setInvalideCred(false)

        setUserCred({
            ...userCred,
            [name]: value,
        })
    }

    const [isShowing, setIsShowing] = useState(false)

    const wrapperRef = useRef(null)

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsShowing(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [wrapperRef])

    useEffect(() => {
        let html = document.querySelector("html")

        if (html) {
            if (isShowing && html) {
                html.style.overflowY = "hidden"

                const focusableElements =
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

                const modal = document.querySelector("#modal") // select the modal by it's id

                const firstFocusableElement =
                    modal?.querySelectorAll(focusableElements)[0] // get first element to be focused inside modal

                const focusableContent = modal?.querySelectorAll(focusableElements)

                const lastFocusableElement = focusableContent ? [focusableContent.length - 1] // get last element to be focused inside modal

                    : document.addEventListener("keydown", function (e) {
                        if (e.keyCode === 27) {
                            setIsShowing(false)
                        }

                        let isTabPressed = e.key === "Tab" || e.keyCode === 9

                        if (!isTabPressed) {
                            return
                        }

                        if (e.shiftKey) {
                            // if shift key pressed for shift + tab combination
                            if (document.activeElement === firstFocusableElement) {
                                lastFocusableElement.focus() // add focus for the last focusable element
                                e.preventDefault()
                            }
                        } else {
                            // if tab key is pressed
                            if (document.activeElement === lastFocusableElement) {
                                // if focused has reached to last focusable element then focus first focusable element after pressing tab
                                firstFocusableElement.focus() // add focus for the first focusable element
                                e.preventDefault()
                            }
                        }
                    })

                firstFocusableElement.focus()
            } else {
                html.style.overflowY = "visible"
            }
        }
    }, [isShowing])

    useEffect(() => {
        setCniResult(0)
        setCni("")
    }, [isShowing])

    const handleChangeCNI = (e) => {

        setCniResult(0)
        setCni(e.target.value)
    }

    const handleCNIVerif = () => {
        verifCNI(cni).then((val) => {
            if (val) setCniResult(1)
            else setCniResult(2)
        })
    }
    return (
        <>
            <header className={styles.header}>
                <div className={styles.header_flex}>
                    <div className='border-r-8  rounded-r-full border-r-red-600'>
                        <div className='border-r-8 h-full rounded-r-full border-r-yellow-400'>
                            <div className={styles.header_left}>
                                <Link href="/">
                                    <a className='mx-4'>
                                        <img className="w-auto h-40  aspect-square mx-auto" src="/Coat_of_arms_of_Senegal.svg" alt="" />
                                    </a>
                                </Link>



                            </div>
                        </div>
                        {/* <h1 className="text-center font-['Verdana'] text-white sm:text-2xl md:text-4xl text-lg">Portail pour la gestion des elections</h1> */}
                    </div>
                    <div className={styles.header_right}>
                        {session ?
                            <div className={styles.login}>
                                <Link href="/profil"><a><img src="/account_circle.svg" alt="" /></a></Link>
                                <h3 className={styles.username}>{User.prenom} {User.nom}</h3>
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
                                {invalideCred

                                    ?
                                    <span
                                        className="relative cursor-pointer group hover:overflow-visible focus-visible:outline-none"
                                        aria-describedby="tooltip-02"
                                    >

                                        <HiInformationCircle size={24} className='text-red-500' />



                                        <span
                                            role="tooltip"
                                            id="tooltip-02"
                                            className="invisible absolute top-full left-1/2 z-40 mt-2 w-44 -translate-x-1/2 rounded bg-slate-700 p-4 text-sm text-red-400 opacity-0 transition-all before:invisible before:absolute before:left-1/2 before:bottom-full before:z-40 before:mt-2 before:-ml-2 before:border-x-8 before:border-b-8 before:border-x-transparent before:border-b-slate-700 before:opacity-0 before:transition-all before:content-[''] group-hover:visible group-hover:block group-hover:opacity-100 group-hover:before:visible group-hover:before:opacity-100"
                                        >
                                            Identifiants incorrectes
                                        </span>
                                    </span>
                                    : null}

                                {/* <BsInfoSquareFill size={24} className='text-red-500' /> */}
                                <button type="button" onClick={connecte} className={styles.primary_button} disabled={userCred.cni !== 13 && userCred.password.length < 7}>Connexion</button>
                                <a onClick={() => setIsShowing(true)} className={styles.text_wonder}>Suis-je sur la liste ?</a>
                            </form>
                        }

                    </div>
                </div>
            </header>
            {isShowing && typeof document !== "undefined"
                ? ReactDOM.createPortal(
                    <div
                        className="fixed top-0 left-0 z-20 flex h-screen w-screen items-center justify-center bg-slate-300/20 backdrop-blur-sm"
                        aria-labelledby="header-5a content-5a"
                        aria-modal="true"
                        tabindex="-1"
                        role="dialog"
                    >
                        <div
                            ref={wrapperRef}
                            className="flex max-h-[90vh]   max-w-xs flex-col gap-6 overflow-hidden rounded bg-white p-6 text-center text-slate-500 shadow-xl shadow-slate-700/10"
                            id="modal"
                            role="document"
                        >
                            <h2 className='text-base text-secondary'>Veuillez indiquer votre CNI !</h2>
                            <div className="relative my-1">
                                <input
                                    type="text" placeholder="" name="cni" value={cni}
                                    onChange={(e) => handleChangeCNI(e)}
                                    required
                                    className="peer relative h-10 w-full border-b border-slate-200 px-4 text-sm text-slate-500 placeholder-transparent outline-none transition-all autofill:bg-white  focus:border-emerald-500 focus:outline-none  disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                                />
                                <label
                                    htmlFor="id-b08"
                                    className="absolute left-2 -top-2 z-[1] px-2 text-xs text-slate-400 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm  peer-required:after:content-['\00a0*']  peer-focus:-top-2 peer-focus:text-xs peer-focus:text-emerald-500  peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent"
                                >
                                    CNI
                                </label>
                            </div>
                            <span className='c
                            m-auto text-center'>{cniResult !== 0
                                    ? <>{cniResult === 1
                                        ? <GiConfirmed size={34} className='text-green-500' />
                                        : <CgCloseO size={32} className='text-red-500' />
                                    }</>
                                    : <BsInfoCircle size={32} />}</span>
                            <button className="text-secondary disabled:text-blue-300 bg-green-200 m-auto px-4 py-2 rounded-md" disabled={cni === ""} onClick={handleCNIVerif}>Verifier</button>
                        </div>
                    </div>,
                    document.body
                )
                : null}
        </>
    )
}

export default Header
