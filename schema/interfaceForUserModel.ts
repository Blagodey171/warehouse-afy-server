export interface Iuser {
    login: string,
    password: string,
    devices: {
        deviceId: string,
        isAuthorisation: boolean,
        loginDate: number
    },
    accessToken: string,
    refreshToken: string,
    save () : Promise<void>
}