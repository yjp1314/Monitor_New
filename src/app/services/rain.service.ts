import { Injectable } from '@angular/core';
import { HttpService } from '../providers/HttpService';
import { map, mergeMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { GlobalData } from '../providers/GlobalData';
// import { FileService } from '../providers/FileService';
import { ValidationErrors } from '@angular/forms';
// import { Encrypt } from '../providers/Encrypt';
import { Time } from '@angular/common';
import { Utils } from '../providers/Utils'

@Injectable({
    providedIn: 'root'
})
export class RainService {

    constructor(public http: HttpService) {
    }

    getWmtRainDetail(siteCode: string, fromTime: Date, toTime: Date) {
        let fromTimeStr = Utils.dateFormat(fromTime, 'yyyy-MM-dd HH:mm')
        let toTimeStr = Utils.dateFormat(toTime, 'yyyy-MM-dd HH:mm')
        return this.http.post('wmtRain/GetWmtRainDetailFromMobile', {
            'stcd': siteCode,
            'fromTime': fromTimeStr,
            'toTime': toTimeStr
        });
    }

    getWmtRainSiteDetail(siteCode: string, fromTime: Date, toTime: Date) {
        // console.log(siteCode);
        // console.log(fromTime);
        // console.log(toTime)
        return this.http.post('wmtRain/GetWmtRainDetailFromMobile', {
            'stcd': siteCode,
            'fromTime': fromTime,
            'toTime': toTime
        });
    }

    getWmtRainTotalByHours(addvcdArray: string, pageIndex: any, pageSize: any, sortHour: any) {
        let addvcds = addvcdArray.split(","); console.log("addvcds", addvcds);
        return this.http.post('wmtRain/GetWmtRainTotalByHours', {
            'addvcdArray': addvcds,
            'pageNumber': pageIndex,
            'pageSize': pageSize,
            'sortHour': sortHour
        });
    }
    getWmtRainTotalByRegion(params) {
        return this.http.post('wmtRain/GetWmtRainTotal', { fromTime: params.fromTime, toTime: params.toTime, addvcdArray: params.addvcd });
    }

    getWmtRainTotalBySite(params) {
        return this.http.post('wmtRain/GetWmtRainTotalBySite', { fromTime: params.fromTime, toTime: params.toTime });
    }

    getMaxWmtRainHourTotal(fromTime: any, toTime: any) {
        // let fromTimeStr = Utils.dateFormat(fromTime, 'yyyy-MM-dd HH:mm')
        // let toTimeStr = Utils.dateFormat(toTime, 'yyyy-MM-dd HH:mm')
        return this.http.post('wmtRain/GetMaxWmtRainHourTotalFromMobile', {
            'fromTime': fromTime,//fromTimeStr,
            'toTime': toTime//toTimeStr
        });
    }

    getMaxWmtRainDayTotal(fromTime: any, toTime: any) {
        // let fromTimeStr = Utils.dateFormat(fromTime, 'yyyy-MM-dd HH:mm')
        // let toTimeStr = Utils.dateFormat(toTime, 'yyyy-MM-dd HH:mm')
        return this.http.post('wmtRain/GetMaxWmtRainDayTotalFromMobile', {
            'fromTime': fromTime,//fromTimeStr,
            'toTime': toTime//toTimeStr
        });
    }
    
    getWmtRainRegionDetail(fromTime: any, toTime:any, addvcd: string){
        // let fromTimeStr = Utils.dateFormat(fromTime,'yyyy-MM-dd HH:mm')
        // let toTimeStr = Utils.dateFormat(toTime,'yyyy-MM-dd HH:mm')
        return this.http.post('wmtRain/GetWmtRainRegionDetailFromMobile', {
            'fromTime': fromTime,//fromTimeStr,
            'toTime': toTime,//toTimeStr
            'addvcd':addvcd
        });
    }
}
