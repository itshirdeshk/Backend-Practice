import mongoose from "mongoose";

const medicalRecordSchema = new mongoose.Schema({
  
}, {timestamps: true});

export const medicalRecordSchema = mongoose.model("Medical Record", medicalRecordSchema);