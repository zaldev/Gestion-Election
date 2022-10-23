import axios from "axios";
import type { NextPage } from "next";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";
import MapSN from "../../../components/Map/MapSN";
import { CirconscriptionI } from "../../../models/Circonscription";
import { RegionI } from "../../../models/Region";

import { ajouterCirconscripton, ajouterRegion, voirCirconscriptions, voirRegion, voirRegions } from "../../../services/circonscriptionServices"

interface CirconscriptionProps {
  cirs: Array<CirconscriptionI>,
  regs: Array<RegionI>
}

function Circonscriptions(props: CirconscriptionProps) {
  //   const { data: session } = useSession();
  const [circonscription, setCirconscription] = useState({
    id_dep: "",
    nom: "",
    id_region: ""
  });

  const [circonscriptions, setCirconscriptions] = useState<CirconscriptionI[]>(props.cirs)
  const [regions, setRegions] = useState<RegionI[]>(props.regs)
  const [encours, setEncours] = useState(false)
  // console.log(props.cirs)
  // setCirconscriptions(props.cirs)
  // setRegions(props.regs)
  // console.log(regions)


  function ajoute() {
    const circonscriptionI:CirconscriptionI = circonscription
    setEncours(true)
    ajouterCirconscripton(circonscriptionI).then(async data => {
      circonscriptions.push(circonscriptionI)
      let rexi=false;
      const regs:RegionI[]=regions.map((r:RegionI)=>{
        if (r.id_region===circonscriptionI.id_region){
          r.id_deps.push(circonscriptionI.id_region)
          rexi =true;
        } 
        return r
      })
      if (!rexi) {
        const rnom =circonscriptionI.id_region.split("-")[1].split('_').map((no) =>
                    no.charAt(0).toUpperCase() + no.slice(1)).join(' ')
        regs.push({ id_region:circonscriptionI.id_region, nom: rnom, id_deps: [circonscriptionI.id_dep] })
      }
      setRegions(regs)
      setCirconscriptions(circonscriptions)
      // voirCirconscriptions().then((res1) => {
      //   setCirconscriptions(res1.data.data)
      //   console.log("***"+res1.data.data)
      // }).then(data => {
      //   voirCirconscriptions()
      //   .then((res2) => {
      //     setCirconscriptions(circonscriptions)
      //     setRegions(res2.data.data)
      //     console.log("+++"+res2.data.data)
      //     setEncours(false)
      //   }).catch(er=> setEncours(false))

      // }).catch(er=> setEncours(false))
    }).catch(er=> setEncours(false))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target
    const value = target.value
    const name = target.name

    setCirconscription({
      ...circonscription,
      [name]: value,
    })
  }

  const handleClick = (e: any, id: string, id_reg: string) => {
    // console.log(e)
    selectCir(id, id_reg);

  }

  const selectCir = (id: string, id_reg: string) => {
    setEncours(false)
    const id_dep = id.split('--')[0]
    const nom = id_dep.split("-")[1].split('_').map((no) =>
      no.charAt(0).toUpperCase() + no.slice(1)).join(' ')

    setCirconscription({
      ...circonscription,
      nom: nom,
      id_dep: id_dep,
      id_region: id_reg
    })

    circonscriptions.map(c => {
      if (c.id_dep === id_dep) {
        setEncours(true)

      }
    })
  }



  return (
    <>
      <div className="relative flex-wrap m-0 w-full p-2 flex flex-row justify-between items-stretch w-10/12 max-w-[1200px] ">
        <div className="basis-2/5 ">
          <MapSN handleClick2={handleClick} depSelected={circonscription.id_dep} />
        </div>
        <div className="shrink basis-7/12 ">
          <div className="relative my-6 mb-8">
            <input
              type="text" placeholder="Gossas" name="nom" value={circonscription.nom} onChange={handleChange}

              required
              className="peer relative h-10 w-full border-b border-slate-200 px-4 text-sm text-slate-500 placeholder-transparent outline-none transition-all autofill:bg-white  focus:border-emerald-500 focus:outline-none  disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
            />
            <label
              htmlFor="id-b08"
              className="absolute left-2 -top-2 z-[1] px-2 text-xs text-slate-400 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm  peer-required:after:content-['\00a0*']  peer-focus:-top-2 peer-focus:text-xs peer-focus:text-emerald-500  peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent"
            >
              Circonscription
            </label>
          </div>
          <div className="relative my-6">
            <input
              type="text" placeholder="Fatick" name="region_id" value={circonscription.id_region} onChange={handleChange}

              required
              className="peer relative h-10 w-full border-b border-slate-200 px-4 text-sm text-slate-500 placeholder-transparent outline-none transition-all autofill:bg-white   focus:border-emerald-500 focus:outline-none  disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
            />
            <label
              htmlFor="id-b08"
              className="absolute left-2 -top-2 z-[1] px-2 text-xs text-slate-400 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm  peer-required:after:content-['\00a0*']  peer-focus:-top-2 peer-focus:text-xs peer-focus:text-emerald-500  peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent"
            >
              Region
            </label>
          </div>
          <div className="relative my-6">
            <button disabled={encours} onClick={ajoute} type="button" className="m-auto disabled:bg-zinc-500 inline-flex focus-visible:outline-none items-center justify-center h-10 gap-2 px-5 text-sm font-medium tracking-wide text-white transition duration-300 rounded whitespace-nowrap bg-secondary disabled:cursor-not-allowed disabled:shadow-none">
              <span>Enregistrer</span>
            </button>
          </div>
        </div>



      </div>
      {/* <div className="w-full overflow-x-auto">
        <table
          className="w-full text-left border border-separate rounded border-slate-200"
          cellSpacing="1"
        >
          <tbody>
            <tr>
              <th
                scope="col"
                className="h-12 px-6 text-sm font-medium border-l bg-slate-100 stroke-slate-700 text-slate-700 first:border-l-0"
              >
                Circonscription
              </th>
              <th
                scope="col"
                className="h-12 px-6 text-sm font-medium border-l bg-slate-100 stroke-slate-700 text-slate-700 first:border-l-0"
              >
                ID
              </th>
              <th
                scope="col"
                className="h-12 px-6 text-sm font-medium border-l bg-slate-100 stroke-slate-700 text-slate-700 first:border-l-0"
              >
                Region
              </th>
            </tr>
            <>
              {regions.map(r => {
               
                return <>{
                  circonscriptions.map(c => {

                    if (c.id_region === r.id_region) {
                      // console.log(regions.indexOf(r)%2===0)
                      return <>
                        <tr key={c._id} onClick={(event)=>handleClick(event,c.id_dep,c.id_region)} className={((circonscription.id_dep===c.id_dep) ?  "bg-cyan-400" :""+((regions.indexOf(r)%2===1) ?  " bg-red-100" :""))
                      }>
                          <td className="h-12 px-6 text-sm transition duration-300 border-t border-l border-slate-200 stroke-slate-500 text-slate-500 first:border-l-0 ">
                            {c.nom}
                          </td>
                          <td className="h-12 px-6 text-sm transition duration-300 border-t border-l border-slate-200 stroke-slate-500 text-slate-500 first:border-l-0 ">
                            {c.id_dep}
                          </td>
                          <td className="h-12 px-6 text-sm transition duration-300 border-t border-l border-slate-200 stroke-slate-500 text-slate-500 first:border-l-0 ">
                            {r.nom}
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
      </div> */}
    </>

  );
};


export async function getServerSideProps() {
  const res1 = await voirCirconscriptions();
  const res2 = await voirRegions();
  const cirs:CirconscriptionI[] = res1.data.data;
  const regs: RegionI[] = res2.data.data;

  return { props: { cirs, regs } }
}

export default Circonscriptions;
