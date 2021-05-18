import express from 'express'
import RestaurantsController from './restaurants.controller.js'
import ReviewsController from './reviews.controller.js'

const router = express.Router()

router.route('/').get(RestaurantsController.apiGetRestaurants)

// shows info about specific restaurant incl. reviews associate with it
router.route('/id/:id').get(RestaurantsController.apiGetRestaurantById)

// return a list of cuisines for dropdown menu on frontend of cuisines
router.route('/cuisines').get(RestaurantsController.apiGetRestaurantCuisines)

// review route for users reviewing restaurants
router
    .route('/review')
    .post(ReviewsController.apiPostReview)
    .put(ReviewsController.apiUpdateReview)
    .delete(ReviewsController.apiDeleteReview)

export default router