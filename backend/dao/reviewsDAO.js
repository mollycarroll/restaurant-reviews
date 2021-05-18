import mongodb from 'mongodb'
const ObjectId = mongodb.ObjectID

// empty until filled with reference to reviews collection
let reviews

export default class ReviewsDAO {
    static async injectDB(conn) {
        if (reviews) {
            return
        }
        try {
            reviews = await conn.db(process.env.RESTREVIEWS_NS).collection('reviews')
        } catch (e) {
            console.error(`Unable to establish collection handles in userDAO: ${e}`)
        }
    }

    static async addReview(restaurantId, user, review, date) {
        try {
            const reviewDoc = {
                name: user.name,
                user_id: user._id,
                date: date,
                text: review,
                restaurant_id: ObjectId(restaurantId),
            }
            console.log(reviewDoc)
            return await reviews.insertOne(reviewDoc)

        } catch (e) {
            console.error(`Unable to post review: ${e}`)
            return { error: e }
        }
    }

    
    static async updateReview(reviewId, userId, text, date) {
        try {
            const updateResponse = await reviews.updateOne(
                // look for a review that has the right user ID and review ID
                { user_id: userId, _id: ObjectId(reviewId) },
                { $set: { text: text, date: date } },
            )

            return updateResponse

        } catch (e) {
            console.error(`Unable to update review: ${e}`)
            return { error: e }
        }
    }

    static async deleteReview(reviewId, userId) {
        try {
            // confirm that review ID and user ID are correct
            const deleteResponse = await reviews.deleteOne({
                _id: ObjectId(reviewId),
                user_id: userId,
            })

            return deleteResponse
        } catch (e) {
            console.error(`Unable to delete review: ${e}`)
            return { error: e }
        }
    }

}