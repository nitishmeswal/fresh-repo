import 'next-auth'

declare module 'next-auth' {
    interface User {
        id:string
        email:string
        firstname:string
        lastname:string
        isVerified: boolean
        isAdmin: boolean
    }
}