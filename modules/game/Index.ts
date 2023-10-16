import { DataInput, ModuleConfig, OriInjectable, OriService, PackageIndex, SessionInput } from "@origamicore/core";
import GameConfig from "./models/GameConfig"; 

@OriInjectable({domain:'game'})
export default class GameService implements PackageIndex
{
    name:string='game';
    config:GameConfig;
    jsonConfig(moduleConfig: ModuleConfig): Promise<void> { 
        this.config=moduleConfig as GameConfig;
        return ;
    }
    start(): Promise<void> {
        return;
    }
    restart(): Promise<void> {
        return;
    }
    stop(): Promise<void> {
        return;
    }
    
    @OriService({isPublic:true})
    test(@SessionInput session )
    {

    }
}