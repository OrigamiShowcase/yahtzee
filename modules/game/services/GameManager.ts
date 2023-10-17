import { CommonService } from "@origamicore/base";
import DbSchemas from "../../common/DbSchemas";
import { ResponseType } from "../../common/models/response/ResponseType";
import GameModel from "../models/GameModel";
import { GameState } from "../models/GameState";
import { ExportType } from "../models/ScoreType";
import ScoreModel from "../models/ScoreModel";

export default class GameManager
{
    static games:Map<string,GameModel>=new Map<string,GameModel>();
    static userids:Map<string,string>=new Map<string,string>();
    static async RemoveGame(game:GameModel)
    {
        await DbSchemas.games.findByIdAndDelete(game._id);
        for(let player of game.players)
        {
            if(this.userids.get(player.userid)==game._id)
                this.userids.delete(player.userid);
        }
        this.games.delete(game._id)
    }
    static async saveGame(game:GameModel)
    {
        await DbSchemas.games.saveById(game);
    }
    static getGame(userid:string):GameModel
    {
        let gameid=this.userids.get(userid);
        if(!gameid)return ;
        let game= this.games.get(gameid); 
        if(game.players[game.turn].userid!=userid) return ;
        if(game.state!=GameState.Playing)return
        return game;
    }
    static async start(game:GameModel)
    {
        if(this.games.has(game._id))return
        this.games.set(game._id,game);
        for(let player of game.players)
            this.userids.set(player.userid,game._id);
        if(game.state==GameState.Waiting)
        {
            game.state=GameState.Playing;
        } 
        this.saveGame(game);
        game.sendMessage(ResponseType.Start)
    }
    static async rool(userid:string)
    { 
        let game=this.getGame(userid)
        if(!game)return false;
        if(game.count>=3)return false;
        if(game.dices.length==0)game.dices=[0,0,0,0,0]
        for(let i=0;i<5;i++)
        {
            let lock=game.locks.indexOf(i);
            if(lock==-1)
            {
                game.dices[i] =CommonService.random(1,6)
            }
        }
        game.count++
        this.saveGame(game);
        game.sendMessage(ResponseType.Rool)
    }
    static async lock(userid:string,index:number)
    {
        if(index<0 || index>4) return false;
        let game=this.getGame(userid)
        if(!game)return false;        
        if(game.locks.indexOf(index)>-1)return false;
        game.locks.push(index);
        this.saveGame(game);
        game.sendMessage(ResponseType.Rool)
    }
    static async unlock(userid:string,index:number)
    {
        if(index<0 || index>4) return false;
        let game=this.getGame(userid)
        if(!game)return false;        
        let lockIndex=game.locks.indexOf(index)
        if(lockIndex==-1)return false;
        game.locks.splice(lockIndex,1);
        this.saveGame(game);
        game.sendMessage(ResponseType.Rool)
    }
    static async setScore(userid:string,type:number)
    {
        if(type<1 || type>13) return false;
        let game=this.getGame(userid)
        if(!game)return false;      
        let player=game.players[game.turn];
        if(player.scores.filter(p=>p.type==type)[0])
        {
            return false;
        }
        let value=0;
        let tmp={};
        let sum=0;
        for(let dice of game.dices)
        { 
            if(type>=ExportType.Number1 && type<=ExportType.Number6)
            {
                if(dice==type)
                {
                    value+=dice
                } 
            } 
            else
            {
                if(!tmp[dice])tmp[dice]=0;
                tmp[dice]++;
                sum+=dice;
            }
        }
        if(type==ExportType.Chance)
        {
            value=sum;
        }
        if(type==ExportType.Yahtzee)
        {
            if(Object.keys(tmp).length==1)
            {
                value=50;
            }
        }
        if(type==ExportType.FullHouse)
        {
            let keys=Object.keys(tmp)
            if(keys.length==2 && (tmp[keys[0]]==2 || tmp[keys[0]]==3))
            {
                value=sum;
            }
        }
        if(type==ExportType.ThreeOfAKind)
        {
            for(let num in tmp)
            {
                if(tmp[num]>=3)
                {
                    value=sum;
                }
            }
        }
        if(type==ExportType.FourOfAKind)
        {
            for(let num in tmp)
            {
                if(tmp[num]>=4)
                {
                    value=sum;
                }
            }
        }
        if(type==ExportType.LargeStraight)
        {
             
            if(Object.keys(tmp).length==5 && (tmp[2] &&tmp[3] &&tmp[4] &&tmp[5] ))
            {
                value=40;
            }
        }
        if(type==ExportType.SmallStraight)
        {
             
            if((tmp[1] &&tmp[2] &&tmp[3] &&tmp[4] )  || (tmp[2] &&tmp[3] &&tmp[4] &&tmp[5] )|| (tmp[3] &&tmp[4] &&tmp[5] &&tmp[6] ))
            {
                value=30;
            }
        }
        player.scores.push(new ScoreModel({
            type,
            value
        }))
        let end=true;
        for(let player of game.players)
        {
            if(player.scores.length<13)
            {
                end=false
            }
        }
        if(end)
        {
            game.state=GameState.Finished;
            setTimeout(()=>{
                this.RemoveGame(game)
            },1000*60)
        }
        game.turn++;
        game.count=0;
        game.dices=[]
        game.locks=[]
        if(game.turn>=game.players.length)game.turn=0;
        this.saveGame(game);
        game.sendMessage(ResponseType.Rool)
    }
}