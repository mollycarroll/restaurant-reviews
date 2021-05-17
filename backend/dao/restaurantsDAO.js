// restaurants variable stores a reference to the database
let restaurants

export default class RestaurantsDAO {
    // initially connect to database
    static async injectDB(conn) {
        if (restaurants) {
            return
        }
        try {
            restaurants = await conn.db(process.env.RESTREVIEWS_NS).collection('restaurants')
        } catch (e) {
            console.error(`Unable to establish a connection handle in restaurantsDAO: ${e}`, 
            )
        }
    }

    // filtering method
    static async getRestaurants({
        filters = null,
        page = 0,
        restaurantsPerPage = 20,
    } = {}) {
        let query
        if (filters) {
            if ('name' in filters) {
                query = { $text: { $search: filters['name'] } }

            } else if ('cuisine' in filters) {
                query = { 'cuisine': { $eq: filters['cuisine'] } }

            } else if ('zipcode' in filters) {
                query = { 'address.zipcode': { $eq: filters['zipcode'] } }
            }
        }

    let cursor
    
    // cursor is the restaurants query if one exists, if no query, return 0 restaurants
    try {
        cursor = await restaurants
        .find(query)
    } catch (e) {
        console.error(`Unable to issue find command, ${e}`)
        return { restaurantList: [], totalNumRestaurants: 0 }
    }

    // limits results to 'restaurantsPerPage'; skips to page we are on
    const displayCursor = cursor.limit(restaurantsPerPage).skip(restaurantsPerPage * page)

    try {
        const restaurantsList = await displayCursor.toArray()
        const totalNumRestaurants = await restaurants.countDocuments(query)

        return { restaurantsList, totalNumRestaurants }
    } catch (e) {
        console.error(
            `Unable to convert cursor to array or problem counting documents, ${e}`
        )
        return { restaurantsList: [], totalNumRestaurants: 0 }
    }

}}