import { CirconscriptionI } from './../models/Circonscription';
import Circonscription from "../models/Circonscription"

 const circonscription:CirconscriptionI[] = [{
    "id_dep": "dep_gossas",
    "nom": "Gossas",
    "id_region": "reg_fatick",
  },{
    "id_dep": "dep_fatick",
    "nom": "Fatick",
    "id_region": "reg_fatick",
    // "__v": 0
  },{
    "id_dep": "dep_dakar",
    "nom": "Dakar",
    "id_region": "reg_dakar",
  },{
    "id_dep": "dep_thies",
    "nom": "Thies",
    "id_region": "reg_thies",
  }]

export  function voirCirconscriptions() {
    return circonscription;
}

export async function voirCirconscription(id:string) {
    circonscription.map((cir)=>{
        if (cir.id_dep==id) return cir
    } )
    return "Erreur"
}

