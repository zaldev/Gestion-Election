import { RegionI } from './../models/Region';
import { CirconscriptionI } from './../models/Circonscription';
import axios from "axios";

const content_type = 'application/json'

export async function ajouterCirconscripton(circonscriptionEntity: CirconscriptionI) {
    voirCirconscription(circonscriptionEntity.id_dep).then(async data => {
        if (data.data.data == null) {
            return await axios.post(
                "http://localhost:3000/api/circonscriptions",
                circonscriptionEntity,
                {
                    headers: {
                        "Content-Type": content_type,
                    },
                },
            ).then(async data => {
                const rnom = circonscriptionEntity.id_region.split("-")[1].split('_').map((no) =>
                    no.charAt(0).toUpperCase() + no.slice(1)).join(' ')
                
                voirRegion(circonscriptionEntity.id_region).then(data => {
                    if (data.data.data == null) ajouterRegion({ id_region: circonscriptionEntity.id_region, nom: rnom, id_deps: [circonscriptionEntity.id_dep] })
                    else {
                        const region: RegionI = data.data.data
                        if ( !region.id_deps.includes(circonscriptionEntity.id_dep)) {
                            region.id_deps.push(circonscriptionEntity.id_dep)
                            

                            region._id ? updateRegion(region._id.toString(), region) : "ras"

                        }
                    }

                })
            }
            );
        }
    })


}

export async function ajouterRegion(region: RegionI) {
    return await axios.post(
        "http://localhost:3000/api/regions",
        region,
        {
            headers: {
                "Content-Type": content_type,
            },
        },
    )
}

export async function voirCirconscriptions() {
    return await axios.get(
        "http://localhost:3000/api/circonscriptions",
        {
            headers: {
                "Content-Type": content_type,
            },
        },
    )
}

export async function voirCirconscription(id: string) {
    return await axios.get(
        "http://localhost:3000/api/circonscriptions/" + id,
        {
            headers: {
                "Content-Type": content_type,
            },
        },
    )
}
export async function voirRegion(id: string) {
    return await axios.get(
        "http://localhost:3000/api/regions/" + id,
        {
            headers: {
                "Content-Type": content_type,
            },
        },
    )
}

export async function updateRegion(id: string, region: RegionI) {
    
    region._id=undefined
    return await axios.put(

        "http://localhost:3000/api/regions/" + id,
        region,
        {
            headers: {
                "Content-Type": content_type,
            },
        },
    )
}

export async function voirRegions() {
    return await axios.get(
        "http://localhost:3000/api/regions",
        {
            headers: {
                "Content-Type": content_type,
            },
        },
    )
}

