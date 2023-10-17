export default class EnvModel
{
    static databse:string=process.env.DATABASE; 
    static googleClientId:string=process.env.CLIENT_ID
    static googleClientSecret:string=process.env.SECRET_KEY
    static GoogleRedirect:string=process.env.GOOGLE_REDIRECT
    static frontRedirect:string=process.env.FRONT_REDIRECT
    static httpPort:number =parseInt(process.env.HTTP_PORT??'4000') 
    static socketPort:number =parseInt(process.env.SOCKET_PORT??'4001') 
}