const express = require('express')
const { createReview, replyComment, deleteReview, getProductReviews, getAllTotalReviews, getTotalReviewsByProduct, getAllReviews } = require('../controllers/reviewController')
const router = express.Router()

router.post('/reviews', createReview)
router.post('/reviews/:id/reply', replyComment)

router.delete('/reviews/delete/:id', deleteReview)
// router.get('/all-reviews', getAllReviews);
//Lấy tổng số commemt 
router.get('/reviews/total', getAllTotalReviews);
//Lấy tổng comment của 1 sản phẩm 
router.get('/reviews/total/:productId', getTotalReviewsByProduct);

router.get('/reviews/:productId', getProductReviews);


router.get('/all-reviews', getAllReviews);

module.exports = router