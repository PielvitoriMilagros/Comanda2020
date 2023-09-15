import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';

const routes: Routes = [
  {path: '',redirectTo: 'splash',pathMatch: 'full'},
  {path: 'home',loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule),canActivate:[AuthGuard]},
  {path: 'splash',loadChildren: () => import('./pages/splash/splash.module').then( m => m.SplashPageModule)},
  {path: 'login',loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)},
  {path: 'register/:perfil',loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)},
  {path: 'surveys',loadChildren: () => import('./pages/surveys/surveys.module').then( m => m.SurveysPageModule)},
  {path: 'create/:producto',loadChildren: () => import('./pages/create/create.module').then( m => m.CreatePageModule)},
  {path: 'listing/:tipoList',loadChildren: () => import('./pages/listing/listing.module').then( m => m.ListingPageModule)},
  {path: 'client',loadChildren: () => import('./pages/client/client.module').then( m => m.ClientPageModule)},
  {path: 'bill',loadChildren: () => import('./pages/bill/bill.module').then( m => m.BillPageModule)},  {
    path: 'games',
    loadChildren: () => import('./pages/games/games.module').then( m => m.GamesPageModule)
  },











];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
