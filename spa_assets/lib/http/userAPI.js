import { $host, $authHost } from "http";
import jwt_decode from "jwt-decode"

export const registration = async (email, password) => {
    const {data} = await $host.post('', {email, password, role: "CLIENT"})
    return jwt_decode(data.token)
}

export const login = async (email, password) => {
    const {data} = await $host.post('', {email, password})
    return jwt_decode(data.token)
}

export const check = async () => {
    const response = await $host.post('')
    return response
}