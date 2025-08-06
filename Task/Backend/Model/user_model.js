// import mongoose from "mongoose";

// const userSchema=new mongoose.Schema({
//     userName:{
//         type:String,
//         required:true,
//         unique:true,
//     },
//     password:{
//         type:String,
//         required:true,
//         minLength:8,
//     }, 
//     // timestamps give created at and updated at;
// },{timestamps:true});

// const User=mongoose.model("User",userSchema);

// export default User;

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
