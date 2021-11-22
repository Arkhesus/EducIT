import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'connect',
    pathMatch: 'full'
  },

  {
    path: 'connect',
    loadChildren: () => import('./connect/connect.module').then( m => m.ConnectPageModule)
  },
  {
    path: 'manage-access',
    loadChildren: () => import('./manage-access/manage-access.module').then( m => m.ManageAccessPageModule)
  },
  {
    path: 'new-info',
    loadChildren: () => import('./new-info/new-info.module').then( m => m.NewInfoPageModule)
  },
  {
    path: 'dashboard/:class/:course',
    loadChildren: () => import('./dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'new-game/:class/:course',
    loadChildren: () => import('./new-game/new-game.module').then( m => m.NewGamePageModule)
  },
  {
    path: 'play-game/:class/:course/:game',
    loadChildren: () => import('./play-game/play-game.module').then( m => m.PlayGamePageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
