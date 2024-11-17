// import mongoose, {Schema} from "mongoose";

// const subscriptionSchema = new Schema({
//     subscriber: {
//         type: Schema.Types.ObjectId,
//         ref: "User"
//     },
//     channel: {
//         type: Schema.Types.ObjectId,
//         ref: "User"
//     }
// }, {timestamps: true})

// export const Subscription = mongoose.model("Subscription", subscriptionSchema)


// models/subscriptionModel.js
import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema(
  {
    subscriber: {
      type: Schema.Types.ObjectId,
      ref: "User",  // Ensure this points to the correct model name
      required: true,
      default: 5
    },
    subscribedTo: {
      type: Schema.Types.ObjectId,
      ref: "Channel",  // The channel that is being subscribed to
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Subscription = mongoose.model("Subscription", subscriptionSchema);

