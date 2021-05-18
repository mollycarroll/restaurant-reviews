import mongodb from 'mongodb'
const ObjectId = mongodb.ObjectID

// restaurants variable stores a reference to the database
let restaurants

// DAO = data access object
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

}

    static async getRestaurantsByID(id) {
        try {
            // pipelines help match different collections together in MongoDB
            // this pipeline will match restaurant ID and find all reviews associate with that restaurant
            const pipeline = [
                {
                    $match: {
                        _id: new ObjectId(id),
                    },
                },
                    {
                        $lookup: {
                            from: 'reviews',
                            let: {
                                id: '$_id',
                            },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $eq: ['$restaurant_id', '$$id'],
                                        },
                                    },
                                },
                                {
                                    $sort: {
                                        date: -1,
                                    },
                                },
                            ],
                            as: 'reviews',
                        },
                    },
                    {
                        $addFields: {
                            reviews: '$reviews',
                        },
                    },
            ]
        // return aggregated pipeline: restaurant with all connected reviews
        return await restaurants.aggregate(pipeline).next()

        } catch (e) {
            console.error(`Something went wrong in getRestaurantByID: ${e}`)
            throw e
        }
    }


    static async getCuisines() {
        let cuisines = []
        try {
            // distinct = get each cuisine 1 time (vs multiple restaurants with same cuisine)
            cuisines = await restaurants.distinct('cuisine')
            return cuisines

        } catch (e) {
            console.error(`Unable to get cuisines, ${e}`)
            return cuisines
        }
    }


}