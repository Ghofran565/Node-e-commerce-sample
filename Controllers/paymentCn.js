import catchAsync from "../Utils/catchAsync.js";
import HandleError from "../Utils/handleError.js";
import User from "../Models/userMd.js";
import DiscountCode from "../Models/discountCodeMd.js";

export const payment = catchAsync(async (req, res, next) => {
  const { discountCode: bodydiscount } = req.body;
  if (bodydiscount) {
    const discountCode = await DiscountCode.find({ code: bodydiscount });
    if (!discountCode) {
      return next(new HandleError(`discountCode not found.`, 404));
    }
    if(discountCode.startTime >= Date.now()){ //? work right ?
      //!
    }
    if(discountCode.expireTime <= Date.now()){ //? work right ?
      //!
    }
    ////////////       
  }
  //! continue

  return res.status(200).json({
    success: true,
    data: { categories },
  });
});

export const getOneCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category) {
    return next(new HandleError(`Category with ID ${id} not found.`, 404));
  }
  return res.status(200).json({
    success: true,
    data: { category },
  });
});

export const createCategory = catchAsync(async (req, res, next) => {
  const newCategory = await Category.create(req.body);
  return res.status(200).json({
    success: true,
    message: "Category created successfully.",
    data: { newCategory },
  });
});

export const updateCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updatedCategory = await Category.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!updatedCategory) {
    return next(new HandleError(`Category with ID ${id} not found.`, 404));
  }
  return res.status(200).json({
    success: true,
    message: `Category with ID ${id} updated successfully.`,
    data: { updatedCategory },
  });
});

export const deleteCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const deletedCategory = await Category.findByIdAndDelete(id);
  if (!deletedCategory) {
    return next(new HandleError(`Category with ID ${id} not found.`, 404));
  }

  fs.unlinkSync(`${__dirname}/public/${deletedCategory.image}`);

  await Product.updateMany({ categoryId: id }, { $set: { categoryId: "" } });

  return res.status(200).json({
    success: true,
    message: `Category with ID ${id} deleted successfully.`,
    data: { deletedCategory },
  });
});
