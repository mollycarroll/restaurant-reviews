import http from '../http-common';

// this is where API calls to the backend will happen via the functions here, returning data
// each method in the class will add a query to the baseURL in http-common for the request

class RestaurantDataService {
    getAll(page = 0) {
        return http.get(`?page=${page}`);
    }

    get(id) {
        return http.get(`/id/${id}`);
    }

    find(query, by = 'name', page = 0) {
        return http.get(`?${by}=${query}&page=${page}`);
    }

    createReview(data) {
        return http.post('/review', data);
    }

    updateReview(data) {
        return http.put('/review', data);
    }

    deleteReview(id, userId) {
        return http.delete(`/review?id=${id}`, {data:{user_id: userId}});
    }

    getCuisines(id) {
        return http.get(`/cuisines`);
    }

}

export default new RestaurantDataService();