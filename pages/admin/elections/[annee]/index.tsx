import { ChangeEvent, useEffect, useState } from "react";
import { MdOutlineMultilineChart } from "react-icons/md";
import MapSN from "../../../../components/Map/MapSN";
import { CirconscriptionI } from "../../../../models/Circonscription";
import { ElectionI } from "../../../../models/Election";
import { RegionI } from "../../../../models/Region";

import { voirCirconscriptions, voirRegions } from "../../../../services/circonscriptionServices"
import { updateElection, voirElections } from "../../../../services/electionService";
import {
    Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale,
    LinearScale,
    BarElement,
    Title,
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { useRouter } from "next/router";


ChartJS.register(ArcElement, Tooltip, Legend);

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
    elects: Array<ElectionI>,
    zoneResults: Array<ZoneResult>,
    zoneResultsRegs: Array<ZoneResult>
}

interface ZoneResult {
    id_cir?: string,
    id_reg?: string,
    inscrits?: number,
    n_votants?: number,
    v_nuls?: number,
    votants?: number,
    nombres?: number[]
    pourcentages?: number[]
}

function Circonscriptions(props: CirconscriptionProps) {
    //   const { data: session } = useSession();
    const router = useRouter()
    const { annee } = router.query
    const [circonscription, setCirconscription] = useState<CirconscriptionI>({
        id_dep: "",
        nom: "",
        id_region: ""
    });

    const circonscriptions: CirconscriptionI[] = props.cirs
    const regions: RegionI[] = props.regs
    const elections: ElectionI[] = props.elects
    const zoneResults: ZoneResult[] = props.zoneResults
    const zoneResultsRegs: ZoneResult[] = props.zoneResultsRegs
    const [elect, setElect] = useState(elections.filter(elect => (elect.annee.toString() === annee))[0])

    const [voirReg, setVoirReg] = useState(false)
    const [enpourcent, setEnpourcent] = useState(false)


    const [depStats, setDepStats] = useState({
        id_dep: "",
        nom_dep: "",
        v_nuls: 0,
        nombres: new Map<string, number>(elect.candidats.map(ca => [ca?.nom_candidat || "ras", 0]))
    });
    /////////////////////////////////////

    const labelsCir = [...regions.reduce((a, reg) => {
        return a.concat(circonscriptions.filter(c => c.id_region === reg.id_region).map(c => c.nom))
    }, [])]

    // console.log(labelsCir)
    const labelsReg = [...regions.map(r => r.nom)]
    const labels = ["Non votants", "Bulletins nulls"].concat([...elect.candidats.map(ca => ca?.nom_candidat || "None")])


    const bground = ["#777777", "#cfcfcf"].concat([...elect.candidats.map(ca => ca?.color || "#111111")])

    const [zoneResult, setZoneResult] = useState<ZoneResult>(zoneResults[0])


    const [dataCircle, setDataCircle] = useState({
        labels: labels,
        datasets: [
            {
                label: 'Votes',
                data: zoneResult?.nombres,
                backgroundColor: bground,
                borderColor: [
                    '#ccccff',
                ],
                borderWidth: 1,
            },
        ],
    });


    const [dataf, setDataf] = useState({

        labels: labelsCir,
        datasets:
            [...labels.map((l, i) => {
                return {
                    label: l,
                    data: zoneResults.map(zr => {
                        if (zr.nombres) return zr.nombres[i] || 0
                    }).slice(1),
                    backgroundColor: bground[i],
                    borderWidth: 0,
                    stack: 1,
                }
            })
            ],
    }
    )

    const options = {
        plugins: {
            title: {
                display: true,
                // text: 'Resultat par circonscription',
            },
        },
        responsive: true,
        interaction: {
            mode: 'index' as const,
            intersect: false,
        },
        scales: {
            x: {
                stacked: true,
            },
            y: {
                stacked: true,
            },
        },
    };

    useEffect(() => {
        const dataf = voirReg ?
            {


                labels: labelsReg,
                datasets:
                    [...labels.map((l, i) => {
                        return {
                            label: enpourcent ? "(%) " + l : l,
                            data: enpourcent ? zoneResultsRegs.map(zrr => {
                                if (zrr.pourcentages) return zrr.pourcentages[i] || 0
                            }) : zoneResultsRegs.map(zrr => {
                                if (zrr.nombres) return zrr.nombres[i] || 0
                            }),
                            backgroundColor: bground[i],
                            borderWidth: 0,
                            stack: 1,
                        }
                    })
                    ],
            } : {

                labels: labelsCir,
                datasets:
                    [...labels.map((l, i) => {
                        return {
                            label: enpourcent ? "(%) " + l : l,
                            data: enpourcent ?
                                zoneResults.map(zr => {
                                    if (zr.pourcentages) return zr.pourcentages[i] || 0
                                }).slice(1)
                                :
                                zoneResults.map(zr => {
                                    if (zr.nombres) return zr.nombres[i] || 0
                                }).slice(1),
                            backgroundColor: bground[i],
                            borderWidth: 0,
                            stack: 1,
                        }
                    })
                    ],
            }
        setDataf({ ...dataf })

    }, [voirReg, enpourcent]
    )

    useEffect(() => {
        setDataCircle({
            labels: labels,
            datasets: [
                {
                    label: 'Votes',
                    data: zoneResult.nombres,
                    backgroundColor: bground,
                    borderColor: [
                        '#ccccff',
                    ],
                    borderWidth: 1,
                },
            ],
        })
        const cir = circonscriptions.find(c => c.id_dep === zoneResult.id_cir)

        if (cir != null) {
            setCirconscription(cir)
        }

    }, [zoneResult]
    )



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
        const id_dep = id.split('--')[0]
        const zoneResultSel = zoneResults.find(z => z.id_cir === id_dep)
        if (zoneResultSel != null) {
            setZoneResult({ ...zoneResultSel })
        }


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
    }

    const finirElection = () => {
        elect.etat = 2
        updateElection(elect._id, elect).then(() => {
            setElect({ ...elect })
        })
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

    return (
        <>

            {elect != null ? <>
                <div className="overflow-hidden bg-white rounded text-slate-500 shadow-slate-200 w-8/12 mx-auto">
                    <div className="p-6">
                        <h1 className=" text-3xl text-center font-bold text-secondary">
                            Resultats Electorales {elect.annee}
                        </h1>
                    </div>
                    <div className="flex justify-evenly mb-4">
                        {elect?.candidats.map((can, i) => {
                            const [ms, setMs] = useState(false)
                            return <>
                                <div
                                    className="relative cursor-pointer group hover:overflow-visible focus-visible:outline-none mb-14 mt-6"
                                    aria-describedby="tooltip-02"
                                >

                                    <img key={i} className="p-1 w-28 h-28 rounded-full ring-4" src={can.url_image} alt="Bordered avatar"
                                        onMouseEnter={() => { setMs(true) }}
                                        onMouseLeave={() => { setMs(false) }}
                                        style={{
                                            '--tw-ring-color': can?.color, background: ms ? can.color : ""
                                        }
                                        } />
                                    <span
                                        role="tooltip"
                                        id="tooltip-02"
                                        className="invisible absolute top-full left-1/2 z-40 mt-2 w-28 -translate-x-1/2 rounded bg-slate-700 p-4 text-sm text-white opacity-0 transition-all before:invisible before:absolute before:left-1/2 before:bottom-full before:z-40 before:mt-2 before:-ml-2 before:border-x-8 before:border-b-8 before:border-x-transparent before:border-b-slate-700 before:opacity-0 before:transition-all before:content-[''] group-hover:visible group-hover:block group-hover:opacity-100 group-hover:before:visible group-hover:before:opacity-100"
                                    >
                                        {can.nom_candidat}
                                    </span>

                                </div>
                            </>

                        })}
                    </div>

                </div>
                <MdOutlineMultilineChart title="Simuler les resultats" className="mx-auto mb-6 text-secondary hover:bg-blue-200 bg-blue-100 rounded-lg p-2 cursor-pointer" size={44} onClick={() => router.push('/admin/elections/' + elect.annee + '/simulation')} />

                <hr className="border-primary border-[1px] rounded-full mx-16" />
            </>
                : null
            }
            <div className="relative flex-wrap m-0 p-2 flex flex-row justify-between items-stretch mx-2 my-4  ">
                <div className="flex-1 m-auto flex flex-col border-r-primary border-r-2 border-b-secondary border-b-2 pt-4">
                    <MapSN handleClick2={handleClick} depSelected={zoneResult.id_cir} />
                </div>


                <div className="shrink mx-auto flex-1 flex flex-col justify-start ">
                    <div className="mb-2 flex flex-col justify-center">
                        <h3 className=" text-lg text-center font-bold text-secondary  inline-block ">
                            Resultats au niveau:
                        </h3>
                        <div className="relative inline-block m-auto">
                            <select
                                id="id-01"
                                name="id_circonscription"
                                className="peer relative h-10 w-full appearance-none border-b border-slate-200 bg-white px-4 text-sm text-slate-500 outline-none transition-all autofill:bg-white focus:border-emerald-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                                onChange={(event) => handleSelect(event)}
                                defaultValue={circonscription.id_dep}
                            >
                                <option value="tout" > Tout le Senegal </option>
                                {circonscriptions.map(c => {


                                    return <option key={c.id_dep} value={c.id_dep} selected={c.id_dep === circonscription.id_dep}>{c.nom} ({c.inscrits || 0} inscrits)
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
                    </div>

                    <Pie className="max-h-96" data={dataCircle} />

                </div>
            </div>

            <div className="relative flex-wrap m-0 p-2 flex flex-col justify-center items-center mx-2 my-2 mb-4 ">
                <label htmlFor="Toggle3" className="inline-flex items-center p-2 rounded-md cursor-pointer dark:text-gray-800">
                    <input id="Toggle3" type="checkbox" className="hidden peer" onChange={() => setVoirReg(!voirReg)} />
                    <span className="px-4 py-2 rounded-l-md bg-primary peer-checked:bg-gray-300">Departement</span>
                    <span className="px-4 py-2 rounded-r-md bg-gray-300 peer-checked:bg-primary">Regionnal</span>
                </label>

                <label htmlFor="default-toggle" className="inline-flex relative items-center cursor-pointer">
                    <input type="checkbox" value="" id="default-toggle" className="sr-only peer" onChange={() => setEnpourcent(!enpourcent)} />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none   rounded-full peer  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all  peer-checked:bg-blue-600"></div>
                    <span className="ml-3 text-sm font-medium text-secondary d">En pourcentages (%)</span>
                </label>

                <Bar className="" options={options} data={dataf} />

            </div>

            {elect.etat === 1 ? <div className="mx-auto flex justify-center">
                <button onClick={() => finirElection()} className="text-lg my-6 text-red-600 hover:bg-red-200 bg-red-100 rounded-sm py-2 px-5 cursor-pointer"  >Arreter</button>
            </div> : null}

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


    let zoneResults: ZoneResult[] =
        regs.reduce((a, reg) => {

            return a.concat(
                cirs.filter(c => c.id_region === reg.id_region).
                    map((cir) => {
                        const cands = elect.candidats
                        const v_exprimer = cands.map((c) => c.votes.find(v => cir.id_dep === v.dep_id)?.votants).reduce((a, v) => a = (a || 0) + (v || 0), 0) || 0
                        const v_nuls = elect.votes_nuls.find(vn => vn.dep_id === cir.id_dep)?.votants || 0
                        const inscrits = cir?.inscrits || 0
                        let zoneResult: ZoneResult = {
                            id_cir: cir.id_dep,
                            id_reg: cir.id_region,
                            inscrits: inscrits,
                            v_nuls: v_nuls,
                            votants: v_exprimer,
                            n_votants: inscrits - (v_exprimer + v_nuls)
                        }

                        const nombres = [...elect.candidats.map(ca => ca?.votes.reduce((a, v) => {
                            if (v.dep_id === cir.id_dep) return a = a + v.votants
                            return a
                        }, 0))]

                        zoneResult.nombres = [zoneResult.n_votants || 0, zoneResult.v_nuls || 0].concat(nombres)
                        zoneResult.pourcentages = zoneResult.nombres.map(n => (n * 100) / ((zoneResult.inscrits || n) + 1))
                        // if (zoneResult.id_cir === "dep-dakar") {
                        //     console.log(zoneResult)
                        // }

                        return zoneResult

                    }))
        }, [])


    const zoneResultsRegs = regs.map(reg => {
        const total_inscits = zoneResults.reduce((a, v) => {
            if (v.id_reg === reg.id_region) return a = a + (v.inscrits || 0)
            return a
        }, 0)
        const total_n_votants = zoneResults.reduce((a, v) => {
            if (v.id_reg === reg.id_region) return a = a + (v.n_votants || 0)
            return a
        }, 0)
        const total_votants = zoneResults.reduce((a, v) => {
            if (v.id_reg === reg.id_region) return a = a + (v.votants || 0)
            return a
        }, 0)
        const total_v_nuls = zoneResults.reduce((a, v) => {
            if (v.id_reg === reg.id_region) return a = a + (v.v_nuls || 0)
            return a
        }, 0)
        let zoneResultsReg: ZoneResult = {
            id_cir: reg.id_region,
            inscrits: total_inscits,
            n_votants: total_n_votants,
            votants: total_votants,
            v_nuls: total_v_nuls
        }

        const nombres = elect.candidats.map((e, i) => {
            // console.log(e.nom_candidat, i)
            const n = zoneResults.reduce((a, v) => {
                if (v.id_reg === reg.id_region) return a = a + (v.nombres[i + 2] || 0)
                return a
            }, 0)
            return n
        })

        zoneResultsReg.nombres = [zoneResultsReg.n_votants || 0, zoneResultsReg.v_nuls || 0].concat(nombres)
        zoneResultsReg.pourcentages = zoneResultsReg.nombres.map(n => (n * 100) / ((zoneResultsReg.inscrits || n) + 1))

        return zoneResultsReg



    })

    const total_inscits = zoneResults.reduce((a, v) => a = a + (v.inscrits || 0), 0)
    const total_n_votants = zoneResults.reduce((a, v) => a = a + (v.n_votants || 0), 0)
    const total_votants = zoneResults.reduce((a, v) => a = a + (v.votants || 0), 0)
    const total_v_nuls = zoneResults.reduce((a, v) => a = a + (v.v_nuls || 0), 0)


    let zoneSN: ZoneResult = {
        id_cir: "tout",
        inscrits: total_inscits,
        n_votants: total_n_votants,
        votants: total_votants,
        v_nuls: total_v_nuls
    }

    const nombres = elect.candidats.map((e, i) => {
        // console.log(e.nom_candidat, i)
        const n = zoneResults.reduce((a, v) => a = a + (v.nombres[i + 2] || 0), 0)
        return n
    })

    zoneSN.nombres = [zoneSN.n_votants || 0, zoneSN.v_nuls || 0].concat(nombres)

    zoneSN.pourcentages = zoneSN.nombres.map(n => (n * 100) / ((zoneSN.inscrits || n) + 1))

    zoneResults = [zoneSN].concat(zoneResults)


    return { props: { cirs, regs, elects, zoneResults, zoneResultsRegs } }
}

export default Circonscriptions;
