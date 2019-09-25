import { Component } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { NativeService } from './providers/NativeService';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public nav: NavController,
    public router: Router,
    public native: NativeService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    // this.platform.ready().then(() => {
    //   this.statusBar.styleDefault();
    //   this.splashScreen.hide();
    // });
    this.platform.ready().then(() => {
      this.nav.navigateRoot('/login');
      // const oldToken = Storage.localStorage.get('token'); // 从缓存中获取token
      // if (oldToken) {
      //     GlobalData.token = oldToken; // 旧token作为请求头参数，用旧token获取新token
      //     this.auth.getNewToken().pipe(
      //         mergeMap(token => {
      //             GlobalData.token = token;
      //             Storage.localStorage.set('token', token);
      //             return this.auth.getUserInfo();
      //         })
      //     ).subscribe((userInfo: UserInfo) => {
      //         this.helper.loginSuccessHandle(userInfo);
      //         this.nav.navigateRoot('/tabs/tab1'); // 会根据url自动匹配路由
      //     }, () => {
      //         this.nav.navigateRoot('/login');
      //     });
      // } else {
      //     this.nav.navigateRoot('/login');
      // }
      this.native.setStatusBarStyle();
      this.native.hideSplashScreen();
      // this.versionService.checkVersion();
    });
  }
}
