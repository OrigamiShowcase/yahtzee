import Manager from "../../common/Manager";
import ResponseMessage from "../../common/models/response/ResponseMessage";
import { GameState } from "./GameState";
import PlayerModel from "./PlayerModel"
import { ResponseType } from "../../common/models/response/ResponseType";

export default class GameModel
{
    _id:string;
    players:PlayerModel[]=[]
    turn:number=0;
    count:number=0;
    dices:number[]=[];
    locks:number[]=[];
    state:GameState=GameState.Waiting;
    constructor(data:any)
    {
        Object.assign(this,data)
    }
    sendMessage(type:ResponseType)
    {
        for(let player of this.players)
        {
            Manager.evac.sendMessage(player.userid,new ResponseMessage({type,game:this}))
        }
    }
}