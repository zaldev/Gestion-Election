import { InferSchemaType, model, models, Schema, Types } from "mongoose";


const candidatSchema = new Schema({
  _id: {
    type: Types.ObjectId,
    index: true,
    auto: true,
  },
  id_user: {
    type: String,
    required: true,
    unique: true,
  },
  partie: {
    type: String,
    required: true,
  },
  
});
export type CandidatI = InferSchemaType<typeof candidatSchema>;

const Candidat = models.Candidat || model("Candidat", candidatSchema);
export default Candidat;