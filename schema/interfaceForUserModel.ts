interface Idevices {
    deviceId: string,
    isAuthorisation: boolean,
    loginDate: number
}
export interface Iuser {
    login: string,
    password: string,
    devices: Idevices[],
    accessToken: string,
    refreshToken: string,
    save () : Promise<void>
}