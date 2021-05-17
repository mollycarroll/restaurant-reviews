import RestaurantsDAO from '../dao/restaurantsDAO.js'

export default class RestaurantsController {
    static async apiGetRestaurants(req, res, next) {
        // query passed through URL, indicates number of restaurants per page (base 10), if no indication, default is 20
        const restaurantsPerPage = req.query.restaurantsPerPage ? parseInt(req.query.restaurantsPerPage, 10) : 20

        // if page number in URL, convert to int base 10, if no indication, default is 0
        const page = req.query.page ? parseInt(req.query.page, 10) : 0

        let filters = {}
        if (req.query.cuisine) {
            filters.cuisine = req.query.cuisine
        } else if (req.query.zipcode) {
            filters.zipcode = req.query.zipcode
        } else if (req.query.name) {
            filters.name = req.query.name
        }

        const { restaurantsList, totalNumRestaurants } = await RestaurantsDAO.getRestaurants({
            filters,
            page,
            restaurantsPerPage,
        })

        let response = {
            restaurants: restaurantsList,
            page: page,
            filters: filters,
            entriesPerPage: restaurantsPerPage,
            totalResults: totalNumRestaurants,
        }
        
        // send response as json to whoever called the URL
        res.json(response)
    }
}