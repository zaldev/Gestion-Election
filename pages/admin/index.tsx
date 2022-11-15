import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import NavAdmin from '../../components/NavAdmin/NavAdmin'

function DashBoard() {
    const { data: session } = useSession()
    const router = useRouter()
    return (
        <>

            <div className="flex flex-row gap-8 justify-evenly px-10 py-4">
                <div className="relative w-full max-w-sm mx-auto mt-20 text-center bg-white rounded shadow-lg shadow-slate-20 lg:max-md-full group text-slate-500">
                    <img
                        src="/undraw_map_dark_re_36sy.svg"
                        alt="emerald"
                        className="absolute left-1/2 block w-32 -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_16px_16px_#73e7ff6b] transition-transform duration-700 group-hover:-translate-y-2/3"
                    />
                    <div className="flex flex-col">
                        <header className="flex flex-col gap-6 p-6 pt-28 text-slate-400">
                            <h3 className="text-xl font-medium uppercase text-emerald-500">
                                Circonscriptions
                            </h3>
                        </header>
                        <div className="w-3 h-3 mx-auto rounded-full bg-emerald-500"></div>
                        <div className="p-6">
                            <ul className="space-y-4 ">
                                <li className="w-full gap-2"><span className='text-lg text-emerald-500'>14</span> Regions</li>
                                <li className="w-full gap-2"><span className='text-lg text-emerald-500'>45</span> Departements</li>
                                <li className="w-full gap-2"><span className='text-lg text-emerald-500'>6 919</span> Centres</li>
                                <li className="w-full gap-2"><span className='text-lg text-emerald-500'>15 397</span> Bureaux</li>
                            </ul>
                        </div>
                        <footer>
                            <button className="inline-flex items-center justify-center h-12 gap-2 px-6 text-sm font-medium tracking-wide text-white transition duration-300 translate-y-1/2 rounded shadow-xl whitespace-nowrap bg-emerald-500 shadow-emerald-100 hover:bg-emerald-600 focus:bg-emerald-700 focus-visible:outline-none"
                                onClick={() => router.push("/admin/circonscriptions")}>
                                Consulter
                            </button>
                        </footer>
                    </div>
                </div>
                {/*<!-- End Gem Pricing Table Emerald Variation --> */}

                {/*<!-- Component: Gem Pricing Table Diamond Variation --> */}
                <div className="relative w-full max-w-sm mx-auto mt-20 text-center bg-white rounded shadow-lg shadow-slate-20 lg:max-md-full group text-slate-500">
                    <img
                        src="/undraw_people_re_8spw.svg"
                        alt="diamond"
                        className="absolute left-1/2 block w-32 -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_16px_16px_#73e7ff6b] transition-transform duration-700 group-hover:-translate-y-2/3"
                    />
                    <div className="flex flex-col">
                        <header className="flex flex-col gap-6 p-6 pt-28 text-slate-400">
                            <h3 className="text-xl font-medium uppercase text-cyan-500">
                                Population
                            </h3>
                        </header>
                        <div className="w-3 h-3 mx-auto rounded-full bg-cyan-500"></div>
                        <div className="p-6">
                            <ul className="space-y-4">
                                <li className="w-full gap-2"><span className='text-lg text-cyan-500'>+ 15M</span> habitants</li>
                                <li className="w-full gap-2"><span className='text-lg text-cyan-500'>+ 6M</span> Electeurs</li>
                                <li className="w-full gap-2">--</li>
                                <li className="w-full gap-2">--</li>
                            </ul>
                        </div>
                        <footer>
                            <button className="inline-flex items-center justify-center h-12 gap-2 px-6 text-sm font-medium tracking-wide text-white transition duration-300 translate-y-1/2 rounded shadow-xl whitespace-nowrap bg-cyan-500 shadow-cyan-100 hover:bg-cyan-600 focus:bg-cyan-700 focus-visible:outline-none"
                                onClick={() => router.push("/admin/utilisateurs")}>
                                Consulter
                            </button>
                        </footer>
                    </div>
                </div>
                {/*<!-- End Gem Pricing Table Diamond Variation --> */}





                {/*<!-- Component: Gem Pricing Table Ruby Variation --> */}
                <div className="relative w-full max-w-sm mx-auto mt-20 text-center bg-white rounded shadow-lg shadow-slate-20 lg:max-md-full group text-slate-500">
                    <img
                        src="/undraw_preferences_re_49in.svg"
                        alt="emerald"
                        className="absolute left-1/2 block w-32 -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_16px_16px_#e73b3a40] transition-transform duration-700 group-hover:-translate-y-2/3"
                    />
                    <div className="flex flex-col">
                        <header className="flex flex-col gap-6 p-6 pt-28 text-slate-400">
                            <h3 className="text-xl font-medium text-red-500 uppercase">Elections</h3>
                        </header>
                        <div className="w-3 h-3 mx-auto bg-red-500 rounded-full"></div>
                        <div className="p-6">
                            <ul className="space-y-4">
                                <li className="w-full gap-2"><span className='text-lg text-red-500'>1</span> En cours</li>
                                <li className="w-full gap-2"><span className='text-lg text-red-500'>2</span> A venir</li>
                                <li className="w-full gap-2"><span className='text-lg text-red-500'>1</span> Passe</li>
                                <li className="w-full gap-2">--</li>
                            </ul>
                        </div>
                        <footer>
                            <button className="inline-flex items-center justify-center h-12 gap-2 px-6 text-sm font-medium tracking-wide text-white transition duration-300 translate-y-1/2 bg-red-500 rounded shadow-xl whitespace-nowrap shadow-red-100 hover:bg-red-600 focus:bg-red-700 focus-visible:outline-none"
                                onClick={() => router.push("/admin/elections")}>
                                Consulter
                            </button>
                        </footer>
                    </div>
                </div>
                {/*<!-- End Gem Pricing Table Ruby Variation --> */}




            </div>
        </>
    )
}

export default DashBoard