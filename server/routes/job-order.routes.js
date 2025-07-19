import {Router} from "express";
import {
  getAllJobOrders,
  getJobOrderById,
  createJobOrder,
  updateJobOrder,
  deleteJobOrder,
} from "../controllers/job-order.controller.js";

const jobOrderRouter = Router();

jobOrderRouter.get("/", getAllJobOrders);
jobOrderRouter.get("/:id", getJobOrderById);
jobOrderRouter.post("/", createJobOrder);
jobOrderRouter.put("/:id", updateJobOrder);
jobOrderRouter.delete("/:id", deleteJobOrder);

export default jobOrderRouter;
