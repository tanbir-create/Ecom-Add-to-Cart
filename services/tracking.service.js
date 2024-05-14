const Order = require("../models/order.model");
const AppError = require("../utils/AppError");

const TRACKING_STATUS = ["SHIPPED_TO", "ARRIVED_AT", "OUT_FOR_DELIVERY", "DELIVERED"];

module.exports.addTrackingInfo = async (orderId, info) => {
    const order = await Order.findById(orderId);

    if (!order) {
        throw new AppError(`No orders found with id ${orderId}`, 404);
    }

    const { address, status } = info;

    if (!TRACKING_STATUS.includes(status)) {
        throw new AppError(
            `Please enter a valid status from ["SHIPPED_TO", "ARRIVED_AT", "OUT_FOR_DELIVERY", "DELIVERED"]`,
            400
        );
    }
    if (order.tracking.length === 0) {
        order.status = "SHIPPED";
    }

    if (status === "DELIVERED") {
        order.status = "DELIVERED";
    }
    order.tracking.push({ address, status, time: Date.now() });

    return order.save();
};

module.exports.updateTrackingInfo = async (orderId, info) => {
    const order = await Order.findById(orderId);

    if (!order) {
        throw new AppError(`No orders found with id ${orderId}`, 404);
    }

    const { address, status } = info;

    if (!TRACKING_STATUS.includes(status)) {
        throw new AppError(
            `Please enter a valid status from ["SHIPPED_TO", "ARRIVED_AT", "OUT_FOR_DELIVERY", "DELIVERED"]`,
            400
        );
    }

    if (order.tracking.length > 0) {
        const currentHistoryItem = order.tracking[order.tracking.length - 1];
        currentHistoryItem.address = address;
        currentHistoryItem.status = status;
        currentHistoryItem.time = Date.now();
    }

    return order.save();
};

module.exports.deleteTrackingInfo = async (orderId) => {
    const order = await Order.findById(orderId);

    if (!order) {
        throw new AppError(`No orders found with id ${orderId}`, 404);
    }

    if (order.tracking.length > 0) {
        order.tracking.splice(-1);
    }

    return order.save();
};
