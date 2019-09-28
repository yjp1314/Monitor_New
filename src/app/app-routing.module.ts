import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs/tabs.page';
import { Tab1Page } from './tab1/tab1.page';
// import { Tab2Page } from './tab2/tab2.page';
// import { Tab3Page } from './tab3/tab3.page';
// import { DemoPage } from './demo/demo.page';
// import { demoRoutes } from './routers/demo.router';
import { MinePage } from './mine/mine.page';
// import { mineRoutes } from './routers/mine.router';

const routes: Routes = [
  {
    path: '', redirectTo: 'login', pathMatch: 'full'
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
  },
  // {
  //   path: 'tabs',
  //   component: TabsPage,
  //   children: [
  //     { path: 'tab1', component: Tab1Page },
  //     { path: 'tab2', component: DemoPage },//Tab2Page
  //     { path: 'tab3', component: MinePage },//Tab3Page
  //   ]
  // },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
