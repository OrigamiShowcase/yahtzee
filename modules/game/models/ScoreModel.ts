import { type } from "os";
import { ExportType } from "./ScoreType";

export default class ScoreModel
{
    type:ExportType;
    value:number;
    constructor(data:{
        type:ExportType;
        value:number;
    })
    {
        Object.assign(this,data)
    }
}