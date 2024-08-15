//* continue!! 9th session
import OrderHistory from "../Models/orderHistoryMd"

export const getAllOrderHistory = catchAsync(async (req, res, next) => {
  const { role, id: userId } = req.decodedToken;
  const {id} = req?.params
  const order = await OrderHistory.findById(id)
  if(role == 'admin'){

  }
});
