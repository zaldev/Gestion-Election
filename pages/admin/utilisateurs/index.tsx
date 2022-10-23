import { ChangeEvent, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { CirconscriptionI } from "../../../models/Circonscription";
import { RegionI } from "../../../models/Region";

import { UserI } from "../../../models/User";
import { voirCirconscriptions, voirRegions } from "../../../services/circonscriptionServices"
import { ajouterUser, voirUsers } from "../../../services/userService";

import { MdAccountCircle } from "react-icons/md"
// import ImageUploading, { ImageListType } from "react-images-uploading";


interface CirconscriptionProps {
  cirs: Array<CirconscriptionI>,
  users: Array<UserI>
}

function Utilisateurs(props: CirconscriptionProps) {
  //   const { data: session } = useSession();
  const [circonscription, setCirconscription] = useState({
    id_dep: "",
    nom: "",
    id_region: ""
  });
  
  const [newUser, setNewUser] = useState<UserI>({
    prenom: "",
    password: "",
    nom: "",
    admin: true,
    cni: "",
    url_img: "",
    id_circonscription: "",
    addresse: "",
    date_naissance: "",
    lieu_naissance: "",
    elections_vote: []

  })

  // const [users, setUsers] = useState([])

  const [file, setFile] = useState("")
  const inputFileRef = useRef<HTMLInputElement | null>(null);

  const circonscriptions: CirconscriptionI[] = props.cirs
  const users: UserI[] = props.users
  const cirInclus1: string[] = Array.from(new Set(users.map(u => u.id_circonscription)))
  const cirInclus2=
    circonscriptions.map(c => {
      if (cirInclus1.includes(c.id_dep))
        {
        return c
      }
    }
    ).filter(e => e !== undefined)
  const [cirInclus, setCirInclus] = useState([...cirInclus2])
  // console.log(cirInclus)

  const [encours, setEncours] = useState(false)


  const [isShowing, setIsShowing] = useState(false)

  const [canEncours,setCanEncours] = useState(false)

  const wrapperRef = useRef(null)

 


  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsShowing(false)
        setNewUser({
          prenom: "",
          password: "",
          nom: "",
          admin: true,
          cni: "",
          url_img: "",
          id_circonscription: "",
          addresse: "",
          date_naissance: "",
          lieu_naissance: "",
          elections_vote: []

        })
        setFile("")
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



  const handleSelectFilter = (e: ChangeEvent<HTMLSelectElement>) => {
    const target = e.target
    const value = target.value
    const name = target.name

    if(value==="tout"){
     setCirInclus([...cirInclus2])
    }
    else {
      setCirInclus( circonscriptions.map(c => {

        if (cirInclus1.includes(c.id_dep) && c.id_dep===value)
          {
          return c
        }
      }
      ).filter(e => e !== undefined))
    
    }
    console.log(cirInclus)

  }

  const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const target = e.target
    const value = target.value
    const name = target.name

    setNewUser({
      ...newUser,
      [name]: value,
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target
    const value = target.value
    const name = target.name

    setNewUser({
      ...newUser,
      [name]: value,
    })
  }
  const [images, setImages] = useState([]);
  const maxNumber = 69;

  const onChangeImg = (e) => {
    setFile(URL.createObjectURL(e.target.files[0]))
    console.log(e.target.files[0])
    setFile(URL.createObjectURL(e.target.files[0]))
  }

  const ajoute = async (e: React.MouseEvent<HTMLInputElement>) => {

    /* Prevent form from submitting by default */
    e.preventDefault();
    /* If file is not selected, then show alert message */
    if (!inputFileRef.current?.files?.length) {
      alert('Selectionnez une image svp!');
      return;
    }

    // setIsLoading(true);

    /* Add files to FormData */
    const formData = new FormData();
    Object.values(inputFileRef.current.files).forEach(fil => {
      formData.append('file', fil);
    })

    /* Send request to our api route */
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });

    const body = await response.json() as { status: 'ok' | 'fail', message: string, url_img: string };

    console.log(body);
    if (body.status === 'ok') {
      inputFileRef.current.value = '';
      setFile("")
      ajouterUser({
        ...newUser,
        url_img: body.url_img,
      }).then((dt) => {
        setNewUser({
          prenom: "",
          password: "",
          nom: "",
          admin: true,
          cni: "",
          url_img: "",
          id_circonscription: "",
          addresse: "",
          date_naissance: "",
          lieu_naissance: "",
          elections_vote: []

        })
      })

    } else {
      // Do some stuff on error
    }

    // setIsLoading(false);
  };







  return (
    <>
      <div className="h-28 w-full">
        <div className="fixed  top-0 left-7 z-20 flex-wrap m-0  p-2 px-12 flex flex-row justify-start w-full  bg-white">
          <div className="relative ml-8 my-6 ">
            <input id="id-0471" type="text" name="id-01" placeholder="CNI" className="peer relative h-10 w-full rounded border border-slate-200 px-4 text-sm text-secondary placeholder-transparent outline-none transition-all autofill:bg-white invalid:border-pink-500 invalid:text-pink-500 focus:border-primary focus:outline-none invalid:focus:border-pink-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400" />
            <label for="id-0471" className="absolute left-2 -top-2 z-[1] px-2 text-xs text-secondary transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-required:after:text-pink-500 peer-required:after:content-['\00a0*'] peer-invalid:text-pink-500 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-primary peer-invalid:peer-focus:text-pink-500 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent">
              CNI
            </label>
          </div>
          <div className="relative mx-10 my-6 md:w-60">
            <select
              id="id-04"
              name="id_circonscription"
              className="peer relative h-10 w-full appearance-none rounded border border-slate-200 bg-white px-4 text-sm text-secondary outline-none transition-all autofill:bg-white focus:border-primary focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
              onChange={(event) => handleSelectFilter(event)}
              defaultValue={newUser.id_circonscription}
            >
              <option value="tout" selected>Tout le pays</option>
              {cirInclus2.map(c => {


                return <option key={c?.id_dep} value={c?.id_dep} >{c?.nom}</option> //<div key={c._id}>{c.nom}</div>

              }
              )}

            </select>

            <label
              htmlFor="id-04"
              className="pointer-events-none absolute top-2.5 left-2 z-[1] px-2 text-sm text-slate-400 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-required:after:text-pink-500 peer-required:after:content-['\00a0*'] peer-valid:-top-2 peer-valid:text-xs peer-focus:-top-2 peer-focus:text-xs peer-focus:text-primary peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent"
            >
              Circonscription
            </label>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="pointer-events-none absolute top-2.5 right-2 h-5 w-5 fill-secondary transition-all peer-focus:fill-primary peer-disabled:cursor-not-allowed"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-labelledby="title-04 description-04"
              role="graphics-symbol"
            >
              <title id="title-04">Arrow Icon</title>
              <desc id="description-04">Arrow icon of the select list.</desc>
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>


          <button onClick={() => setIsShowing(true)} className="m-auto inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded border border-primary px-5 text-sm font-medium tracking-wide text-primary transition duration-300 hover:border-emerald-600 hover:text-emerald-600 hover:shadow-sm hover:shadow-emerald-200 focus:shadow-sm focus:shadow-emerald-200 focus-visible:outline-none disabled:cursor-not-allowed disabled:border-emerald-300 disabled:text-emerald-300 disabled:shadow-none">
            <span>Ajouter</span>
          </button>

        </div>

      </div>


      <div className="w-full overflow-x-auto">
        <table
          className="w-full text-left border border-separate rounded border-slate-200"
          cellSpacing="1"
        >
          <tbody>
            <tr>
              <th
                scope="col"
                className="h-12 px-6 text-sm font-medium border-l bg-blue-100 stroke-slate-700 text-slate-700 first:border-l-0"
              >
                Nom
              </th>
              <th
                scope="col"
                className="h-12 px-6 text-sm font-medium border-l bg-blue-100 stroke-slate-700 text-slate-700 first:border-l-0"
              >
                CNI
              </th>
              <th
                scope="col"
                className="h-12 px-6 text-sm font-medium border-l bg-blue-100 stroke-slate-700 text-slate-700 first:border-l-0"
              >
                Circonscription
              </th>
            </tr>
            <>
              {
                cirInclus.map(c => {
                  return <>{
                    users.map(user => {


                      if (user.id_circonscription === c?.id_dep) {

                        return <>
                          <tr key={user.cni} className={((cirInclus.indexOf(c)%2 === 1) ? " bg-green-100" : "")
                          }>
                            <td className="h-12 px-6 text-sm transition duration-300 border-t border-l border-slate-200 stroke-slate-500 text-slate-500 first:border-l-0 ">
                              {user.prenom} {user.nom}
                            </td>
                            <td className="h-12 px-6 text-sm transition duration-300 border-t border-l border-slate-200 stroke-slate-500 text-slate-500 first:border-l-0 ">
                              {user.cni}
                            </td>
                            <td className="h-12 px-6 text-sm transition duration-300 border-t border-l border-slate-200 stroke-slate-500 text-slate-500 first:border-l-0 ">
                              {c.nom}
                            </td>
                          </tr>
                        </>
                      }
                    })
                  }</>
                })
              }
            </>
          </tbody>
        </table>
      </div>

      {isShowing && typeof document !== "undefined"
        ? ReactDOM.createPortal(
          <div
            className="fixed top-0 left-0 z-20 flex items-center justify-center w-screen h-screen bg-slate-300/20 backdrop-blur-sm"
            aria-labelledby="header-2a content-2a"
            aria-modal="true"
            tabIndex="-1"
            role="dialog"
          >
            <div
              className="flex max-h-[90vh] sm:flex-row w-11/12 max-w-xl justify-center flex-col gap-6 overflow-hidden rounded bg-white p-6 text-slate-500 shadow-xl shadow-slate-700/10"
              // className="flex-wrap m-0  p-2 flex flex-row justify-start w-10/12 max-w-[1200px] "

              ref={wrapperRef}
              id="modal"
              role="document">

              <div className="m-auto  w-56 ">
                <div className="relative ml-4 my-4 flex items-center space-x-6">
                  <div className="shrink-0">
                    {/* <MdAccountCircle size={72} /> */}
                    {file ?
                      <img className="h-16 w-16 object-cover rounded-full" src={file} alt="Current profile photo" />
                      : <MdAccountCircle size={72} />
                    }

                  </div>
                  <label className="block">
                    <span className="sr-only">Choose profile photo</span>
                    <input onChange={onChangeImg} type="file" className="block w-full text-sm text-slate-500
file:mr-4 file:py-2 file:px-4
file:rounded-full file:border-0
file:text-sm file:font-semibold
file:bg-violet-50 file:text-secondary
hover:file:bg-violet-100
" accept="image/*" ref={inputFileRef} />
                  </label>


                </div>
                <div className="relative my-4 ">
                  <input
                    type="text" placeholder="" name="cni" value={newUser.cni} onChange={handleChange}

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
                <div className="relative my-4 ">
                  <input
                    type="text" placeholder="" name="prenom" value={newUser.prenom} onChange={handleChange}

                    required
                    className="peer relative h-10 w-full border-b border-slate-200 px-4 text-sm text-slate-500 placeholder-transparent outline-none transition-all autofill:bg-white  focus:border-emerald-500 focus:outline-none  disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                  />
                  <label
                    htmlFor="id-b08"
                    className="absolute left-2 -top-2 z-[1] px-2 text-xs text-slate-400 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm  peer-required:after:content-['\00a0*']  peer-focus:-top-2 peer-focus:text-xs peer-focus:text-emerald-500  peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent"
                  >
                    Prenom
                  </label>
                </div>
                <div className="relative my-4">
                  <input
                    type="text" placeholder="" name="nom" value={newUser.nom} onChange={handleChange}

                    required
                    className="peer relative h-10 w-full border-b border-slate-200 px-4 text-sm text-slate-500 placeholder-transparent outline-none transition-all autofill:bg-white   focus:border-emerald-500 focus:outline-none  disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                  />
                  <label
                    htmlFor="id-b08"
                    className="absolute left-2 -top-2 z-[1] px-2 text-xs text-slate-400 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm  peer-required:after:content-['\00a0*']  peer-focus:-top-2 peer-focus:text-xs peer-focus:text-emerald-500  peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent"
                  >
                    Nom
                  </label>
                </div>
                <div className="relative my-4">
                  <input
                    type="text" placeholder="" name="date_naissance" value={newUser.date_naissance} onChange={handleChange}

                    required
                    className="peer relative h-10 w-full border-b border-slate-200 px-4 text-sm text-slate-500 placeholder-transparent outline-none transition-all autofill:bg-white   focus:border-emerald-500 focus:outline-none  disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                  />
                  <label
                    htmlFor="id-b08"
                    className="absolute left-2 -top-2 z-[1] px-2 text-xs text-slate-400 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm  peer-required:after:content-['\00a0*']  peer-focus:-top-2 peer-focus:text-xs peer-focus:text-emerald-500  peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent"
                  >
                    Date de naissance
                  </label>
                </div>
              </div>
              <div className="m-auto  w-56 ">

                <div className="relative my-4">
                  <input
                    type="text" placeholder="" name="lieu_naissance" value={newUser.lieu_naissance} onChange={handleChange}

                    required
                    className="peer relative h-10 w-full border-b border-slate-200 px-4 text-sm text-slate-500 placeholder-transparent outline-none transition-all autofill:bg-white   focus:border-emerald-500 focus:outline-none  disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                  />
                  <label
                    htmlFor="id-b08"
                    className="absolute left-2 -top-2 z-[1] px-2 text-xs text-slate-400 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm  peer-required:after:content-['\00a0*']  peer-focus:-top-2 peer-focus:text-xs peer-focus:text-emerald-500  peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent"
                  >
                    Lieu de naissance
                  </label>
                </div>
                <div className="relative my-4">
                  <input
                    type="addresse" placeholder="" name="addresse" value={newUser.addresse} onChange={handleChange}

                    required
                    className="peer relative h-10 w-full border-b border-slate-200 px-4 text-sm text-slate-500 placeholder-transparent outline-none transition-all autofill:bg-white   focus:border-emerald-500 focus:outline-none  disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                  />
                  <label
                    htmlFor="id-b08"
                    className="absolute left-2 -top-2 z-[1] px-2 text-xs text-slate-400 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm  peer-required:after:content-['\00a0*']  peer-focus:-top-2 peer-focus:text-xs peer-focus:text-emerald-500  peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent"
                  >
                    Adresse
                  </label>
                </div>
                <div className="relative my-4 md:w-60">
                  <select
                    id="id-01"
                    name="id_circonscription"
                    className="peer relative h-10 w-full appearance-none border-b border-slate-200 bg-white px-4 text-sm text-slate-500 outline-none transition-all autofill:bg-white focus:border-emerald-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                    onChange={(event) => handleSelect(event)}
                    defaultValue={newUser.id_circonscription}
                  >
                    <option value="" disabled > </option>
                    {circonscriptions.map(c => {


                      return <option key={c.id_dep} value={c.id_dep} selected={c.id_dep === newUser.id_circonscription}>{c.nom}</option> //<div key={c._id}>{c.nom}</div>

                    }
                    )}
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
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>

                <div className="relative my-4">
                  <input
                    type="password" placeholder="" name="password" value={newUser.password} onChange={handleChange}

                    required
                    className="peer relative h-10 w-full border-b border-slate-200 px-4 text-sm text-slate-500 placeholder-transparent outline-none transition-all autofill:bg-white   focus:border-emerald-500 focus:outline-none  disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                  />
                  <label
                    htmlFor="id-b08"
                    className="absolute left-2 -top-2 z-[1] px-2 text-xs text-slate-400 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm  peer-required:after:content-['\00a0*']  peer-focus:-top-2 peer-focus:text-xs peer-focus:text-emerald-500  peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent"
                  >
                    Mot de passe
                  </label>
                </div>
                <div className="relative my-4">
                  <button disabled={encours} onClick={ajoute} type="button" className="m-auto disabled:bg-zinc-500 inline-flex focus-visible:outline-none items-center justify-center h-10 gap-2 px-5 text-sm font-medium tracking-wide text-white transition duration-300 rounded whitespace-nowrap bg-secondary disabled:cursor-not-allowed disabled:shadow-none">
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
          document.body) : null}

    </>

  );
};


export async function getServerSideProps() {
  const res1 = await voirCirconscriptions()
  const res3 = await voirUsers()
  const cirs: CirconscriptionI[] = res1.data.data
  const users: UserI[] = res3.data.data


  return { props: { cirs, users } }
}

export default Utilisateurs;

