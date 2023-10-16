import ScoreModel from "./ScoreModel";

export default class PlayerModel
{
    scores:ScoreModel[]=[];
    userid:string;
    constructor(data:{
        scores:ScoreModel[]
    })
    {
        Object.assign(this,data);
    }
}