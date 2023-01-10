import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { OdevlerComponent } from './components/odevler/odevler.component';
import { AuthGuard } from './services/auth.guard';
import {
  canActivate,
  redirectUnauthorizedTo,
  redirectLoggedInTo,
} from '@angular/fire/auth-guard';

const redirectToLogin = () => redirectUnauthorizedTo(['']);
const redirectToHome = () => redirectLoggedInTo(['home']);

const routes: Routes = [
  { path: '', component: LoginComponent, ...canActivate(redirectToHome) },
  {
    path: 'odev/:ogrId',
    component: OdevlerComponent,
    ...canActivate(redirectToLogin),
  },
  {
    path: 'home',
    component: HomeComponent,
    ...canActivate(redirectToLogin),

    data: {
      yetkiler: ['Uye', 'Admin'],
    },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
