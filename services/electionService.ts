import { ElectionI } from './../models/Election';
import axios from "axios";


const content_type = 'application/json'

export async function ajouterElection(election: ElectionI) {
    // voirUser(UserI.cni).then(async data => {
    // if (data.data.data == null) {
    return await axios.post(
        "http://localhost:3000/api/elections",
        election,
        {
            headers: {
                "Content-Type": content_type,
            },
        },
    ).catch(err => console.log(err))
}

export async function voirElections() {
    return await axios.get(
        "http://localhost:3000/api/elections",
        {
            headers: {
                "Content-Type": content_type,
            },
        },
    )
}

export async function voirElection(id: string) {
    return await axios.get(
        "http://localhost:3000/api/elections/" + id,
        {
            headers: {
                "Content-Type": content_type,
            },
        },
    )
}

export async function updateElection(id: string, election: ElectionI) {
    
    // election._id=undefined
    return await axios.put(

        "http://localhost:3000/api/elections/" + id,
        election,
        {
            headers: {
                "Content-Type": content_type,
            },
        },
    )
}

export async function deleteElection(id: string) {
    return await axios.delete(

        "http://localhost:3000/api/elections/" + id,
        {
            headers: {
                "Content-Type": content_type,
            },
        },
    )
}
