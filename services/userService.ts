import axios from "axios";

import { UserI } from "../models/User";

const content_type = 'application/json'

export async function ajouterUser(UserI: UserI) {
    // voirUser(UserI.cni).then(async data => {
        // if (data.data.data == null) {
            return await axios.post(
                "http://localhost:3000/api/users",
                UserI,
                {
                    headers: {
                        "Content-Type": content_type,
                    },
                },
            ).catch(err =>console.log(err))
    //     }
    // })


}

export async function seConnecter(userCred:Object) {
    // voirUser(UserI.cni).then(async data => {
        // if (data.data.data == null) {
            return await axios.post(
                "http://localhost:3000/api/auth",
                userCred,
                {
                    headers: {
                        "Content-Type": content_type,
                    },
                },
            ).catch(err =>console.log(err))
    //     }
    // })


}


export async function voirUsers() {
    return await axios.get(
        "http://localhost:3000/api/users",
        {
            headers: {
                "Content-Type": content_type,
            },
        },
    )
}

export async function voirUser(id: string) {
    return await axios.get(
        "http://localhost:3000/api/users/" + id,
        {
            headers: {
                "Content-Type": content_type,
            },
        },
    )
}


export async function updateUser(id: string, UserI: UserI) {
    
    // UserI._id=undefined
    return await axios.put(

        "http://localhost:3000/api/users/" + id,
        UserI,
        {
            headers: {
                "Content-Type": content_type,
            },
        },
    )
}


