import mongoose from "mongoose";
const Schema = mongoose.Schema;
import passportLocalMongoose from "passport-local-mongoose";

const userSchema = new Schema({
  profileCompleted: {
    type: Boolean,
    default: false,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNo: {
    type: String,
  },
  name: {
    firstName: String,
    lastName: String,
  },
  address: [
    {
      houseNo: Number,
      street: String,
      landmark: String,
      city: String,
      country: String,
      pinCode: Number,
    },
  ],
  avatar: {
    type: String,
    default: "/Profile_Photo.jpg",
  },
});

userSchema.plugin(passportLocalMongoose);

const user = mongoose.model("User", userSchema);
export default user;
