//Movie_Website\Backend\api\reviews.route.js
import express from "express";
import ReviewsController from "./reviews.controller.js";

const router = express.Router();

router.route("/").get((req, res) => res.send("Hello World"));
router.route("/movie/:id").get(ReviewsController.apiGetReviewsByMovie);
router.route("/new").post(ReviewsController.apiPostReview);
router
    .route("/:id")
    .get(ReviewsController.apiGetReview)
    .put(ReviewsController.apiUpdateReview)
    .delete(ReviewsController.apiDeleteReview);

export default router;
