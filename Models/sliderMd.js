import mongoose from 'mongoose';
const sliderSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, 'Title is required.'],
		},
		image: {
			type: String,
			required: [true, 'Image is required.'],
		},
		href: {
			type: String,
		},
      position:{
         type:String,
         trim:true,
			//TODO serach about "trim"
         default: 'home'
      }
	},
	{ timestamps: true }
);

const Slider = mongoose.model('Slider', sliderSchema);
export default Slider;
