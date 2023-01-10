import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Sonuc } from 'src/app/models/sonuc';
import { DataService } from 'src/app/services/data.service';
import { FbserviceService } from 'src/app/services/fbservice.service';
import { HotToastService } from '@ngneat/hot-toast';
import {
  GoogleLoginProvider,
  SocialAuthService,
} from '@abacritt/angularx-social-login';
import { FBUye } from 'src/app/models/FBUye';
import { GoogleLogin } from 'src/app/models/GoogleLogin';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  returnUrl = '';
  user: any;
  loggedIn: any;
  fbuye: GoogleLogin = new GoogleLogin();
  sonuc: Sonuc = new Sonuc();
  usermail!: any;

  constructor(
    public servis: DataService,
    public route: ActivatedRoute,
    public router: Router,
    public fbservice: FbserviceService,
    public toast: HotToastService,
    private authService: SocialAuthService
  ) {}

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
    this.authService.authState.pipe().subscribe((user) => {
      this.user = user;
      this.loggedIn = user != null;
      this.fbuye.mail = this.user.email;
      this.fbuye.displayName = this.user.name;
      this.fbuye.foto = this.user.photoUrl;
      this.usermail = this.fbuye.mail;

      this.fbservice
        .KayitOl(this.usermail, '123456')
        .pipe(
          switchMap(({ user: { uid } }) =>
            this.fbservice.UyeEkle({
              uid,
              ...this.fbuye,
            })
          ),
          this.toast.observe({
            success: 'Giriş Başarılı',
            loading: 'Giriş Yapılıyor...',
            error: ({ message }) => `${message}`,
          })
        )
        .subscribe(() => this.router.navigate(['home']));
    });
  }

  girisYap(k: string, s: string) {
    this.fbservice
      .OturumAc(k, s)
      .pipe(
        this.toast.observe({
          success: 'Giriş Yapıldı, yönlendiriliyorsunuz',
          loading: 'Giriş Yapılıyor...',
          error: ({ message }) => `${message}`,
        })
      )
      .subscribe(() => this.router.navigate(['home']));
    //   this.servis.UyeLogin(k, s).subscribe((d: any) => {
    //     if (d.length > 0) {
    //       var yetkiler = [];
    //       if (d[0].admin == 1) {
    //         yetkiler.push('Uye');
    //         yetkiler.push('Admin');
    //       } else {
    //         yetkiler.push('Uye');
    //       }
    //       localStorage.setItem('token', this.servis.ParolaUret(64));
    //       localStorage.setItem('uyeYetkileri', JSON.stringify(yetkiler));
    //       this.router.navigateByUrl(this.returnUrl);
    //     } else {
    //       this.sonuc.islem = false;
    //       this.sonuc.mesaj = 'Hatalı Giriş Yaptınız. Lütfen Yeniden Deneyiniz';
    //     }
    //   });
  }
}
