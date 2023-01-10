import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    public servis: DataService,
    public router: Router
  ) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
    let yetkiler = route.data["yetkiler"] as Array<string>;
    if (!this.servis.OturumKontrol()) {
      this.router.navigate(['/'], { queryParams: { returnUrl: state.url } });
    }
    var sonuc: boolean = false;
    sonuc = this.servis.YetkiKontrol(yetkiler);
    if (!sonuc) {
      this.router.navigate(['/'], { queryParams: { returnUrl: state.url } });
    }
    return sonuc;
  }

}
