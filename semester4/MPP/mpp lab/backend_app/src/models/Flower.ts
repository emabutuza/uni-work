import mongoose, { Schema, Document } from 'mongoose';

export interface IFlower extends Document {
  name: string;
  price: number;
  description: string;
  category: string;
  imageUrl: string;
  brand: string;
  event: 'Wedding' | 'Anniversaries' | 'Holidays' | 'Other';
  createdAt: Date;
}

const FlowerSchema: Schema = new Schema(
  {
    name: { 
      type: String, 
      required: [true, 'Name is required'], 
      trim: true 
    },
    price: { 
      type: Number, 
      required: [true, 'Price is required'], 
      min: [0, 'Price cannot be negative'] 
    },
    description: { 
      type: String, 
      required: [true, 'Description is required'], 
      trim: true 
    },
    category: { 
      type: String, 
      required: [true, 'Category is required'], 
      trim: true 
    },
    imageUrl: { 
      type: String, 
      required: [true, 'Image URL is required'] 
    },
    brand: { 
      type: String, 
      required: [true, 'Brand is required'], 
      trim: true 
    },
    event: { 
      type: String, 
      enum: ['Wedding', 'Anniversaries', 'Holidays', 'Other'], 
      required: [true, 'Event is required'] 
    },
    createdAt: { 
      type: Date, 
      default: Date.now 
    }
  },
  { 
    timestamps: true,
    toJSON: { 
      virtuals: true,
      transform: (_, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    } 
  }
);

export default mongoose.model<IFlower>('Flower', FlowerSchema); 