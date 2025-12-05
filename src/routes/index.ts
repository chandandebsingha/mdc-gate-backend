import { Router } from "express";
import complaintRoutes from "./complaint.routes";
import authRoutes from "./auth.routes";
import amenityRoutes from "./amenity.routes";
import paymentRoutes from "./payment.routes";
import paymentGroupRoutes from "./paymentGroup.routes";
import visitorRoutes from "./visitor.routes";
import gateLogRoutes from "./gateLog.routes";
import familyRoutes from "./family.routes";
import societyRoutes from "./society.routes";
import userDetailsRoutes from "./userDetails.routes";
import adminRoutes from "./admin.routes";
import allUsersRoutes from "./allusers.routes";

const router = Router();
router.use("/auth", authRoutes);
router.use("/complaints", complaintRoutes);
router.use("/amenities", amenityRoutes);
router.use("/payments", paymentRoutes);
router.use("/payment-groups", paymentGroupRoutes);
router.use("/visitors", visitorRoutes);
router.use("/gate-log", gateLogRoutes);
router.use("/family", familyRoutes);
router.use("/societies", societyRoutes);
router.use("/user-details", userDetailsRoutes);

router.use("/allusers", allUsersRoutes);
router.use("/admin", adminRoutes);

export default router;
