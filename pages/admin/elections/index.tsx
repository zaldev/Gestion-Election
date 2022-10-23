import { useState, useRef, useEffect, ChangeEvent } from "react"
import ReactDOM from "react-dom"
import { FcPicture } from "react-icons/fc"
import { ElectionI } from "../../../models/Election"
import circonscriptions from "../circonscriptions"
import { BsPlusSquare } from "react-icons/bs"
import { HiMinusCircle, HiPlusCircle } from "react-icons/hi"
import { ajouterElection } from "../../../services/electionService"
// {
//     annee: "2020",
//     etat: 0,
// candidats: [{
//     user_id: "1111",
//     partie: "Partie",
//     url_image: "url",
//     votes: [{
//         dep_id: "dep_gossas",
//         votants: 0
//     }]
// }]

// }


function Elections() {
  const [file, setFile] = useState(["", ""])
  const [pictures, setPictures] = useState<File[]>([])//useRef<[]>([null,null]);
  const [encours, setEncours] = useState(false)


  const [election, setElection] = useState<ElectionI>(
    {
      annee: "2020",
      etat: 0,
      candidats: [
        {
          nom_candidat: "",
          partie: "",
          url_image: "",
          color: "",
          votes: []
        },
        {
          nom_candidat: "",
          partie: "",
          url_image: "",
          color: "",
          votes: []
        }
      ]
    }
  )

  const initialiser = () => {
    setPictures([])
    setFile(["", ""])
    setEncours(false)
    setIsShowing(false)
    setElection((
      {
        annee: "2020",
        etat: 0,
        candidats: [
          {
            nom_candidat: "",
            partie: "",
            url_image: "",
            color: "",
            votes: []
          },
          {
            nom_candidat: "",
            partie: "",
            url_image: "",
            color: "",
            votes: []
          }
        ]
      }
    ))


  }

  let annees = []

  for (let c = 2000; c < 2030; c++) {
    annees.push(c)

  }

  const [isShowing, setIsShowing] = useState(false)

  const wrapperRef = useRef(null)


  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsShowing(false)
        // setElection({
        //   annee: "2020",
        //   etat: 0,
        //   candidats: []

        // })
        // setFile("")
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
          'button, [href], input,h1, select, textarea,[tabindex]:not([tabindex="-1"])'

        const modal = document.querySelector("#modal") // select the modal by it's id

        const firstFocusableElement =
          modal?.querySelectorAll(focusableElements)[0] // get first element to be focused inside modal

        const focusableContent = modal?.querySelectorAll(focusableElements)

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
        setElection(election)
      } else {
        html.style.overflowY = "visible"
      }
    }
  }, [isShowing])

  // ///////////////////////////////////////////
  const [tabSelected, setTabSelected] = useState({
    currentTab: 1,
    noTabs: 2,
  })

  const wrapperRef2 = useRef(null)

  const handleKeyDown = e => {
    if (e.keyCode === 39) {
      if (wrapperRef2.current && wrapperRef2.current.contains(e.target)) {
        if (
          tabSelected.currentTab >= 1 &&
          tabSelected.currentTab < tabSelected.noTabs
        ) {
          setTabSelected({
            ...tabSelected,
            currentTab: tabSelected.currentTab + 1,
          })
        } else {
          setTabSelected({
            ...tabSelected,
            currentTab: 1,
          })
        }
      }
    }

    if (e.keyCode === 37) {
      if (wrapperRef2.current && wrapperRef2.current.contains(e.target)) {
        if (
          tabSelected.currentTab > 1 &&
          tabSelected.currentTab <= tabSelected.noTabs
        ) {
          setTabSelected({
            ...tabSelected,
            currentTab: tabSelected.currentTab - 1,
          })
        } else {
          setTabSelected({
            ...tabSelected,
            currentTab: tabSelected.noTabs,
          })
        }
      }
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  })
  /////////////////////////////////////////////


  const ajoute = () => {
    setEncours(true)
    // console.log(pictures)

    const pics = Array.from(pictures)
    // console.log(pictures[0]);

    Object.values(pictures).map(async (pic, i) => {


      const formData = new FormData();
      console.log(pic)


      // Object.values(pic).forEach(fil => {

      formData.append('file', pic);
      // })

      /* Send request to our api route */
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      // console.log("ok ////////////");

      const body = await response.json() as { status: 'ok' | 'fail', message: string, url_img: string };

      console.log(body);
      if (body.status === 'ok') {
        election.candidats[i].url_image = body.url_img
        console.log(election)
        // setElection({
        //   ...election,

        // })
      }
    })

    setTimeout(() => {
      ajouterElection(election)
      setEncours(false)
      initialiser()

    }, 500);

  }
  const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const target = e.target
    const value = target.value
    const name = target.name

    setElection({
      ...election,
      [name]: value,
    })
  }
  const handleChange2 = (e: React.ChangeEvent<HTMLInputElement>, i: number) => {
    const target = e.target
    const value = target.value
    const name = target.name
    election.candidats[i] = { ...election.candidats[i], [name]: value }


    setElection({
      ...election,
    })
  }

  const onChangePicture = (e: React.ChangeEvent<HTMLInputElement>, i: number) => {
    file[i] = URL.createObjectURL(e.target.files[0])

    setFile({ ...file })
    pictures[i] = e?.target?.files[0]
    setPictures({ ...pictures });
  }

  const addCandidat = () => {
    election.candidats.push({
      nom_candidat: "",
      partie: "",
      url_image: "",
      color: "",
      votes: []
    })
    file.push("")

    setElection({ ...election })
  }
  const delCandidat = () => {
    election.candidats.pop()
    file.pop()

    setElection({ ...election })
  }


  return (
    <>
      <div className="h-full  flex flex-col mx-2 p-2  ">
        <div className="flex flex-row justify-between p-2 ">
          <h1 className="text-secondary text-2xl">Gestion des elections</h1>
          <span title="Nouvel election" className="text-2xl h-fit text-secondary hover:text-white hover:bg-secondary p-1 rounded-md hover:cursor-pointer" onClick={(e) => setIsShowing(true)}><BsPlusSquare /></span>
        </div>

        {/*<!-- Component: Basic lg sized tab full width --> */}
        <section className="max-w-full" aria-multiselectable="false">
          <ul
            className="flex items-center border-b border-slate-200"
            role="tablist"
            ref={wrapperRef2}
          >
            <li className="flex-1" role="presentation ">
              <button
                className={`-mb-px inline-flex h-12 w-full items-center justify-center gap-2 whitespace-nowrap rounded-t border-b-2 px-6 text-sm font-medium tracking-wide transition duration-300 hover:bg-blue-50 hover:stroke-blue-600 focus:bg-blue-50 focus-visible:outline-none disabled:cursor-not-allowed ${tabSelected.currentTab === 1
                  ? "border-blue-500 stroke-blue-500 text-blue-500 hover:border-blue-600  hover:text-blue-600 focus:border-blue-700 focus:stroke-blue-700 focus:text-blue-700 disabled:border-slate-500"
                  : "justify-self-center border-transparent stroke-slate-700 text-slate-700 hover:border-blue-500 hover:text-blue-500 focus:border-blue-600 focus:stroke-blue-600 focus:text-blue-600 disabled:text-slate-500"
                  }`}
                id="tab-label-1a"
                role="tab"
                aria-setsize="3"
                aria-posinset="1"
                tabindex={`${tabSelected.currentTab === 1 ? "0" : "-1"}`}
                aria-controls="tab-panel-1a"
                aria-selected={`${tabSelected.currentTab === 1 ? "true" : "false"
                  }`}
                onClick={() => setTabSelected({ ...tabSelected, currentTab: 1 })}
              >
                <span>Tab 1</span>
              </button>
            </li>
            <li className="flex-1" role="presentation ">
              <button
                className={`-mb-px inline-flex h-12 w-full items-center justify-center gap-2 whitespace-nowrap rounded-t border-b-2 px-6 text-sm font-medium tracking-wide transition duration-300 hover:bg-blue-50 hover:stroke-blue-600 focus:bg-blue-50 focus-visible:outline-none disabled:cursor-not-allowed ${tabSelected.currentTab === 2
                  ? "border-blue-500 stroke-blue-500 text-blue-500 hover:border-blue-600  hover:text-blue-600 focus:border-blue-700 focus:stroke-blue-700 focus:text-blue-700 disabled:border-slate-500"
                  : "justify-self-center border-transparent stroke-slate-700 text-slate-700 hover:border-blue-500 hover:text-blue-500 focus:border-blue-600 focus:stroke-blue-600 focus:text-blue-600 disabled:text-slate-500"
                  }`}
                id="tab-label-2a"
                role="tab"
                aria-setsize="3"
                aria-posinset="2"
                tabindex={`${tabSelected.currentTab === 2 ? "0" : "-1"}`}
                aria-controls="tab-panel-2a"
                aria-selected={`${tabSelected.currentTab === 2 ? "true" : "false"
                  }`}
                onClick={() => setTabSelected({ ...tabSelected, currentTab: 2 })}
              >
                <span>Tab 2</span>
              </button>
            </li>

          </ul>
          <div className="">
            <div
              className={`px-6 py-4 ${tabSelected.currentTab === 1 ? "" : "hidden"
                }`}
              id="tab-panel-1a"
              aria-hidden={`${tabSelected.currentTab === 1 ? "true" : "false"}`}
              role="tabpanel"
              aria-labelledby="tab-label-1a"
              tabindex="-1"
            >
              <p>
                What is the recipe for successful achievement? To my mind there
                are just four essential ingredients: Choose a career you love,
                give it the best there is in you, seize your opportunities, and be
                a member of the team.
              </p>
            </div>
            <div
              className={`px-6 py-4 ${tabSelected.currentTab === 2 ? "" : "hidden"
                }`}
              id="tab-panel-2a"
              aria-hidden={`${tabSelected.currentTab === 2 ? "true" : "false"}`}
              role="tabpanel"
              aria-labelledby="tab-label-2a"
              tabindex="-1"
            >
              <p>
                One must be entirely sensitive to the structure of the material
                that one is handling. One must yield to it in tiny details of
                execution, perhaps the handling of the surface or grain, and one
                must master it as a whole.
              </p>
            </div>

          </div>
        </section>
        {/*<!-- End Basic lg sized tab full width --> */}



      </div>
      {isShowing && typeof document !== "undefined"
        ? ReactDOM.createPortal(
          <div
            className="fixed top-0 left-0  z-50 flex items-center justify-center w-screen h-screen bg-slate-300/20 backdrop-blur-sm"
            aria-labelledby="header-2a content-2a"
            aria-modal="true"
            tabindex="-1"
            role="dialog"
          >
            <div
              className="flex h-[90vh] sm:flex-row w-8/12 max-w-xl justify-center flex-col gap-6 overflow-y-auto rounded bg-white p-2 text-slate-500 shadow-xl shadow-slate-700/10"
              // className="flex-wrap m-0  p-2 flex flex-row justify-start w-10/12 max-w-[1200px] "

              ref={wrapperRef}
              id="modal"
              role="document">

              <div className="m-auto ">

                {/* <div className="relative my-4">
                                    <input
                                        type="text" placeholder="" name="annee" value={election.annee} onChange={handleChange}

                                        required
                                        className="peer relative h-10 w-full border-b border-slate-200 px-4 text-sm text-slate-500 placeholder-transparent outline-none transition-all autofill:bg-white   focus:border-emerald-500 focus:outline-none  disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                                    />
                                    <label
                                        htmlFor="id-b08"
                                        className="absolute left-2 -top-2 z-[1] px-2 text-xs text-slate-400 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm  peer-required:after:content-['\00a0*']  peer-focus:-top-2 peer-focus:text-xs peer-focus:text-emerald-500  peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent"
                                    >
                                        Annee
                                    </label>
                                </div> */}
                <div className="relative my-6 md:w-60">
                  <select
                    id="id-01"
                    name="annee"
                    className="peer relative h-10 w-full appearance-none border-b border-slate-200 bg-white px-4 text-sm text-slate-500 outline-none transition-all autofill:bg-white focus:border-emerald-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                    onChange={(event) => handleSelect(event)}
                  >
                    <option value="" disabled > </option>
                    {annees.map(c => {

                      return <option key={c} value={c} selected={c === 2020}>{c}</option>

                    })

                    }
                  </select>

                  <label
                    htmlFor="id-01"
                    className="pointer-events-none absolute top-2.5 left-2 z-[1] px-2 text-sm text-slate-400 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-required:after:text-pink-500 peer-required:after:content-['\00a0*'] peer-valid:-top-2 peer-valid:text-xs peer-focus:-top-2 peer-focus:text-xs peer-focus:text-emerald-500 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent"
                  >
                    Selectionnez une annee
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
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h2 className="my-6 font-semibold text-xl text-secondary text-center ">Candidats Electorales</h2>
                {
                  election.candidats.map((can, i) => {

                    return <>
                      {/* <div  >ok{can.partie}</div> */}
                      <hr className="border-1 border-primary" />
                      <div id={i === 0 ? "div__v" : ""} key={i} className="relative ml-4 my-4 flex items-center space-x-6">
                        <div className="shrink-0">
                          {/* <MdAccountCircle size={72} /> */}
                          {file[i] ?
                            <img className="h-16 w-20 object-cover " src={file[i]} alt="Current profile photo" />
                            : <FcPicture size={80} />
                          }

                        </div>
                        <label className="block">
                          <span className="sr-only">Choose profile photo</span>
                          <input type="file" className="block w-full text-sm text-slate-500
file:mr-4 file:py-2 file:px-4
file:rounded-full file:border-0
file:text-sm file:font-semibold
file:bg-violet-50 file:text-secondary
hover:file:bg-violet-100
" accept="image/*" onChange={e => onChangePicture(e, i)} />
                        </label>


                      </div>
                      <div className="relative my-4 ">
                        <input
                          type="text" placeholder="" name="nom_candidat" value={can.nom_candidat} onChange={(e) => handleChange2(e, i)}

                          required
                          className="peer relative h-10 w-full border-b border-slate-200 px-4 text-sm text-slate-500 placeholder-transparent outline-none transition-all autofill:bg-white  focus:border-emerald-500 focus:outline-none  disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                        />
                        <label
                          htmlFor="id-b08"
                          className="absolute left-2 -top-2 z-[1] px-2 text-xs text-slate-400 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm  peer-required:after:content-['\00a0*']  peer-focus:-top-2 peer-focus:text-xs peer-focus:text-emerald-500  peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent"
                        >
                          Nom du candidat
                        </label>
                      </div>
                      <div className="relative my-4 ">
                        <input
                          type="text" placeholder="" name="partie" value={can.partie} onChange={(e) => handleChange2(e, i)}

                          required
                          className="peer relative h-10 w-full border-b border-slate-200 px-4 text-sm text-slate-500 placeholder-transparent outline-none transition-all autofill:bg-white  focus:border-emerald-500 focus:outline-none  disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                        />
                        <label
                          htmlFor="id-b08"
                          className="absolute left-2 -top-2 z-[1] px-2 text-xs text-slate-400 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm  peer-required:after:content-['\00a0*']  peer-focus:-top-2 peer-focus:text-xs peer-focus:text-emerald-500  peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent"
                        >
                          Nom du partie
                        </label>
                      </div>
                      <div className="relative my-4 ">
                        <label
                          className="px-4 text-secondary">
                          Couleur
                        </label>
                        <input
                          type="color" name="color" onChange={(e) => handleChange2(e, i)}
                          value={can.color}

                          required
                          className=" border-2 rounded-lg border-black p-1"
                        />

                      </div>


                    </>
                  })
                }

                <hr className="border-1 border-primary mt-6 mb-2" />
                <span className="mb-8 inline-block text-secondary cursor-pointer hover:text-white hover:bg-secondary rounded-full" onClick={addCandidat}><HiPlusCircle /></span>
                {election.candidats.length >= 3
                  ? < span className="mb-8 inline-block text-secondary cursor-pointer hover:text-white hover:bg-secondary rounded-full" onClick={delCandidat}><HiMinusCircle /></span>
                  : null
                }


                <div className="relative my-4">
                  <button onClick={ajoute} //disabled={encours} 
                    type="button" className="m-auto disabled:bg-zinc-500 inline-flex focus-visible:outline-none items-center justify-center h-10 gap-2 px-5 text-sm font-medium tracking-wide text-white transition duration-300 rounded whitespace-nowrap bg-secondary disabled:cursor-not-allowed disabled:shadow-none">
                    <span>Enregistrer</span>
                  </button>
                </div>
              </div>
            </div>

            {/* <div
              className="flex max-h-[90vh] w-11/12 max-w-md flex-col gap-6 overflow-hidden rounded bg-white p-6 text-slate-500 shadow-xl shadow-slate-700/10"
              ref={wrapperRef}
              id="modal"
              role="document"
            >
              
              <header id="header-2a" className="flex items-center gap-4">
                <h3 className="flex-1 text-xl font-medium text-slate-700">
                  User Terms
                </h3>
                <button
                  onClick={() => setIsShowing(false)}
                  className="inline-flex items-center justify-center h-10 gap-2 px-5 text-sm font-medium tracking-wide transition duration-300 rounded-full justify-self-center whitespace-nowrap text-emerald-500 hover:bg-emerald-100 hover:text-emerald-600 focus:bg-emerald-200 focus:text-emerald-700 focus-visible:outline-none disabled:cursor-not-allowed disabled:text-emerald-300 disabled:shadow-none disabled:hover:bg-transparent"
                  aria-label="close dialog"
                >
                  <span className="relative only:-mx-5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                      role="graphics-symbol"
                      aria-labelledby="title-79 desc-79"
                    >
                      <title id="title-79">Icon title</title>
                      <desc id="desc-79">
                        A more detailed description of the icon
                      </desc>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </span>
                </button>
              </header>
             
              <div id="content-2a" className="flex-1 overflow-auto">
                <p>
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                  Ipsum perferendis odio tempora itaque aut deserunt, delectus
                  facere quasi expedita nulla officia earum at soluta cumque
                  voluptatibus voluptatem accusamus consequuntur tempore!
                </p>
              </div>
              
              <div className="flex justify-end gap-2">
                
                <button className="inline-flex items-center justify-center h-10 gap-2 px-5 text-sm font-medium tracking-wide text-white transition duration-300 rounded whitespace-nowrap bg-emerald-500 hover:bg-emerald-600 focus:bg-emerald-700 focus-visible:outline-none disabled:cursor-not-allowed disabled:border-emerald-300 disabled:bg-emerald-300 disabled:shadow-none">
                  <span>Continue</span>
                </button>
              </div>
            </div> */}
          </div>
          ,
          document.body) : null
      }
    </>

  )
}

export default Elections