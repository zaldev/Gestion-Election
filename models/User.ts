import { InferSchemaType, Schema, models, model, Types } from "mongoose";

// const Schema = Schema;

const userSchema = new Schema({
  _id: {
    type: Types.ObjectId,
    index: true,
    auto: true,
  },
  cni: {
    type: String,
    required: [true, "Le CNI est indispensable"],
    unique: true,

  },
  password: {
    type: String,
    required: true,
  }, admin: {
    type: Boolean,
    default: false
  },
  prenom: {
    type: String,
    required: true,
  },
  nom: {
    type: String,
    required: true,
  },
  url_img: {
    type: String,
  },
  date_naissance: {
    type: String,
    required: true,
  },
  lieu_naissance: {
    type: String,
    required: true,
  },
  addresse: {
    type: String,
    required: true,
  },
  id_circonscription: {
    type: String,
    required: true,
  },
  elections_vote: {
    type: [String]
  },

});

export type UserI = InferSchemaType<typeof userSchema>;
const User = models.User || model("User", userSchema);
// User.schema.methods.avoter= function(id_elect:string){
//     return this.find
//   };

export default User;