
import { InferSchemaType, model, models, Schema, Types } from "mongoose";
import Region from "./Region";


const circonscriptionSchema = new Schema({
  _id: {
    type: Types.ObjectId,
    index: true,
    auto: true,
  },
  id_dep: {
    type: String,
    required: true,
    unique: true,
  },
  nom: {
    type: String,
    required: true,
    unique: true,
  },
  id_region:{
    type:String,
    required:true
  },
  inscrits:{
    type:Number,
    Default:0
  }
  // elections:[{
  //   election_id:String,
  //   candidats:[{candidat_id:String,votes:Number}]
  // }]
},
// {
//   statics:{
//     findAllCirconscription(){
//       return this.find({});
    
//     }
//   }
// }
);
export type CirconscriptionI = InferSchemaType<typeof circonscriptionSchema>;
const Circonscription = models.Circonscription ||  model("Circonscription", circonscriptionSchema);
export default Circonscription;