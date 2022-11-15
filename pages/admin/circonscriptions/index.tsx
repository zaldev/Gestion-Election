import { ChangeEvent, useState } from "react";
import MapSN from "../../../components/Map/MapSN";
import { CirconscriptionI } from "../../../models/Circonscription";
import { RegionI } from "../../../models/Region";
import { UserI } from "../../../models/User";

import { voirCirconscriptions, voirRegions } from "../../../services/circonscriptionServices"
import { voirUsers } from "../../../services/userService";
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';



ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);


interface CirconscriptionProps {
  cirs: Array<CirconscriptionI>,
  regs: Array<RegionI>,
  users: Array<UserI>,
  zoneResults: Array<ZoneResult>
}

interface ZoneResult {
  cir?: string,
  id_cir?: string,
  reg?: string,
  inscrits?: number,
  pourcentages?: number
}

function Circonscriptions(props: CirconscriptionProps) {
  // const { data: session } = useSession();
  const [zoneResults, setZoneResults] = useState<ZoneResult[]>(props.zoneResults);

  const [zoneResult, setZoneResult] = useState<ZoneResult>(zoneResults[0]);


  const [circonscriptions, setCirconscriptions] = useState<CirconscriptionI[]>(props.cirs)
  const [regions, setRegions] = useState<RegionI[]>(props.regs)
  const [encours, setEncours] = useState(false)
  const [encours2, setEncours2] = useState(false)

  const users: UserI[] = props.users



  const dataf = {
    labels: zoneResults.slice(1).map((zn) =>
      zn.cir
    ),
    datasets: [{
      label: "Inscrits",
      data: zoneResults.slice(1).map((zn) => zn.inscrits),
      backgroundColor: "#1ccc00",
    }]
  }


  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '',
      },
    },
  };

  // function ajoute() {
  //   const circonscriptionI: CirconscriptionI = circonscription
  //   setEncours(true)
  //   ajouterCirconscripton(circonscriptionI).then(async data => {
  //     circonscriptions.push(circonscriptionI)
  //     let rexi = false;
  //     const regs: RegionI[] = regions.map((r: RegionI) => {
  //       if (r.id_region === circonscriptionI.id_region) {
  //         r.id_deps.push(circonscriptionI.id_region)
  //         rexi = true;
  //       }
  //       return r
  //     })
  //     if (!rexi) {
  //       const rnom = circonscriptionI.id_region.split("-")[1].split('_').map((no) =>
  //         no.charAt(0).toUpperCase() + no.slice(1)).join(' ')
  //       regs.push({ id_region: circonscriptionI.id_region, nom: rnom, id_deps: [circonscriptionI.id_dep] })
  //     }
  //     setRegions(regs)
  //     setCirconscriptions(circonscriptions)

  //   }).catch(er => console.log(er)).finally(() => setEncours(false))
  // }



  const handleClick = (e: any, id: string, id_reg: string) => {
    selectCir(id);
  }

  const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const target = e.target
    const value = target.value
    const name = target.name

    selectCir(value)


  }

  const selectCir = (id: string) => {
    setEncours(false)
    const id_dep = id.split('--')[0]
    // const nom = id_dep.split("-")[1].split('_').map((no) => no.charAt(0).toUpperCase() + no.slice(1)).join(' ')
    const znsel = zoneResults.find(zr => zr.id_cir === id_dep)
    if (znsel != null) {
      setZoneResult(znsel)
    }
  }


  return (
    <>
      <div className="overflow-hidden bg-white rounded text-slate-500 shadow-slate-200 w-8/12 mx-auto">
        <div className="p-6">
          <h3 className=" text-2xl text-center font-semibold text-secondary">
            Gestion des Circonscription
          </h3>
        </div>
      </div>
      <hr className="border-primary border-[1px] rounded-full mx-16" />
      <div className="relative flex-wrap m-0 p-2 flex flex-row justify-between items-stretch w-11/12  ">
        <div className="basis-7/12 flex flex-col">
          <MapSN handleClick2={handleClick} depSelected={zoneResult.id_cir} />
        </div>
        <div className="shrink flex-1 ml-8">
          <div className="relative my-6 mb-8 mx-auto w-fit">
            <select
              id="id-01"
              name="id_circonscription"
              className="peer relative h-10 w-full appearance-none border-b border-slate-200 bg-white px-4 text-sm text-slate-500 outline-none transition-all autofill:bg-white focus:border-emerald-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
              onChange={(event) => handleSelect(event)}
              defaultValue={zoneResult.id_cir}
            >
              {/* <option value="" disabled > </option> */}
              {zoneResults.map(zr => {


                return <option key={zr.id_cir} value={zr.id_cir} selected={zr.id_cir === zoneResult.id_cir}> {zr.cir}
                  ({zr.inscrits || 0} inscrits)
                </option>
              }
              )}
            </select>
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

          <div className="overflow-hidden border-2 border-primary bg-white h-4/6 rounded shadow-lg text-slate-500 shadow-green-300">
            <div className="p-6 flex flex-col items-center justify-center h-full gap-9">
              <h2 className="text-center text-2xl text-secondary">{zoneResult.cir}</h2>
              <h2 className="text-center "><span className="text-8xl">{zoneResult.inscrits}</span> habs</h2>
              {zoneResult.id_cir != 'tout' ? <h2 className="text-center text-xl">{zoneResult.pourcentages?.toString().slice(0, 4)} %</h2> : null}

            </div>
          </div>
        </div>
      </div>
      <div className="relative flex-wrap m-0 p-2 flex flex-col justify-center items-center mx-2 my-2 mb-4 ">
        <Bar className="" options={options} data={dataf} />

      </div>
    </>

  );
};


export async function getServerSideProps() {
  const res1 = await voirCirconscriptions();
  const res2 = await voirRegions();
  const res3 = await voirUsers();
  const cirss: CirconscriptionI[] = res1.data.data;
  const regs: RegionI[] = res2.data.data;
  const users: UserI[] = res3.data.data;
  const cirs: CirconscriptionI[] = regs.reduce((a, regs) => {
    return a.concat(
      cirss.filter(c => c.id_region === regs.id_region).map((c) => {
        c.inscrits = users.filter(u => c.id_dep === u.id_circonscription).length
        return c
      }
      ))
  },
    [])

  const population = cirs.reduce((a, c) => a += (c?.inscrits || 0), 0)

  let zoneResults: ZoneResult[] = cirs.map((c) => {
    let zr: ZoneResult = {
      cir: c.nom,
      id_cir: c.id_dep,
      reg: regs.find(r => r.id_region === c.id_region)?.nom || "",
      inscrits: c.inscrits || 0,
      pourcentages: 100 * (c.inscrits || 0) / (population || 1)
    }

    return zr
  })


  zoneResults = [{
    cir: "Tout le pays",
    id_cir: 'tout',
    reg: "",
    inscrits: population,
    pourcentages: 100
  }].concat([...zoneResults])





  return { props: { cirs, regs, users, zoneResults } }
}

export default Circonscriptions;
