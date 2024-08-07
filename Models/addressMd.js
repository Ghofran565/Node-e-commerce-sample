import mongoose from 'mongoose';
const addressSchema = new mongoose.Schema(
	{
		fullAddress: {
			type: String,
			required: [true, 'FullAddress is required.'],
		},
		city: {
			type: String,
			required: [true, 'City is required.'],
		},
		state: {
         type: String,
			required: [true, 'State is required.'],
		},
		plaque: {
         type: String,
			required: [true, 'Plaque is required.'],
		},
      postalCode: {
         type: String,
         required: [true, 'PostalCode is required.'],
         //TODO adding a postal regex
      },
      userId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
      },
		receirverName: {
			type: String,
			required: [true, 'ReceirverName is required.'],
		},
		receirverPhone: {
			type: String,
         required: [true, 'ReceirverPhone is required.'],
         match: [
            /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/gi,
            "Phone is invalid.",
          ],
		},
		isActive:{
			type:Boolean,
			default:true
		}
	},
	{ timestamps: true }
);

const Address = mongoose.model('Address', addressSchema);
export default Address;
