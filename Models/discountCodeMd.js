import mongoose from "mongoose";
const discountCodeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Code is required."],
      unique: [true, "Code cannot be used twice"],
    },
    startTime: {
      type: String,
      required: [true, "StartTime is required."],
    },
    expireTime: {
      type: String,
      required: [true, "ExpireTime is required."],
    },
    discount: {
      type: Number,
      min: 0,
      max: 100,
      required: [true, "Discount is required."],
    },
    minOrder: {
      type: Number,
      default: 0,
    },
    freeDelivery: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const DiscountCode = mongoose.model("DiscountCode", discountCodeSchema);
export default DiscountCode;
