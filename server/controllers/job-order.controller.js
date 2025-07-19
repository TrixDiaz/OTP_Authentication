import JobOrder from "../models/job-order.model.js";

// GET /job-orders → Get all job orders
export const getAllJobOrders = async (req, res, next) => {
  try {
    const jobOrders = await JobOrder.find();
    res.status(200).json({success: true, jobOrders});
  } catch (error) {
    next(error);
  }

  // filter by date or descending order
};

// GET /job-orders/:id → Get a specific job order
export const getJobOrderById = async (req, res, next) => {
  try {
    const {id} = req.params;
    const jobOrder = await JobOrder.findById(id);

    if (!jobOrder) {
      return res
        .status(404)
        .json({success: false, message: "Job order not found"});
    }

    res.status(200).json({success: true, jobOrder});
  } catch (error) {
    next(error);
  }
};

// POST /job-orders → Create a new job order
export const createJobOrder = async (req, res, next) => {
  try {
    const newJobOrder = new JobOrder(req.body);
    await newJobOrder.save();
    res.status(201).json({
      success: true,
      message: "Job order created",
      jobOrder: newJobOrder,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /job-orders/:id → Update a job order
export const updateJobOrder = async (req, res, next) => {
  try {
    const {id} = req.params;
    const updatedJobOrder = await JobOrder.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedJobOrder) {
      return res
        .status(404)
        .json({success: false, message: "Job order not found"});
    }

    res.status(200).json({
      success: true,
      message: "Job order updated",
      jobOrder: updatedJobOrder,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /job-orders/:id → Delete a job order
export const deleteJobOrder = async (req, res, next) => {
  try {
    const {id} = req.params;
    const deletedJobOrder = await JobOrder.findByIdAndDelete(id);

    if (!deletedJobOrder) {
      return res
        .status(404)
        .json({success: false, message: "Job order not found"});
    }

    res.status(200).json({success: true, message: "Job order deleted"});
  } catch (error) {
    next(error);
  }
};
