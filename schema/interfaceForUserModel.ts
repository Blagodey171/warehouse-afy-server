export interface Iuser {
    body: {
        login: string,
        password?: string,
        deviceId?: string
    },
}