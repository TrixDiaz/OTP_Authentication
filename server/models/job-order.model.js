import mongoose from "mongoose";

const jobOrderSchema = new mongoose.Schema(
  {
    customer: {
      company: {type: String},
      contact_person: {type: String},
      department: {type: String},
      telno: {type: String},
      address: {type: String},
      attachments: {type: String},
      customer_user_id: {type: String},
      remarks: {type: String},
      sign_approve: {type: Boolean, default: false},
    },
    engineer: {
      remarks: {type: String},
      attachments: {type: String},
      sign_approve: {type: Boolean, default: false},
      engineer_user_id: {
        type: String,
      },
    },
    order_no: {type: String},
    date_request: {type: Date},
    date_started: {type: Date},
    date_finish: {type: Date},
    status: {type: String},
  },
  {
    timestamps: true,
    strict: false,
  }
);

const JobOrder = mongoose.model("JobOrder", jobOrderSchema);

export default JobOrder;
