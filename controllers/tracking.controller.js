const trackingService = require("../services/tracking.service");
const catchAsync = require("../utils/catchAsync");

module.exports.addTrackingInfo = catchAsync(async (req, res, next) => {
    const { address, status } = req.body;
    const { orderId } = req.params;

    const order = await trackingService.addTrackingInfo(orderId, { address, status });

    res.status(200).json({
        status: "success",
        message: "Added new tracking info",
        order,
    });
});

module.exports.updateTrackingInfo = catchAsync(async (req, res, next) => {
    const { address, status } = req.body;
    const { orderId } = req.params;

    const order = await trackingService.updateTrackingInfo(orderId, { address, status });

    res.status(200).json({
        status: "success",
        message: "Update tracking info",
        order,
    });
});

module.exports.deleteTrackingInfo = catchAsync(async (req, res, next) => {
    const { orderId } = req.params;

    await trackingService.deleteTrackingInfo(orderId);

    res.status(200).json({
        status: "success",
        message: "Delete last tracking update",
    });
});
