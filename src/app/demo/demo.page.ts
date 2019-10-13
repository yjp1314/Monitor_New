import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Helper } from '../providers/Helper';
import { RainService } from '../services/rain.service';
import { Utils } from '../providers/Utils';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.page.html',
  styleUrls: ['./demo.page.scss'],
  providers:[Utils]
})
export class DemoPage implements OnInit {
  addvName = "全市";//"中山";
  addvCode = "2102";//"210202";
  currentTime = new Date();
  startTime = new Date((new Date().getTime() - 2 * 24 * 60 * 60 * 1000));
  rainData = [];

  siteCode = "";
  siteTitle = "";
  sitePeriod = "24H";
  siteRainData = [];
  startPeriodTime = new Date((new Date().getTime() - 2 * 60 * 60 * 1000));
  IsShowTwoBtnDialog: boolean = false;
  IsShowCover: boolean = false;
  chartOption: any;
  category = [];
  data = [];
  pageIndex = 1;
  pageSize = 40;
  hasMore = true;
  sortHour = 1;
  sortTag = "1h";
  constructor(public ranSrv: RainService, public helper: Helper, public modalController: ModalController) {
  }

  resetTime() {
    this.currentTime = new Date();
    this.startTime = new Date((new Date().getTime() - 2 * 24 * 60 * 60 * 1000));
  }
  ngOnInit() {
  }

  ionViewDidEnter() {
    this.resetTime();
    this.refeshAddvName(this.addvCode);
    this.refeshRainGrid(this.addvCode);
  }
  sortRain(sortHour: any, sortTag: any) {
    this.resetTime();
    this.pageIndex = 1;
    this.sortHour = sortHour;
    this.sortTag = sortTag;
    this.refeshRainGrid(this.addvCode);
  }
  segmentChanged(ev: any) {
    console.log('Segment changed', ev);
    if (ev.detail.value === "") return;
    this.resetTime();
    this.pageIndex = 1;
    this.sortHour = 1;
    this.sortTag = '1h';
    this.addvCode = ev.detail.value;
    this.refeshAddvName(ev.detail.value);
    this.refeshRainGrid(ev.detail.value);
  }
  segmentPeriodChanged(ev: any) {
    this.resetTime();
    console.log('Period Segment changed', ev);
    this.sitePeriod = ev.detail.value;
    console.log('this.sitePeriod', this.sitePeriod);
    if (this.sitePeriod == "2H") {
      this.startPeriodTime = new Date((new Date().getTime() - 2 * 60 * 60 * 1000)); console.log('this.startPeriodTime', this.startPeriodTime);
    }
    else {
      this.startPeriodTime = new Date((new Date().getTime() - 24 * 60 * 60 * 1000)); console.log('this.startPeriodTime', this.startPeriodTime);
    }
    this.refeshSiteChart();
  }
  loadData(e) {
    this.resetTime();
    this.pageIndex++;
    this.refeshRainGrid(this.addvCode, e);
  }
  refeshSiteChart() {
    this.helper.showLoading();
    this.ranSrv.getWmtRainDetail(this.siteCode, this.startPeriodTime, this.currentTime).subscribe(res => {
      if (res.isSuccess) {
        this.siteRainData = res.data;
        this.generateChart();
        this.helper.hideLoading();
      }
    }, () => {
      this.helper.hideLoading();
    });
  }
  refeshRainGrid(addvcds: string, e = null) {
    console.log(addvcds)
    this.ranSrv.getWmtRainTotalByHours(addvcds, this.pageIndex, this.pageSize, this.sortHour).subscribe(res => {
      if (res.isSuccess) {
        this.siteRainData = res.data; console.log("res.data", res.data, res.data.length);
        if (res.data != null && res.data.length > 0) {
          console.log("res.data@@1", res.data);
          if (this.pageIndex > 1) {
            this.rainData = this.rainData.concat(res.data);
          }
          else {
            this.rainData = res.data;
          }
          console.log('this.rainData', this.rainData);
          this.hasMore = true;
        }
        else if (res.data.length == 0 && this.pageIndex <= 1) {
          console.log("res.data@@2", res.data);
          this.rainData = [];
        }
        // else if (res.data.length < this.pageSize) {
        //   console.log("res.data@@3",res.data);
        //   this.hasMore = false;
        //   //e? e.target.disabled = true:"" ;
        // }
        e ? e.target.complete() : "";
        this.helper.hideLoading();
      }
    }, () => {
      this.helper.hideLoading();
    });
    // this.rainData = [
    //   {
    //     "areaName": "大西山",
    //     "addvname": "甘井子区",
    //     "total_1": 0,
    //     "total_3": 0,
    //     "total_6": 0,
    //     "total_12": 0,
    //     "total_24": 0,
    //     "total_48": 142
    //   },
    //   {
    //     "areaName": "牧城驿",
    //     "addvname": "甘井子区",
    //     "total_1": 0,
    //     "total_3": 0,
    //     "total_6": 0,
    //     "total_12": 0,
    //     "total_24": 0,
    //     "total_48": 300
    //   }
    // ];
    // this.helper.hideLoading();
  }
  refeshAddvName(addvcds) {
    //this.addvName = "旅顺";
    switch (addvcds) {
      case "2102":
        this.addvName = "全市";
        break;
      case "210201":
        this.addvName = "市区";
        break;
      // case '210211,210202,210203,210204':
      //   this.addvName = "大连";
      //   break;
      case '210211':
        this.addvName = "甘井子";
        break;
      case '210212':
        this.addvName = "高新旅顺";
        break;
      case "210213":
        this.addvName = "金州";
        break;
      case "210224":
        this.addvName = "长海县";
        break;
      case "210282":
        this.addvName = "普兰店";
        break;
      case "210281":
        this.addvName = "瓦房店";
        break;
      case "210283":
        this.addvName = "庄河";
        break;
      case "210287":
        this.addvName = "长兴岛";
        break;
      case "210286":
        this.addvName = "英那河上";
        break;
      case "210284":
        this.addvName = "碧流河上";
        break;
      case "210285":
        this.addvName = "碧流河下";
        break;
    }
  }

