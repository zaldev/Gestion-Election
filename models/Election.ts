import { ElectionI } from './Election';
import { InferSchemaType, model, models, Schema, Types } from "mongoose";


const electionSchema = new Schema({
  _id: {
    type: Types.ObjectId,
    index: true,
    auto: true,
  },
  annee: {
    type: String,
    required: true,

  },
  etat: {
    type: Number,
    default: 0,
  },
  electeurs:{
    type:[String]
  },
  votes_nuls: [{
    dep_id: String,
    votants: {
      type: Number,
      default: 0
    }
  }],
  candidats: [{
    nom_candidat: String,
    partie: String,
    url_image:String,
    color:String,
    votes: [{
      dep_id: String,
      votants: {
        type: Number,
        default: 0
      }
    }]
  }],

}, {
  methods: {
    voter(department_id, candidat_id) {
      // let cand = this.votes?.find(department_id)?.candidats.find(candidat_id);
      // if (cand?.votes) cand.votes += 1;

    }
  },
});
export type ElectionI = InferSchemaType<typeof electionSchema>;


const Election = models.Election || model("Election", electionSchema);
export default Election;