import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { ElectionI } from "../../../models/Election";
import { updateElection, voirElections } from "../../../services/electionService";
import { GiReturnArrow, GiConfirmed } from "react-icons/gi"
import ReactDOM from "react-dom";
import { useSession } from "next-auth/react";
import { updateUser, voirUser } from "../../../services/userService";
import unstable_getServerSession from "next-auth/next"
import { authOptions } from "../../api/auth/[...nextauth]";

import { reloadSession } from "../../../helpers/sessionHelper"


interface VoterProps {
  elects: Array<ElectionI>,
}

function Voter(props: VoterProps) {
  const router = useRouter()

  const { annee } = router.query
  const elections: ElectionI[] = props.elects
  const [elect, setElect] = useState(elections.filter(elect => (elect.annee === annee))[0])

  const { data: session } = useSession()
  const [user, setUser] = useState<UserI>(session?.user)

  useEffect(() => {
    if (session != null) voirUser(session?.user._id).then((d) => {
      setUser(d.data.data)
    })

  }, [session])



  const [avoter, setAvoter] = useState(user?.elections_vote.includes(elect._id))

  useEffect(() => {

    if (user != null && elect.electeurs.includes(user._id)) router.push('/')

  }, [user])
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
          modal.querySelectorAll(focusableElements)[0] // get first element to be focused inside modal

        const focusableContent = modal.querySelectorAll(focusableElements)

        const lastFocusableElement =
          focusableContent[focusableContent.length - 1] // get last element to be focused inside modal

        document.addEventListener("keydown", function (e) {
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


  const [st, setSt] = useState({})
  const [casel, setCasel] = useState(null)

  const selectedCandidat = (e: React.ChangeEvent<HTMLElement>, ca: any) => {

    setSt({ background: ca.color ?? "" })
    setCasel(ca)

    e.currentTarget.classList.add('elect-sel')
  }

  const jeVote = () => {

    const dep_votes = { dep_id: user.id_circonscription, votants: 1 }

    if (casel.votes.length > 0) {
      const v_dep = casel.votes.find(v => v.dep_id === user.id_circonscription)
      if (v_dep != null) {
        v_dep.votants++
      } else casel.votes.push(dep_votes)
    } else casel.votes.push(dep_votes)

    elect.electeurs.push(user._id)

    setElect(elect)


    updateElection(elect._id, elect).then(
      () => {
        user.elections_vote.push(elect._id)
        setAvoter(true)
        updateUser(user._id, user).then(() => {
          setIsShowing(false)
          reloadSession()
          router.push("/")
        })

      }
    )
  }

  return (
    <>
      <h1 className="home-banier text-center text-secondary text-2xl  align-baseline my-8">
        <span className="t-left"></span>{casel ? "Vous pouvez voter en confirmant"
          : "Selectionnez votre candidat"}<span
            className="t-right"
          ></span> </h1>

      {/* {elections.map((elect, i) => {

                return (elect.annee === annee) ? <> */}
      <div style={st} className="flex flex-row my-6 w-full justify-evenly mb-6 py-4">

        {elect.candidats.map((can) => {

          return <>
            {(casel == null || (casel && casel === can)) ? <div className="overflow-hidden w-64 bg-white rounded shadow-md text-slate-500 aspect-square shadow-slate-200">
              {/*  <!-- Image --> */}
              <figure onClick={(e) => selectedCandidat(e, can)} className="relative h-full hover:p-1 p-2 cursor-pointer" style={{ background: can.color }}>
                <img
                  src={can.url_image}
                  alt="card image"
                  className="object-cover h-full "
                />
                <figcaption className="absolute bottom-0 left-0 w-full p-6 text-white bg-gradient-to-t from-slate-900">

                  <h3 className="text-lg font-medium ">{can.nom_candidat}</h3>
                  <p className="text-sm opacity-75"> {can.partie}</p>
                </figcaption>
              </figure>
            </div> : null}
          </>
        })}



      </div>
      {casel ? <>
        <div className="flex flex-row justify-center gap-16 mb-10">
          <span className="cursor-pointer text-secondary" title="Retourner" onClick={() => { setCasel(null); setSt({ background: "" }) }}><GiReturnArrow size={56} /></span>
          <span className="cursor-pointer " onClick={() => setIsShowing(true)} title="Confirmer" style={{ color: casel.color }}><GiConfirmed size={56} /></span>
        </div>
      </> : null}
      {/* </> : null
            })
            } */}

      {isShowing && typeof document !== "undefined"
        ? ReactDOM.createPortal(
          <div
            className="fixed top-0 left-0 z-20 flex items-center justify-center w-screen h-screen bg-slate-300/20 backdrop-blur-sm"
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
              {/*        <!-- Modal header --> */}
              {!avoter ?
                <>
                  <header
                    id="header-5a"
                    className="flex flex-col items-center gap-4"
                  >
                    <GiConfirmed size={72} style={{ color: casel.color }} />

                    <h3 className="flex-1 text-xl font-medium text-slate-700">
                      Sure de voter {casel?.nom_candidat}?
                    </h3>
                  </header>
                  <div id="content-5a" className="flex-1 overflow-auto">
                    <p>Apres avoir confirmer vous ne pouvez plus revenir en arriere</p>
                  </div>
                  <div className="flex justify-start gap-2">
                    <button onClick={() => jeVote()} className="inline-flex items-center justify-center flex-1 h-10 gap-2 px-5 text-sm font-medium tracking-wide text-white transition duration-300 rounded whitespace-nowrap bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 focus-visible:outline-none disabled:cursor-not-allowed disabled:border-blue-300 disabled:bg-blue-300 disabled:shadow-none">
                      <span>Je suis sure</span>
                    </button>
                    <button onClick={() => setIsShowing(false)} className="inline-flex items-center justify-center flex-1 h-10 gap-2 px-5 text-sm font-medium tracking-wide transition duration-300 rounded justify-self-center whitespace-nowrap text-blue-500 hover:bg-blue-100 hover:text-blue-600 focus:bg-blue-200 focus:text-blue-700 focus-visible:outline-none disabled:cursor-not-allowed disabled:text-blue-300 disabled:shadow-none disabled:hover:bg-transparent">
                      <span>Annuler</span>
                    </button>
                  </div></> :
                <>
                  <header
                    id="header-5a"
                    className="flex flex-col items-center gap-4"
                  >
                    <GiConfirmed size={72} style={{ color: casel.color }} />

                    <h3 className="flex-1 text-xl font-medium text-slate-700">
                      Vote avec succes !!!
                    </h3>
                  </header>
                  <div id="content-5a" className="flex-1 overflow-auto">
                    <p>Vous avez voter {casel?.nom_candidat}</p>
                  </div>
                </>
              }
            </div>
          </div>,
          document.body
        )
        : null}

    </>
  )

}

export default Voter;

export async function getServerSideProps(context) {
  const { req, res } = context

  // const session = await unstable_getServerSession(
  //   req,
  //   res,
  //   authOptions
  // );

  // console.log(session)

  const { annee } = context.query;
  const res1 = await voirElections()

  const elects: ElectionI[] = res1.data.data

  const elect = elects.filter(elect => (elect.annee.toString() === annee))[0]

  if (elect == null) {
    return {
      notFound: true,
    }
  } else if (elect.etat !== 1) {
    if (elect.etat === 2) {
      return {
        redirect: {
          permanent: false,
          destination: "/elections/" + elect.annee.toString()
        }
      }
    }
    return {
      redirect: {
        permanent: false,
        destination: "/"
      }
    }
  }





  return { props: { elects } }
}