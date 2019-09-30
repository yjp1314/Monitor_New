import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Utils } from '../providers/Utils';
import { NativeService } from '../providers/NativeService';
import { Helper } from '../providers/Helper';
import { Logger } from '../providers/Logger';
import { HttpService } from '../providers/HttpService';
import { GlobalData } from '../providers/GlobalData';
// import { Encrypt } from '../providers/Encrypt';
import { Events, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { RainService } from './../services/rain.service';
import * as echarts from 'echarts';


@Component({
    selector: 'app-tab1',
    templateUrl: './tab1.page.html',
    styleUrls: ['./tab1.page.scss'],
    providers: [RainService, Utils]
})
export class Tab1Page implements OnInit {
    chartOption = {};
    maxRainValue = 0;
    oneHourMaxRainName = '';
    oneHourMaxRainValue = 0;
    oneHourMaxAreaCode = '';
    maxPositionName = '';
    maxPositionValue = 0;
    maxAreaCode = '';
    yAxis = [];
    xAxis = [];
    currentDate = '';
    lastOneHour = '';
    last24Hour = '';
    siteTitle = '';
    IsShowTwoBtnDialog: boolean = false;
    IsShowCover: boolean = false;
    popChartOption: any;
    category: any;
    data: any;
    siteRainData = [];
    constructor(public native: NativeService,
        public helper: Helper,
        public events: Events,
        public router: Router,
        public nav: NavController,
        public http: HttpService,
        public service: RainService
    ) {
    }

    ngOnInit() {
    }
    bindMaxRain() {
        this.helper.showLoading();
        this.xAxis = [];
        this.yAxis = [];
        const params = {
            'fromTime': this.last24Hour,
            'toTime': this.currentDate
        };

        this.service.getWmtRainTotalByRegion(params).subscribe(res => {
            if (res.isSuccess) {
                const data = res.data;

                if (data.length > 0) {
                    this.maxRainValue = data[data.length - 1].cal === null ? 0 : data[data.length - 1].cal;
                    data.forEach(element => {
                        if (element.addvName !== '中山区' && element.addvName !== '西岗区' && element.addvName !== '沙河口区') {
                            this.xAxis.push(element.cal === null ? 0 : element.cal);
                            this.yAxis.push(element.addvName);
                        }
                    });
                    this.bindChart();
                    this.helper.hideLoading();
                }
            } else {
                this.helper.hideLoading();
                console.log('error');
            }
        });
    }
    bindOneHourMaxRain() {
        this.helper.showLoading();
        const params = {
            'fromTime': this.lastOneHour,
            'toTime': this.currentDate
        };
        this.service.getWmtRainTotalBySite(params).subscribe(res => {
            if (res.isSuccess) {
                const data = res.data;
                if (data.length > 0) {
                    this.oneHourMaxRainName = data[0].addvName + '-' + data[0].areaName;
                    this.oneHourMaxRainValue = data[0].total == null ? 0 : data[0].total;
                    this.oneHourMaxAreaCode = data[0].areaCode;
                } else {
                    this.oneHourMaxRainValue = 0;
                    this.oneHourMaxRainName = "";
                    this.oneHourMaxAreaCode = "";
                }
                this.helper.hideLoading();
            } else {
                console.log('error');
                this.helper.hideLoading();
            }
        });
    }

    bindMaxRainPosition() {
        this.helper.showLoading();
        const params = {
            'fromTime': this.last24Hour,
            'toTime': this.currentDate
        };
        this.service.getWmtRainTotalBySite(params).subscribe(res => {
            if (res.isSuccess) {
                const data = res.data;

                if (data.length > 0) {
                    this.maxPositionName = data[0].addvName + '-' + data[0].areaName;
                    this.maxPositionValue = data[0].total;
                    this.maxAreaCode = data[0].areaCode;
                }
                this.helper.hideLoading();
            } else {
                console.log('error');
                this.helper.hideLoading();
            }
        });
    }
    bindChart() {
        const ec = echarts as any;
        var myChart = ec.init(document.getElementById('chart'))

        this.chartOption = {
            xAxis: [
                {
                    show: false,
                    type: 'value',
                    boundaryGap: [0, 0],
                    position: 'top',
                }
            ],
            grid: {
                left: "0px",
                right: '25%',
                bottom: '5%',
                top: '-20px',
                containLabel: true
            },
            yAxis: [
                {
                    type: 'category',
                    data: this.yAxis,
                    axisLine: { show: false },
                    axisTick: [{
                        show: false
                    }],
                    axisLabel: {
                        textStyle: {
                            fontSize: '14'
                        }
                    }
                }
            ],
            series: [
                {
                    name: '',
                    type: 'bar',
                    tooltip: { show: false },
                    barWidth: 14,
                    data: this.xAxis,
                    itemStyle: {
                        normal: {
                            barBorderRadius: [0, 10, 10, 0],
                            color: ' #80bfff',
                            label: {
                                show: true,
                                position: 'right',
                                textStyle: {
                                    color: '#000',
                                    fontSize: '14'
                                }
                            }
                        }
                    }
                }
            ]
        };
        myChart.setOption(this.chartOption);
    }

    ionViewWillEnter() {
        this.IsShowTwoBtnDialog = false;
        this.IsShowCover = false;
        this.currentDate = Utils.calDate(0);
        this.lastOneHour = Utils.calDate(1);
        this.last24Hour = Utils.calDate(24);
        this.bindMaxRain();
        this.bindOneHourMaxRain();
        this.bindMaxRainPosition();
    }

    showPop(title, type) {
        this.siteTitle = title;
        this.IsShowTwoBtnDialog = true;
        this.IsShowCover = true;
        this.currentDate = Utils.calDate(0);
        this.last24Hour = Utils.calDate(24);

        let areacode = "";
        if (type === 1) {
            areacode = this.oneHourMaxAreaCode;
        }
        else {
            areacode = this.maxAreaCode;
        }
        this.refeshSiteChart(this.currentDate, this.last24Hour, areacode);

    }
    refeshSiteChart(currentDate, last24Hour, areaCode) {
        this.siteRainData = [];
        this.helper.showLoading();
        this.service.getWmtRainSiteDetail(areaCode, last24Hour, currentDate).subscribe(res => {
            if (res.isSuccess) {
                this.siteRainData = res.data;
                this.generateChart();
                this.helper.hideLoading();
            }
        }, () => {
            this.helper.hideLoading();
        });
    }

    generateChart() {
        this.category = [];
        this.data = [];
        let maxData = [];
        let minData = [];
        let startTime = new Date((new Date()).getTime() - 24 * 60 * 60 * 1000);;//this.last24Hour;
        let time = new Date(startTime);
        for (let i = 0; i < 12; i++) {
            let day = time.getDate();
            let hh = time.getHours();
            this.category.push(day + "日" + hh + "时");
            this.data.push(0);
            maxData.push(-1);
            minData.push(-1);
            time = new Date(time.getTime() + 2 * 60 * 60 * 1000);
        }

        this.siteRainData.forEach(element => {
            let tempTime = new Date(element.collecttime);
            let tempDay = tempTime.getDate();
            let temp2Hours = tempTime.getHours();
            let tempIndex = this.category.indexOf(tempDay + "日" + temp2Hours + "时");
            if (tempIndex < 0) {
              let tempTime1 = new Date(new Date(element.collecttime).getTime() - 1 * 60 * 60 * 1000);
              let tempDay1 = tempTime1.getDate();
              let temp2Hours1 = tempTime1.getHours();
              tempIndex = this.category.indexOf(tempDay1 + "日" + temp2Hours1 + "时");
            }
            this.data[tempIndex] += element.paravalue;
          });

          this.popChartOption = {
            color: ['#3398DB'],
            tooltip: {
              trigger: 'axis',
              axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
              },
              "triggerOn":'click'
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
                animation: true
              }
            ]
          };
    }
    twoBtnCancel() {
        this.data = [];
        this.popChartOption = null;
        this.IsShowTwoBtnDialog = false;
        this.IsShowCover = false;
    }

    closeDialog() {
        this.data = [];
        if (this.IsShowTwoBtnDialog) {
            this.IsShowTwoBtnDialog = false;
            this.IsShowCover = false;
        }
    }
    // ionViewDidEnter() {
    //     this.currentDate = Utils.calDate(0);
    //     this.lastOneHour = Utils.calDate(1);
    //     this.last24Hour = Utils.calDate(24);
    // }
    // post() {
    //     this.http.post('/v1/login', {
    //         'client_id': 'app',
    //         'username': 'admin',
    //         'password': Encrypt.md5('123456') // 123456 'e10adc3949ba59abbe56e057f20f883e'
    //     }).subscribe(res => {
    //         GlobalData.token = res;
    //         console.log(res);
    //     });
    // }


    // test() {
    //     // this.nav.navigateForward('/tabs/tab1/test?page=1&size=10');
    //     this.router.navigateByUrl('/tabs/tab1/test?page=1&size=10');
    // }

    // test2() {
    //     this.router.navigate(['/tabs/tab1/test2', 2], { queryParams: { page: 1, size: 10 } });
    // }

}
