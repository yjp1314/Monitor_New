import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Events } from '@ionic/angular';
import { Helper } from '../providers/Helper';
import { Utils } from '../providers/Utils';
import { NativeService } from '../providers/NativeService';
import { RainService } from '../services/rain.service';
import * as echarts from 'echarts';

@Component({
    selector: 'app-mine',
    templateUrl: './mine.page.html',
    styleUrls: ['./mine.page.scss'],
    providers: [RainService, Utils]
})
export class MinePage implements OnInit {
    ec: any = echarts;
    currentTime = '';
    startTime = Utils.calDate(24);//new Date((new Date().getTime() - 24 * 60 * 60 * 1000));
    siteRainData = [];
    rainData = "";

    // addvcd = ['210202', '210212', '210213', '210282', '210281', '210283', '210224', '210286', '210285', '210284'];
    addvcd = ['210201', '210211', '210212', '210213', '210224', '210281', '210282', '210283', '210284', '210286', '210287', '210288'];
    category = [];
    data = [];
    maxCategory = "";
    maxData = 0;
    siteCount = 0;
    availbleSiteCount = 0;
    hourRainfallMin = 0;
    siteHourRainfallMin = "";
    hourRainfallMax = 0;
    siteHourRainfallMax = "";
    chartOption: any;
    currentPeriod = 'last';
    rainChart: any;
    constructor(public helper: Helper,
        public router: Router,
        public events: Events,
        public native: NativeService,
        public ranSrv: RainService
    ) {
    }

    ngOnInit() {
    }

    ionViewDidEnter() {
        this.refeshDateRange(this.currentPeriod);
        this.refeshRainChart();
    }

    segmentChanged(ev: any) {
        console.log('Segment changed', ev);
        this.currentPeriod = ev.detail.value;
        this.refeshDateRange(ev.detail.value);
        this.refeshRainChart();
    }

    refeshDateRange(period) {
        let periodHours = 24;
        switch (period) {
            case "last":
                periodHours = 24;
                break;
            case '1H':
                periodHours = 1;
                break;
            case '3H':
                periodHours = 3;
                break;
            case "6H":
                periodHours = 6;
                break;
            case "12H":
                periodHours = 12;
                break;
            case "24H":
                periodHours = 24;
                break;
            case "48H":
                periodHours = 48;
                break;
        }
        this.startTime = Utils.calDate(periodHours);//new Date((new Date().getTime() - periodHours * 60 * 60 * 1000));
        this.currentTime = Utils.calDate(0);//new Date();
    }

    refeshRainChart() {
        let peremeters = { fromTime: this.startTime, toTime: this.currentTime, addvcd: this.addvcd };
        this.helper.showLoading();
        this.ranSrv.getWmtRainTotalByRegion(peremeters).subscribe(res => {
            if (res.isSuccess) {
                this.siteRainData = res.data;
                this.generateChart();
                // this.refeshRain24Hour();
                // this.refeshRainDay();
            }
        }, () => {
            this.helper.hideLoading();
        });
    }

    refeshRainDay() {
        this.maxData = 0;
        this.maxCategory = "";
        console.log();
        // this.helper.showLoading();
        let rain24Hour = Utils.calDate(24);//new Date((new Date().getTime() - 24 * 60 * 60 * 1000));
        this.ranSrv.getMaxWmtRainDayTotal(rain24Hour, this.currentTime).subscribe(res => {
            if (res.isSuccess) {
                if (res.data != null) {
                    this.generateDay(res.data); console.log("rainfall", res.data);
                }
                this.helper.hideLoading();
            }
        }, () => {
            this.helper.hideLoading();
        });
    }

    generateDay(rainfall) {
        this.maxData = rainfall.paravalue;
        this.maxCategory = rainfall.areaName;
    }

    refeshRain24Hour() {
        console.log();
        // this.helper.showLoading();
        // let rain24Hour = Utils.calDate(24);
        //let rain24Hour = new Date((new Date().getTime() - 24 * 60 * 60 * 1000));
        this.ranSrv.getMaxWmtRainHourTotal(this.startTime, this.currentTime).subscribe(res => {
            if (res.isSuccess) {
                if (res.data != null) {
                    this.generate24Hour(res.data); console.log("rainfall", res.data);
                }
                this.helper.hideLoading();
            }
        }, () => {
            this.helper.hideLoading();
        });
    }

