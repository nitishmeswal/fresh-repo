import mongoose from "mongoose";
import { z } from "zod";


const gpuModel = z.object({
    gpuModel: z.string().min(8, "Model must have at least 8 characters"),
    host: z.string(),
    location: z.string(),
    imgSrc: z.string(),
    computeMode: z.number(),
    cores: z.number().default(0),
    gpuMemory: z.string().default("0 GB"),
    maxCudaVersion: z.string(),
    cpuModel: z.string(),
    totalMemory: z.string().default("0 GB"),
    storageSpeed: z.string().default("0 MB/s"),
    storageSize: z.string().default("0 GB"),
    motherboard: z.string(),
    smClock: z.string(),
    rentPrice: z.string(),
});

const cpuSchema = new mongoose.Schema({
    gpuModel: { type: String, required: true, minlength: 8 },
    host: { type: String, required: true },
    location: { type: String, required: true },
    imgSrc: { type: String, required: true },
    computeMode: { type: Number, required: true },
    cores: { type: Number, default: 0 },
    gpuMemory: { type: String, default: "0 GB" },
    maxCudaVersion: { type: String, required: true },
    cpuModel: { type: String, required: true },
    totalMemory: { type: String, default: "0 GB" },
    storageSpeed: { type: String, default: "0 MB/s" },
    storageSize: { type: String, default: "0 GB" },
    motherboard: { type: String, required: true },
    smClock: { type: String, required: true },
    rentPrice: { type: String, required: true },
});

const CpuModel = mongoose.model("CpuModel", cpuSchema);

export { CpuModel };