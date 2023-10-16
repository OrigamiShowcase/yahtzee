import { GameState } from "./GameState";
import PlayerModel from "./PlayerModel"

export default class GameModel
{
    _id:string;
    players:PlayerModel[]=[]
    turn:number=0;
    dices:number[]=[];
    locks:number[]=[];
    state:GameState=GameState.Waiting;
    constructor(data:any)
    {
        Object.assign(this,data)
    }
    
}