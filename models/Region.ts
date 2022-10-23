import { InferSchemaType, model, models, Schema, Types } from "mongoose";


const regionSchema = new Schema({
  _id: {
    type: Types.ObjectId,
    index: true,
    auto: true,
  },
  id_region:{
    type:String,
    required:true
  },
  nom: {
    type: String,
    required: true,
    unique: true,
  },
  
  id_deps: {
    type: [String],
  },
  // elections:[{
  //   election_id:String,
  //   candidats:[{candidat_id:String,votes:Number}]
  // }]
},
{
  statics:{
    findAllRegion(){
      return this.find({});
    
    }
  }
});
export type RegionI = InferSchemaType<typeof regionSchema>;
const Region = models.Region || model("Region", regionSchema);
export default Region;