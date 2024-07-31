import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  totalPrice: {
    type: Number,
    default: 0,
  },
  items: [
    {
      ProductId: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: [true, "ProductId is required."],
      },
      quantity: { type: Number, required: [true, "Quantity is required."] },
      productVariantId: {
        type: mongoose.Schema.ObjectId,
        ref: "ProductVariant",
        required: [true, "ProductVariantId is required."],
      },
    },
  ],
});

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    nationalId: {
      type: String,
      match: [/^[0-9]{10}$/g, "NationalId is invalid."],
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: [true, "Email already exists."],
      match: [/[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/g, "Email is invalid."],
    },
    phone: {
      type: String,
      unique: [true, "Phone already exists."],
      match: [
        /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/gi,
        "Phone is invalid.",
      ],
    },
    password: {
      type: String,
    },
    recentlyProduct: {
      type: Array,
      default: [],
    },
    usedDiscountCode: {
      type: Array,
      default: [],
    },
    favoriteProducts: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    },
    isComplete: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin", "superAdmin"],
    },
    cart: cartSchema,
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
