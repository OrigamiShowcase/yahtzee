import ScoreModel from "./ScoreModel";

export default class PlayerModel
{
    scores:ScoreModel[]=[];
    userid:string;
    email:string
    constructor(data:{
        scores?:ScoreModel[]
        userid:string;
        email:string
    })
    {
        Object.assign(this,data);
    }
}