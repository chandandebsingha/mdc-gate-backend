import { Router } from "express";
import complaintRoutes from "./complaint.routes";
import authRoutes from "./auth.routes";
import amenityRoutes from "./amenity.routes";
import paymentRoutes from "./payment.routes";
import visitorRoutes from "./visitor.routes";
import familyRoutes from "./family.routes";

const router = Router();
router.use("/auth", authRoutes);
router.use("/complaints", complaintRoutes);
router.use("/amenities", amenityRoutes);
router.use("/payments", paymentRoutes);
router.use("/visitors", visitorRoutes);
router.use("/family", familyRoutes);

export default router;