    refeshRegionDetail(addvcd) {
        console.log();
        this.helper.showLoading();
        // let rain24Hour = Utils.calDate(24);
        // let rain24Hour = new Date((new Date().getTime() - 24 * 60 * 60 * 1000));
        this.ranSrv.getWmtRainRegionDetail(this.startTime, Utils.calDate(0), addvcd).subscribe(res => {
            if (res.isSuccess) {
                if (res.data != null) {
                    this.siteCount = res.data.stationCount;
                    this.availbleSiteCount = res.data.stationCountRain;
                    this.maxData = res.data.maxParavalue;
                    this.maxCategory = res.data.maxParaStation;
                    this.hourRainfallMax = res.data.maxParavalueHour;
                    if (res.data.maxParaTimeHour == null) {
                        this.siteHourRainfallMax = "";
                    }
                    else {
                        let tempTime = new Date(res.data.maxParaTimeHour)
                        this.siteHourRainfallMax = res.data.maxParaStationHour + "（" + tempTime.getHours() + ":00）";
                    }
                }
                this.helper.hideLoading();
            }
        }, () => {
            this.helper.hideLoading();
        });
    }
    generate24Hour(rainfall) {
        let tempTime = new Date(rainfall.collecttime)
        this.hourRainfallMax = rainfall.paravalue;
        this.siteHourRainfallMax = rainfall.areaName + "（" + tempTime.getHours() + ":00）";
    }
    cleanRegionDetail() {
        this.rainData = "";
        this.siteCount = 0;
        this.availbleSiteCount = 0;
        this.maxData = 0;
        this.maxCategory = "";
        this.hourRainfallMax = 0;
        this.siteHourRainfallMax = "";
    }
    generateChart() {
        this.category = [];
        this.data = [];
        this.siteCount = 0;
        this.availbleSiteCount = 0;
        let tempSiteRainData = this.siteRainData.reverse();
        // this.siteRainData.forEach(element => {
        //     if(tempSiteRainData.length <=0 )
        //     {
        //         tempSiteRainData.push(element);
        //     }
        //     let index = 0;
        //     for
        // });

        tempSiteRainData.forEach(element => {
            this.data.push(element.total);
            this.category.push(element.addvName);
            if (element.total > 0) {
                this.availbleSiteCount++;
            }
        });

        if (tempSiteRainData.length > 0) {
            this.rainData = tempSiteRainData[0].addvName;
            this.refeshRegionDetail(tempSiteRainData[0].addvcd);
        }

        this.siteCount = this.siteRainData.length;
        console.log("category", this.category);
        console.log("data", this.data)
        //Create Chart

        this.rainChart = this.ec.init(document.getElementById('rainChart'))
        this.chartOption = {
            color: ['#3398DB'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: this.category,
                    triggerEvent: true,
                    axisTick: {
                        alignWithLabel: true
                    },
                    axisLabel: {
                        rotate: 90
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: '实际降雨量(mm)',
                    type: 'bar',
                    barWidth: '60%',
                    data: this.data,
                    itemStyle: {
                        normal: {
                            barBorderRadius: [10, 10, 0, 0],
                        }
                    }
                }
            ]
        };

        this.rainChart.setOption(this.chartOption);
        let that = this;
        this.rainChart.on('click', function (params) {
            let componentType = params.componentType;
            let currentAddvcd = "";
            let regionName = '';
            if (componentType == 'series') {
                regionName = params.name;
            }
            if (componentType == 'xAxis') {
                regionName = params.value;
            }
            console.log(that.rainData, params);
            that.siteRainData.forEach(element => {
                if (element.addvName == regionName) {
                    that.rainData = element.addvName;
                    currentAddvcd = element.addvcd;
                }
            });
            console.log(that.rainData, currentAddvcd);
            that.refeshRegionDetail(currentAddvcd);
        });
        this.rainChart.getZr().on('click', function (params) {
            console.log("clean detail");
            that.cleanRegionDetail();
            const pointInPixel = [params.offsetX, params.offsetY]
            if (that.rainChart.containPixel('grid', pointInPixel)) {
                let xIndex = that.rainChart.convertFromPixel({ seriesIndex: 0 }, [params.offsetX, params.offsetY])[0];
                //console.log("xIndex:",xIndex);
                if (xIndex >= 0 && xIndex < tempSiteRainData.length) {
                    that.rainData = tempSiteRainData[xIndex].addvName;
                    let currentAddvcd = tempSiteRainData[xIndex].addvcd;
                    that.refeshRegionDetail(currentAddvcd);
                }
            }
        });
    }
}
