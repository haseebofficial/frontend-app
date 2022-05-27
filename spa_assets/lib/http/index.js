import axios from "axios";

// axios.defaults.withCredentials = true;

const $hostOld = axios.create({
    baseURL: "https://cp.dev.interpreters.travel/api/",
    AccessControlAllowOrigin: "http://localhost:8080/",
    Vary: "Origin"
})

const $host = axios.create({
    baseURL: "https://cp.dev.interpreters.travel/client_api/v1/",
    AccessControlAllowOrigin: "http://localhost:8080/",
    Vary: "Origin",
    withCredentials: true,
})

const $authHost = axios.create({
    baseURL: "https://cp.dev.interpreters.travel/client_api/v1/"
})

const authInterceptor = config => {
    config.headers.authorization = `Bearer ${localStorage.getItem('token')}`
    return config
}

$authHost.interceptors.request.use(authInterceptor)

export {
    $host,
    $authHost,
    $hostOld
}