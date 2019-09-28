 
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { GlobalData } from './../providers/GlobalData';
import { Helper } from '../providers/Helper';
import { NavController } from '@ionic/angular';
import { HttpService } from '../providers/HttpService';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginPage implements OnInit {
  showBackButton = false;
  loading = false;
  model = {
      username: '',
      password: ''
  };
  constructor(public nav: NavController,
      public helper: Helper,
      public http: HttpService,
      public auth: AuthService,
      public storage: Storage) {
  }

  ngOnInit() {
      if (GlobalData.token) {
          this.showBackButton = true;
      }

      this.storage.get('loginmsg').then(loginmsg => {
          if (loginmsg != null) {
              this.helper.toast('自动登录中！', 1000, 'bottom');
              this.model.username = loginmsg.username;
              this.model.password = loginmsg.password;
              this.autoLogin();
          }
      });
  }


  autoLogin() {
      this.auth.login(this.model.username, this.model.password).subscribe(res => {
          if (res.isSuccess) {
              this.storage.set('loginmsg', { 'username': this.model.username, 'password': this.model.password });
              // this.helper.toast('自动登录中！', 1000, 'bottom');
              this.loading = false;
              setTimeout(() => {
                  this.nav.navigateRoot('/tabs');
              }, 1000);
          } else {
              this.loading = false;
              this.helper.toast('用户名或密码错误,请重试！', 2000, 'bottom');
              return;
          }
      }, () => {
          this.loading = false;
          this.helper.toast('系统错误,请联系管理员！', 2000, 'bottom');
          return;
      });
  }


  formSubmit() {
      if (this.model.username.length === 0) {
          this.helper.toast('用户名不能为空！', 2000, 'bottom');
          return;
      }
      if (this.model.password.length === 0) {
          this.helper.toast('密码不能为空！', 2000, 'bottom');
          return;
      }
      this.loading = true;
      this.auth.login(this.model.username, this.model.password).subscribe(res => {
          if (res.isSuccess) {
              // sessionStorage.setItem('username', this.model.username);
              // sessionStorage.setItem('password', this.model.password);
              this.storage.set('loginmsg', { 'username': this.model.username, 'password': this.model.password });
              this.loading = false;
              this.nav.navigateRoot('/tabs');
          } else {
              this.loading = false;
              this.helper.toast('用户名或密码错误,请重试！', 2000, 'bottom');
              return;
          }
      }, () => {
          this.loading = false;
          this.helper.toast('系统错误,请联系管理员！', 2000, 'bottom');
          return;
      });
  }
}
