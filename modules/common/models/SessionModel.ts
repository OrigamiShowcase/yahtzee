export default class SessionModel
{
    userid:string;
    email:string;
    constructor(data:any)
    {
        Object.assign(this,data)
    }
}