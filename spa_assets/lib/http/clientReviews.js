import { $host, $authHost } from "http";

export const clientReviews = async () => {
    const reviews = await $host.get('client_api/v1/dashboards')
    return reviews.data.client_reviews
}