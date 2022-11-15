import type { NextPage } from "next";
import MapSN from '../components/Map/MapSN'
import { useSession, signIn, signOut } from "next-auth/react";
import { ElectionI } from "../models/Election";
import { voirElections } from "../services/electionService";
import { voirUser } from "../services/userService";
import { useRouter } from 'next/router'

import { useState } from "react"
import { UserI } from "../models/User";

interface HomeProps {
  elects: Array<ElectionI>,
}


function Home(props: HomeProps) {

  const { data: session, status } = useSession();
  const user: UserI = session?.user


  const elections: ElectionI[] = props.elects
  const router = useRouter()
  const [electe, setElecte] = useState(elections.filter(elect => (elect.etat === 1))[0] || null)
  const [electp, setElectp] = useState(elections.filter(elect => (elect.etat === 2))[0] || null)





  const handleClick = (e: any, id: string) => {
    const target = e.target
    const dept = document.getElementById(id)
    const depts: HTMLCollectionOf<Element> = document.getElementsByClassName("dept")
    for (let key of depts) {

      if (key.classList.contains("dept-select")) key.classList.remove("dept-select")
    }

    dept?.setAttribute("class", " ".concat(dept.classList) + " dept-select")
    dept?.classList.remove

  }

  const voterElection = (elect: ElectionI) => {

    router.push('/elections/' + elect.annee + '/voter')
  }
  const voirElection = (elect: ElectionI) => {

    router.push('/elections/' + elect.annee)
  }
  return <>

    <div>
      <h1 className="home-banier text-center text-secondary text-2xl  align-baseline my-5 mb-8">
        <span className="t-left"></span>Bienvenue sur la Portail electoral !<span
          className="t-right"
        ></span>

      </h1>
      {electe != null ? <>
        <div className="overflow-hidden bg-white rounded text-slate-500 shadow-slate-200 w-8/12 mx-auto">

          <div className="p-6">
            <h3 className="mb-10 text-2xl text-center font-bold text-secondary">
              Election {electe.annee} (en cours)
            </h3>
            <div className="flex justify-evenly">
              {electe?.candidats.map((can, i) => {
                // const ring="ring-["+can.color+"]"
                const [ms, setMs] = useState(false)
                return <>
                  <span
                    className="relative cursor-pointer group hover:overflow-visible focus-visible:outline-none"
                    aria-describedby="tooltip-02"
                  >

                    <img key={i} className="p-1 w-28 h-28 rounded-full ring-4" src={can.url_image} alt="Bordered avatar"
                      onMouseEnter={() => { setMs(true) }}
                      onMouseLeave={() => { setMs(false) }}
                      style={{
                        '--tw-ring-color': can.color, background: ms ? can.color : ""
                      }
                      } />



                    <span
                      role="tooltip"
                      id="tooltip-02"
                      className="invisible absolute top-full left-1/2 z-40 mt-2 w-28 -translate-x-1/2 rounded bg-slate-700 p-4 text-sm text-white opacity-0 transition-all before:invisible before:absolute before:left-1/2 before:bottom-full before:z-40 before:mt-2 before:-ml-2 before:border-x-8 before:border-b-8 before:border-x-transparent before:border-b-slate-700 before:opacity-0 before:transition-all before:content-[''] group-hover:visible group-hover:block group-hover:opacity-100 group-hover:before:visible group-hover:before:opacity-100"
                    >
                      {can.nom_candidat}
                    </span>
                  </span>

                </>

              })}

            </div>
            <div className="flex flex-col justify-center mt-6">

              {status === "authenticated" ?
                <>
                  {(!electe.electeurs.includes(user?._id)) ?
                    <button onClick={() => voterElection(electe)} className="relative inline-flex items-center justify-center p-0.5 mb-2 m-auto overflow-hidden text-lg  text-purple-900 font-semibold rounded-lg group bg-gradient-to-br from-green-600 to-blue-500 group-hover:from-green-600 group-hover:to-blue-500 hover:text-white  focus:ring-4 focus:outline-none focus:ring-blue-300 ">
                      <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white  rounded-md group-hover:bg-opacity-0">
                        Voter !
                      </span>
                    </button> :
                    <> <h2 className="text-2xl text-center text-primary">Vous avez deja votez !</h2>
                      <p className="text-center text-secondary">En attente des resultats...</p>
                    </>
                  }
                </> :
                <>
                  <h2 className="text-2xl text-center text-secondary">Veuillez vous connectez pour pouvoir voter ! </h2>
                </>
              }
            </div>

          </div>
        </div>

        <hr className="border-primary border-[2px] rounded-full m-8 mx-16" />
      </>
        : null
      }



      <div className="conteiner">
        <div className="item item-texte">
          <h2>Vote</h2>
          <h3>Rapide, Facile &  Securise !</h3>
        </div>
        <div className="item item-image">
          <img src="/vote-image.jpg" alt="" />
        </div>
      </div>
      <hr className="border-primary border-[2px] rounded-full m-8 mx-16" />
      <div className="conteiner c2">


        <div className="item ">
          <MapSN ></MapSN>

        </div>
        <div className="item item-texte">
          <h2>Resultats</h2>
          <h3>Transparants, Detailles & Intuitifs !</h3>
        </div>
      </div>
      {electp != null ? <>
        <hr className="border-primary border-[2px] rounded-full m-8 mx-16" />

        <div className="overflow-hidden bg-white rounded text-slate-500 shadow-slate-200 w-8/12 mx-auto">

          <div className="p-6">
            <h3 className="mb-10 text-2xl text-center font-bold text-secondary">
              Election {electp.annee} (precedent)
            </h3>
            <div className="flex justify-evenly">
              {electp.candidats.map((can, i) => {
                // const ring="ring-["+can.color+"]"
                const [ms, setMs] = useState(false)
                return <>
                  <span
                    className="relative cursor-pointer group hover:overflow-visible focus-visible:outline-none"
                    aria-describedby="tooltip-02"
                  >

                    <img key={i} className="p-1 w-28 h-28 rounded-full ring-4" src={can.url_image} alt="Bordered avatar"
                      onMouseEnter={() => { setMs(true) }}
                      onMouseLeave={() => { setMs(false) }}
                      style={{
                        '--tw-ring-color': can.color, background: ms ? can.color : ""
                      }
                      } />



                    <span
                      role="tooltip"
                      id="tooltip-02"
                      className="invisible absolute top-full left-1/2 z-40 mt-2 w-28 -translate-x-1/2 rounded bg-slate-700 p-4 text-sm text-white opacity-0 transition-all before:invisible before:absolute before:left-1/2 before:bottom-full before:z-40 before:mt-2 before:-ml-2 before:border-x-8 before:border-b-8 before:border-x-transparent before:border-b-slate-700 before:opacity-0 before:transition-all before:content-[''] group-hover:visible group-hover:block group-hover:opacity-100 group-hover:before:visible group-hover:before:opacity-100"
                    >
                      {can.nom_candidat}
                    </span>
                  </span>

                </>

              })}

            </div>
            <div className="flex justify-center mt-6">
              <button onClick={() => voirElection(electp)} className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-lg  text-purple-900 font-semibold rounded-lg group bg-gradient-to-br from-green-600 to-blue-500 group-hover:from-green-600 group-hover:to-blue-500 hover:text-white  focus:ring-4 focus:outline-none focus:ring-blue-300 ">
                <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white  rounded-md group-hover:bg-opacity-0">
                  Voir les resultats
                </span>
              </button>
            </div>

          </div>
        </div>
      </>
        : null
      }

    </div>
  </>
};

export default Home;

export async function getServerSideProps() {
  const res1 = await voirElections()

  const elects: ElectionI[] = res1.data.data




  return { props: { elects } }
}