const router = require("express").Router();

const trackingController = require("../controllers/tracking.controller");

router.post("/:orderId", trackingController.addTrackingInfo);
// router.get("/:orderId", trackingController.getTrackingInfo);
router.patch("/:orderId", trackingController.updateTrackingInfo);
router.delete("/:orderId", trackingController.deleteTrackingInfo);
// router.get("/tracking_quantity", trackingController.gettrackingQuantity);
module.exports = router;
