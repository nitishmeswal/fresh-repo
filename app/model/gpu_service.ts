import mongoose from "mongoose";

const GPUserviceModel = new mongoose.Schema({
    id: {
        type: String,
    },
    gpuId: {
        type: String,
        required: [true, 'Please provide a gpu id'],
    },
    userId: {
        type: String,
        required: [true, 'Please provide a user id'],
    },
    active: {
        type: Boolean,
        default: true,
    },
    modelServiceId: {
        type: String,
        default: null,
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

export interface GPUserviceType {
    id: string;
    gpuId: string;
    userId: string;
    active: boolean;
    modelServiceId: string;
    totalHours: number;
    createdAt: Date;
    updatedAt: Date;
}

export default mongoose.model('GPUservice', GPUserviceModel);