import mongoose from "mongoose";

const ModelSchema = new mongoose.Schema({
    id: {
        type: String,
    },
    modelId: {
       type: String,
         required: [true, 'Please provide a model id'],
    },
    userId: {
        type: String,
        required: [true, 'Please provide a user id'],
    },
    gpuServiceId: {
        type: String,
        default: null,
    },
    active: {
        type: Boolean,
        default: true,
    },
    totalHours: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
})

export interface ModelServiceType {
    id: string;
    modelId: string;
    userId: string;
    active: boolean;
    totalHours: number;
    createdAt: Date;
    updatedAt: Date;
}

export default mongoose.model('ModelService', ModelSchema);