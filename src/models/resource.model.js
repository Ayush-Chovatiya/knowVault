import mongoose from "mongoose";

const resourseSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: "general",
    },
    tags: [
      {
        type: String,
      },
    ],
    notes: {
      type: String,
    },
    isFav: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  },
);

const Resource = mongoose.model("Resource", resourseSchema);
export default Resource;
