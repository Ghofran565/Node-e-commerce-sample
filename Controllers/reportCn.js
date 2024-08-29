//* continue!! 9th session

import fs from "fs";
import { __dirname } from "../app.js";
import catchAsync from "../Utils/catchAsync.js";
import ApiFeatures from "../Utils/apiFeatures.js";
import HandleError from "../Utils/handleError.js";
import Category from "../Models/categoryMd.js";
import User from "../Models/userMd.js";

export const report = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category) {
    return next(new HandleError("Category not found", 404));
    //!!!!
  }
  const user = await User.findById(category.user);
  if (!user) {

    return next(new HandleError("User not found", 404));
  }

  const categories = await User.find(); //* continue!! 9th session
  return res.status(200).json({
    success: true,
    data: { categories },
  });
});
export const report1 = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category) {
    return next(new HandleError("Category not found", 404));
    //!!!!
  }
  const user = await User.findById(category.user);
  if (!user) {

    return next(new HandleError("User not found", 404));
  }

  const categories = await User.find(); //* continue!! 9th session
  return res.status(200).json({
    success: true,
    data: { categories },
  });
});
export const report2 = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category) {
    return next(new HandleError("Category not found", 404));
    //!!!!
  }
  const user = await User.findById(category.user);
  if (!user) {

    return next(new HandleError("User not found", 404));
  }

  const categories = await User.find(); //* continue!! 9th session
  return res.status(200).json({
    success: true,
    data: { categories },
  });
});
