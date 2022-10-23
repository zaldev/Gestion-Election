import type { NextPage } from "next";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";

import styles from '../css/Profil.module.css'
import { CirconscriptionI } from "../models/Circonscription";
import { UserI } from "../models/User";

import { voirCirconscriptions } from "../services/circonscriptionServices";

interface CirconscriptionProps {
    cirs: Array<CirconscriptionI>
}

function Profil(props: CirconscriptionProps) {

    const { data: session, status}=useSession()

    const User:UserI =session?.user
    // {
    //     firstname: "Saliou",
    //     lastname: "Diaw",
    //     admin: true,
    //     cni: "1234567890",
    //     url_img: "",
    //     id_circonscription: "Gossas",
    //     address: "Kheur El Hadj, Gossas",
    //     date_nais: "12/12/1998",
    //     lieu_nais: "Gossas",
    // }

    const { cirs } = props

    // For modal
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

    return (
        <div className={styles.container}>
            {/* <div className="overflow-hidden text-center bg-white rounded shadow-md text-slate-500 shadow-secondary w-72 m-auto">
                <figure className="p-6 pb-0">
                    <span className="relative inline-flex items-center justify-center h-20 text-white rounded-full">
                        <img src="https://picsum.photos/id/237/200/200" alt="user name" title="user name" width="80" height="80" className="max-w-full rounded-full" />
                    </span>
                </figure>
                <div className="p-6">
                    <header className="mb-4">
                        <h3 className="text-xl font-medium text-slate-700">{User.firstname} {User.lastname}</h3>

                    </header>
                    <p className=" text-slate-400">CNI : {User.cni}</p>
                    <p className=" text-slate-400">Adresse : {User.address}</p>
                    <p className=" text-slate-400">Circonscription : {User.id_circonscription}</p>
                </div>

                <div className="flex justify-end gap-2 p-6 pt-0">

                    <button className="inline-flex items-center justify-center flex-1 h-10 w-24 gap-2 px-5 text-sm font-medium tracking-wide transition duration-300 rounded focus-visible:outline-none justify-self-center whitespace-nowrap bg-emerald-50 text-emerald-500 hover:bg-emerald-100 hover:text-emerald-600 focus:bg-emerald-200 focus:text-emerald-700 disabled:cursor-not-allowed disabled:border-emerald-300 disabled:bg-emerald-100 disabled:text-emerald-400 disabled:shadow-none">
                        <span className="order-2">Changer circonscription</span>
                    </button>
                </div>
            </div> */}
            <div className="overflow-hidden bg-white rounded  w-72 m-auto text-slate-500 ">
                <div className="p-6">
                    <header className="flex gap-4">
                        <span className="relative inline-flex items-center justify-center w-12 h-12 text-white rounded-full">
                            <img src={User.url_img} alt="user name" title="user name" width="48" height="48" className="max-w-full rounded-full" />
                        </span>
                        <div>
                            <h3 className="text-xl font-medium text-slate-700">{User.prenom} {User.nom}</h3>
                            <p className="text-sm text-slate-400"> CNI : {User.cni}</p>
                        </div>
                    </header>
                </div>

                <div className="p-6 flex gap-4 flex-col">
                    <p>Date de naissance : <span className="text-secondary text-lg">{User.date_naissance}</span></p>
                    <p>Lieu de naissance : <span className="text-secondary text-lg">{User.lieu_naissance}</span></p>
                    <p>Adresse : <span className="text-secondary text-lg">{User.addresse}</span></p>
                    <p>Circonscription : <span className="text-secondary text-lg">{User.id_circonscription}</span> <button onClick={() => setIsShowing(true)}><img className="inline-block w-6" src="/changes.svg" /></button></p>
                </div>
            </div>
            <>
                {/*   */}

                {isShowing && typeof document !== "undefined"
                    ? ReactDOM.createPortal(
                        <div
                            className="fixed top-0 left-0 z-20 flex h-screen w-screen items-center justify-center bg-slate-300/20 backdrop-blur-sm"
                            aria-labelledby="header-5a content-5a"
                            aria-modal="true"
                            tabindex="-1"
                            role="dialog"
                        >
                            {/*    <!-- Modal --> */}
                            <div
                                ref={wrapperRef}
                                className="flex max-h-[90vh]   max-w-xs flex-col gap-6 overflow-hidden rounded bg-white p-6 text-center text-slate-500 shadow-xl shadow-slate-700/10"
                                id="modal"
                                role="document"
                            >
                                <div className="relative my-6 md:w-60">
                                    <select
                                        id="id-01"
                                        name="id-01"
                                        className="peer relative h-10 w-full appearance-none border-b border-slate-200 bg-white px-4 text-sm text-slate-500 outline-none transition-all autofill:bg-white focus:border-emerald-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                                    >
                                        {cirs.map(c => {
                                            const isCir= c._id===User.id_circonscription

                                            return  <option key={c._id} value={c._id} selected ={isCir}>{c.nom}</option> //<div key={c._id}>{c.nom}</div>
                                           
                                        }
                                        )}
                                        {/* <option value="" disabled selected></option>
                                        <option value="1">Option 1</option>
                                        <option value="2">Option 2</option>
                                        <option value="3">Option 3</option> */}
                                    </select>

                                    <label
                                        htmlFor="id-01"
                                        className="pointer-events-none absolute top-2.5 left-2 z-[1] px-2 text-sm text-slate-400 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-required:after:text-pink-500 peer-required:after:content-['\00a0*'] peer-valid:-top-2 peer-valid:text-xs peer-focus:-top-2 peer-focus:text-xs peer-focus:text-emerald-500 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent"
                                    >
                                        Selectionnez une circonscription
                                    </label>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="pointer-events-none absolute top-2.5 right-2 h-5 w-5 fill-slate-400 transition-all peer-focus:fill-emerald-500 peer-disabled:cursor-not-allowed"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        aria-labelledby="title-01 description-01"
                                        role="graphics-symbol"
                                    >
                                        <title id="title-01">Arrow Icon</title>
                                        <desc id="description-01">Arrow icon of the select list.</desc>
                                        <path
                                            fill-rule="evenodd"
                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                            clip-rule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <button className="text-primary">Ok</button>
                            </div>
                        </div>,
                        document.body
                    )
                    : null}
            </>
        </div>
    )

}

export default Profil;

export async function getServerSideProps() {
    const res = await voirCirconscriptions();
    const cirs: CirconscriptionI[] = res.data.data;

    return { props: { cirs } }
}