  generateChart() {
    console.log("this.siteRainData", this.siteRainData);
    // Data
    this.category = [];
    this.data = [];
    let maxData = [];
    let minData = [];
    let startTime = this.startPeriodTime;
    if (this.sitePeriod == "2H") {
      for (let i = 0; i < 12 + 1; i++) {
        let mi = Math.floor(startTime.getMinutes() / 10) * 10;
        let hh = startTime.getHours();
        // console.log("mi: ",mi);
        if (mi == 0) {
          this.category.push(hh + ":00");
        }
        else {
          this.category.push(hh + ":" + mi);
        }
        this.data.push(0);
        maxData.push(-1);
        minData.push(-1);
        startTime = new Date(startTime.getTime() + 10 * 60 * 1000);
      }
      //this.category = this.category.reverse();
      this.siteRainData.forEach(element => {
        let tempTime = new Date(Utils.utc2beijing(element.collecttime));
        let tempHour = tempTime.getHours();
        let tempMinute = Math.floor(tempTime.getMinutes() / 10) * 10;
        let tempCategory;
        // console.log("tempMinute: ",tempMinute);
        if (tempMinute == 0) {
          tempCategory = tempHour + ":00";
        }
        else {
          tempCategory = tempHour + ":" + tempMinute;
        }
        let tempIndex = this.category.indexOf(tempCategory);
        this.data[tempIndex] += parseFloat(element.paravalue) ;
        // console.log(this.category[tempIndex], this.data[tempIndex], element.paravalue);
        // if (maxData[tempIndex] < element.paravalue) {
        //   maxData[tempIndex] = element.paravalue;
        // }
        // if (minData[tempIndex] == -1 || minData[tempIndex] > element.paravalue) {
        //   minData[tempIndex] = element.paravalue;
        // }
      });
    }
    else {
      //startTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000);
      for (let i = 0; i < 12 + 1; i++) {
        let day = startTime.getDate();
        let hh = startTime.getHours();
        this.category.push(day + "日" + hh + "时");
        this.data.push(0);
        maxData.push(-1);
        minData.push(-1);
        startTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000);
      }
      //this.category = this.category.reverse();
      this.siteRainData.forEach(element => {
        let tempTime = new Date(Utils.utc2beijing(element.collecttime));
        let tempDay = tempTime.getDate();
        let temp2Hours = tempTime.getHours();
        let tempIndex = this.category.indexOf(tempDay + "日" + temp2Hours + "时");
        if (tempIndex < 0) {
          let tempTime1 = new Date(new Date(Utils.utc2beijing(element.collecttime)).getTime() - 1 * 60 * 60 * 1000);
          console.log("Time:", tempTime, tempTime1);
          let tempDay1 = tempTime1.getDate();
          let temp2Hours1 = tempTime1.getHours();
          tempIndex = this.category.indexOf(tempDay1 + "日" + temp2Hours1 + "时");
        }
        this.data[tempIndex] += parseFloat(element.paravalue) ;
        // if (maxData[tempIndex] < element.paravalue) {
        //   maxData[tempIndex] = element.paravalue;
        // }
        // if (minData[tempIndex] == -1 || minData[tempIndex] > element.paravalue) {
        //   minData[tempIndex] = element.paravalue;
        // }
      });
    }
    // for (let i = 0; i < 12; i++) {
    //   console.log(this.category[i], maxData[i], minData[i]);
    //   if (i == 0) {
    //     if (maxData[i] > 0 && minData[i] > 0) {
    //       this.data[i] = maxData[i] - minData[i];
    //     }
    //     else {
    //       this.data[i] = (maxData[i] > 0) ? maxData[i] : 0;
    //     }
    //   }
    //   else {
    //     if (maxData[i] == -1) {
    //       this.data[i] = 0;
    //     }
    //     else {
    //       this.data[i] = maxData[i] - maxData[i - 1];
    //     }
    //   }
    // }
    console.log("category", this.category);
    console.log("data", this.data)
    //Create Chart
    this.chartOption = {
      color: ['#3398DB'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        },
        "triggerOn": 'click'
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
          animation: true,
          itemStyle: {
            normal: {
              barBorderRadius: [10, 10, 0, 0],
            }
          }
        }
      ]
    };
  }
  showTwoBtn(siteTitle, areaCode) {
    this.resetTime();
    this.IsShowTwoBtnDialog = true;
    this.IsShowCover = true;
    this.siteTitle = siteTitle; console.log("siteTitle", siteTitle);
    this.siteCode = areaCode;
    if (siteTitle == "2H") {
      // this.startPeriodTime = new Date((new Date().getTime() - 2 * 60 * 60 * 1000));
      this.startPeriodTime = new Date((this.currentTime.getTime() - 2 * 60 * 60 * 1000));
    }
    else {
      // this.startPeriodTime = new Date((new Date().getTime() - 24 * 60 * 60 * 1000));
      this.startPeriodTime = new Date((this.currentTime.getTime() - 24 * 60 * 60 * 1000));
    }
    console.log("startPeriodTime", this.startPeriodTime);
    this.refeshSiteChart();
  }

  twoBtnCancel() {
    this.data = [];
    this.chartOption = null;
    this.sitePeriod = "24H";
    this.IsShowTwoBtnDialog = false;
    this.IsShowCover = false;
  }

  twoBtnSure() {
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

}
