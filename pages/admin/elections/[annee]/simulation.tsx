import axios from "axios";
import type { NextPage } from "next";
import { useSession, signIn, signOut } from "next-auth/react";
import { ChangeEvent, useState } from "react";
import { GiElectricalCrescent } from "react-icons/gi";
import MapSN from "../../../../components/Map/MapSN";
import { CirconscriptionI } from "../../../../models/Circonscription";
import { ElectionI } from "../../../../models/Election";
import { RegionI } from "../../../../models/Region";

import { ajouterCirconscripton, ajouterRegion, updateCirconscription, voirCirconscriptions, voirRegion, voirRegions } from "../../../../services/circonscriptionServices"
import { updateElection, voirElections } from "../../../../services/electionService";

interface CirconscriptionProps {
    cirs: Array<CirconscriptionI>,
    regs: Array<RegionI>,
    elect: ElectionI
}

function Circonscriptions(props: CirconscriptionProps) {
    //   const { data: session } = useSession();
    const [circonscription, setCirconscription] = useState<CirconscriptionI>({
        id_dep: "",
        nom: "",
        id_region: ""
    });



    const [circonscriptions, setCirconscriptions] = useState<CirconscriptionI[]>(props.cirs)
    const [regions, setRegions] = useState<RegionI[]>(props.regs)
    const [encours, setEncours] = useState(false)
    const [encours2, setEncours2] = useState(false)

    const [elect, setElect] = useState<ElectionI>(props.elect)

    const [depStats, setDepStats] = useState({
        id_dep: "",
        nom_dep: "",
        v_nuls: 0,
        nombres: new Map<string, number>(elect.candidats.map(ca => [ca?.nom_candidat || "ras", 0]))
    });

    function ajoute() {
        const circonscriptionI: CirconscriptionI = circonscription
        setEncours(true)
        ajouterCirconscripton(circonscriptionI).then(async data => {
            circonscriptions.push(circonscriptionI)
            let rexi = false;
            const regs: RegionI[] = regions.map((r: RegionI) => {
                if (r.id_region === circonscriptionI.id_region) {
                    r.id_deps.push(circonscriptionI.id_region)
                    rexi = true;
                }
                return r
            })
            if (!rexi) {
                const rnom = circonscriptionI.id_region.split("-")[1].split('_').map((no) =>
                    no.charAt(0).toUpperCase() + no.slice(1)).join(' ')
                regs.push({ id_region: circonscriptionI.id_region, nom: rnom, id_deps: [circonscriptionI.id_dep] })
            }
            setRegions(regs)
            setCirconscriptions(circonscriptions)

        }).catch(er => console.log(er)).finally(() => setEncours(false))
    }



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
        const nom = id_dep.split("-")[1].split('_').map((no) =>
            no.charAt(0).toUpperCase() + no.slice(1)).join(' ')



        // depStats.nombres.forEach((ca, nomb) => console.log(nomb))


        elect.candidats.map(casel => {

            const dep_votes = { dep_id: id_dep, votants: 0 }

            if (casel.votes.length > 0) {
                const v_dep = casel.votes.find(v => v.dep_id === id_dep)
                if (v_dep != null) {
                    depStats.nombres.set(casel?.nom_candidat || "ras", v_dep.votants)
                } else {
                    casel.votes.push(dep_votes)
                    depStats.nombres.set(casel?.nom_candidat || "ras", 0)
                }
            } else {
                casel.votes.push(dep_votes)
                depStats.nombres.set(casel?.nom_candidat || "ras", 0)
            }


        });

        const dep_votes = { dep_id: id_dep, votants: 0 }

        if (elect.votes_nuls.length > 0) {
            const v_dep = elect.votes_nuls.find(v => v.dep_id === id_dep)
            if (v_dep != null) {
                depStats.v_nuls = v_dep.votants
            } else {
                elect.votes_nuls.push(dep_votes)
                depStats.v_nuls = dep_votes.votants
            }
        } else {
            elect.votes_nuls.push(dep_votes)
            depStats.v_nuls = dep_votes.votants
        }

        depStats.v_nuls = elect?.votes_nuls?.find(v => v.dep_id === id_dep)?.votants || 0

        const cir: CirconscriptionI = circonscriptions.find(c => c.id_dep === id_dep) || circonscription


        setCirconscription(cir)

        depStats.id_dep = id_dep
        depStats.nom_dep = nom

        setDepStats({ ...depStats })

        circonscriptions.map(c => {
            if (c.id_dep === id_dep) {
                // setEncours(true)

            }
        })
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
    const handleChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
        const target = e.target
        const value = target.value
        const name = target.name


        depStats.nombres.set(name, parseInt(value.split(" ").join("")))
        const nv = elect.candidats.find(c => c?.nom_candidat === name)?.votes
            .find(v => v.dep_id === depStats.id_dep)
        if (nv != null) {
            nv.votants = parseInt(value) || 0
        }





        setElect({ ...elect })
        setDepStats({ ...depStats })

        // setCirconscription({
        //   ...circonscription,
        //   [name]: value,
        // })
    }

    const handleChange3 = (e: React.ChangeEvent<HTMLInputElement>) => {
        const target = e.target
        const value = target.value

        depStats.v_nuls = parseInt(value.split(" ").join(""))

        const nvv = elect.votes_nuls.find(v => v.dep_id === depStats.id_dep)

        if (nvv != null) {
            nvv.votants = parseInt(value) || 0
        }
        setElect({ ...elect })
        setDepStats({ ...depStats })

    }

    const changeDepStats = () => {

        setEncours(true)

        updateElection(elect._id, elect).
            finally(() => setEncours(false))



    }

    const changeInscrits = () => {

        setEncours(true)
        circonscriptions[circonscriptions.indexOf(circonscriptions.find(c => c.id_dep === depStats.id_dep))] = circonscription
        setCirconscriptions([...circonscriptions])
        updateCirconscription(circonscription._id, circonscription).
            finally(() => setEncours(false))

    }



    return (
        <>
            {elect != null ? <>
                <div className="overflow-hidden bg-white rounded text-slate-500 shadow-slate-200 w-8/12 mx-auto">

                    <div className="p-6">
                        <h3 className=" text-2xl text-center font-bold text-secondary">
                            Simulation des resultats : Election {elect.annee}
                        </h3>
                    </div>
                </div>

                <hr className="border-primary border-[1px] rounded-full mx-16" />
            </>
                : null
            }
            <div className="relative flex-wrap m-0 p-2 flex flex-row justify-between items-stretch w-10/12 max-w-[1200px] ">

            </div>

            <div className="relative flex-wrap m-0 p-2 flex flex-row justify-between items-stretch w-10/12 max-w-[1200px] ">
                <div className="basis-7/12 flex flex-col">
                    <MapSN handleClick2={handleClick} depSelected={circonscription.id_dep} />
                    <div>
                        <div className="relative my-6 mb-8">
                            <select
                                id="id-01"
                                name="id_circonscription"
                                className="peer relative h-10 w-full appearance-none border-b border-slate-200 bg-white px-4 text-sm text-slate-500 outline-none transition-all autofill:bg-white focus:border-emerald-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                                onChange={(event) => handleSelect(event)}
                                defaultValue={circonscription.id_dep}
                            >
                                {/* <option value="" disabled > </option> */}
                                {circonscriptions.map(c => {


                                    return <option key={c.id_dep} value={c.id_dep} selected={c.id_dep === circonscription.id_dep}>{c.nom} ({c.inscrits || 0} inscrits)</option> //<div key={c._id}>{c.nom}</div>

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
                        <div className="relative my-6 mb-8">
                            <input
                                type="number" placeholder="Gossas" name="inscrits" value={circonscription?.inscrits} onChange={handleChange}
                                required
                                className="peer relative h-10 w-full border-b border-slate-200 px-4 text-sm text-slate-500 placeholder-transparent outline-none transition-all autofill:bg-white  focus:border-emerald-500 focus:outline-none   disabled:bg-slate-50 "
                            />
                            <label
                                htmlFor="id-b08"
                                className="absolute left-2 -top-2 z-[1] px-2 text-xs text-slate-400 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm  peer-required:after:content-['\00a0*']  peer-focus:-top-2 peer-focus:text-xs peer-focus:text-emerald-500  peer-disabled:cursor-not-allowed  peer-disabled:before:bg-transparent"
                            >
                                Nombres inscrits
                            </label>
                        </div>
                        <div className="relative my-6 mb-10">
                            <button disabled={encours || depStats.id_dep == ""} onClick={changeInscrits} type="button" className="m-auto disabled:bg-zinc-500 inline-flex focus-visible:outline-none items-center justify-center h-10 gap-2 px-5 text-sm font-medium tracking-wide text-white transition duration-300 rounded whitespace-nowrap bg-secondary disabled:cursor-not-allowed disabled:shadow-none">
                                <span>Enregistrer</span>
                            </button>
                        </div>
                    </div>
                </div>


                <div className="shrink basis-5/12 ">
                    {/* <hr className="border-2 border-secondary mb-10" /> */}

                    {[...(depStats.nombres)].map((ca) => {
                        return <>

                            <div className="relative my-6">
                                <input
                                    type="number" placeholder="" name={ca[0]} value={ca[1]} onChange={handleChange2}

                                    required
                                    className="peer relative h-10 w-full border-b border-slate-200 px-4 text-sm text-slate-500 placeholder-transparent outline-none transition-all autofill:bg-white   focus:border-emerald-500 focus:outline-none  disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                                />
                                <label
                                    htmlFor="id-b08"
                                    className="absolute left-2 -top-2 z-[1] px-2 text-xs text-slate-400 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm  peer-required:after:content-['\00a0*']  peer-focus:-top-2 peer-focus:text-xs peer-focus:text-emerald-500  peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent"
                                >
                                    {ca[0]}
                                </label>
                            </div>
                        </>
                    }
                    )}

                    <div className="relative my-6">
                        <input
                            type="number" placeholder="" name="v_nuls" value={depStats.v_nuls} onChange={handleChange3}

                            required
                            className="peer relative h-10 w-full border-b border-slate-200 px-4 text-sm text-slate-500 placeholder-transparent outline-none transition-all autofill:bg-white   focus:border-emerald-500 focus:outline-none  disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                        />
                        <label
                            htmlFor="id-b08"
                            className="absolute left-2 -top-2 z-[1] px-2 text-xs text-slate-400 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm  peer-required:after:content-['\00a0*']  peer-focus:-top-2 peer-focus:text-xs peer-focus:text-emerald-500  peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent"
                        >
                            Bulletins nuls
                        </label>
                    </div>

                    <div className="relative my-6">
                        <button onClick={changeDepStats} disabled={encours || depStats.id_dep == ""} type="button" className="m-auto disabled:bg-zinc-500 inline-flex focus-visible:outline-none items-center justify-center h-10 gap-2 px-5 text-sm font-medium tracking-wide text-white transition duration-300 rounded whitespace-nowrap bg-secondary disabled:cursor-not-allowed disabled:shadow-none">
                            <span>Enregistrer</span>
                        </button>
                    </div>
                </div>
            </div>
        </>

    );
};


export async function getServerSideProps(context) {
    const { annee } = context.query;

    const res1 = await voirCirconscriptions();
    const res2 = await voirRegions();
    const res3 = await voirElections();
    const cirs: CirconscriptionI[] = res1.data.data;
    const regs: RegionI[] = res2.data.data;
    const elects: ElectionI[] = res3.data.data;
    const elect = elects.filter(elect => (elect.annee.toString() === annee))[0]

    if (elect == null) {
        return {
            notFound: true,
        }
    }

    return { props: { cirs, regs, elect } }
}

export default Circonscriptions;
