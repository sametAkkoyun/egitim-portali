import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { concatMap, switchMap } from 'rxjs';
import { FBOgr } from 'src/app/models/FBOgr';
import { Ogrenci } from 'src/app/models/ogrenci';
import { Sonuc } from 'src/app/models/sonuc';
import { DataService } from 'src/app/services/data.service';
import { FbserviceService } from 'src/app/services/fbservice.service';
import { HotToastService } from '@ngneat/hot-toast';
import { FBOgrenci } from 'src/app/models/FBOgrenci';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  ogrenciler!: Ogrenci[];
  fbogrenciler!: FBOgrenci[];
  secOgr: FBOgrenci = new FBOgrenci();
  sonuc: Sonuc = new Sonuc();
  fbsecOgr: FBOgr = new FBOgr();
  der!: any;
  checkid: number = 0;
  check: boolean = false;

  constructor(
    public servis: DataService,
    public fbservice: FbserviceService,
    public router: Router,
    public toast: HotToastService
  ) {}

  ngOnInit(): void {
    this.ogrListeGetir();
    this.checkid = 0;
  }

  ogrListeGetir() {
    this.fbservice.UyeListele().subscribe((d: any) => {
      this.fbogrenciler = d;
    });
    // this.servis.ogrenciListe().subscribe((d: any) => {
    //   this.ogrenciler = d;
    // });
  }

  duzenle(ogr: FBOgrenci) {
    (<HTMLInputElement>document.querySelector('.name-input')).value =
      ogr.displayName;
    Object.assign(this.fbsecOgr, ogr);
    this.ResimYukle('a', this.fbsecOgr);
  }

  sil(ogr: FBOgrenci) {
    this.fbservice.UyeSil(ogr);
  }

  ResimYukle(event: any, ogr: any) {
    if (event !== 'a') {
      this.fbservice
        .uploadImage(event.target.files[0], `images/profile/${ogr.uid}`)
        .pipe(
          this.toast.observe({
            loading: 'Fotoğraf Yükleniyor...',
            success: 'Fotoğraf yüklendi',
            error:
              'Fotorğraf yüklenirken bir hata oluştu, lütfen daha sonra tekrar deneyin',
          }),
          concatMap((foto) =>
            this.fbservice.UyeDuzenle({ uid: ogr.uid, foto: foto })
          )
        )
        .subscribe();
    } else {
      console.log(ogr);
    }
  }

  kaydet() {
    if ((<HTMLInputElement>document.getElementById('newUser')).checked) {
      this.fbservice
        .KayitOl(this.fbsecOgr.mail, '123456')
        .pipe(
          switchMap(({ user: { uid } }) =>
            this.fbservice.UyeEkle({
              uid,
              mail: this.fbsecOgr.mail,
              displayName: this.fbsecOgr.displayName,
              ogrNo: this.fbsecOgr.ogrNo,
              foto: '',
            })
          ),
          this.toast.observe({
            success: 'Öğrenci Eklendi',
            loading: 'Öğrenci Ekleniyor...',
            error: ({ message }) => `${message}`,
          })
        )
        .subscribe(() => {});
    } else {
      this.fbservice
        .UyeDuzenle(this.fbsecOgr)
        .pipe(
          this.toast.observe({
            success: 'Öğrenci Düzenlendi',
            loading: 'Öğrenci Düzenleniyor...',
            error: ({ message }) => `${message}`,
          })
        )
        .subscribe();
    }
  }

  iptal() {
    this.secOgr = new FBOgrenci();
    this.checkid = 0;
    this.sonuc = new Sonuc();
  }
}
