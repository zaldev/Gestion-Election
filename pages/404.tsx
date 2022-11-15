import Link from 'next/link'
import { useRouter } from 'next/router'

export default function FourOhFour() {
    const router = useRouter()
    return <>
        <section className="flex items-center h-full p-16 ">
            <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8">
                <div className="max-w-md text-center">
                    <h2 className="mb-8 font-extrabold text-9xl text-secondary">
                        <span className="sr-only">Erreur</span>404
                    </h2>
                    <p className="text-2xl font-semibold md:text-3xl">Desole nous ne pouvons pas trouver ce page.</p>
                    <p className="mt-4 mb-8 ">Vous pouvez reessayer autrement.</p>
                    <Link href="/">
                        <a rel="noopener noreferrer" className="px-8 py-3 bg-primary font-semibold rounded ">Retour a l'acceuil</a>
                    </Link>
                </div>
            </div>
        </section>

    </>
}