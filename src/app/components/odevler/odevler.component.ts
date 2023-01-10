import { JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FBOdev } from 'src/app/models/FBOdev';
import { FBOgrenci } from 'src/app/models/FBOgrenci';
import { Odev } from 'src/app/models/odev';
import { Ogrenci } from 'src/app/models/ogrenci';
import { Sonuc } from 'src/app/models/sonuc';
import { DataService } from 'src/app/services/data.service';
import { FbserviceService } from 'src/app/services/fbservice.service';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-odevler',
  templateUrl: './odevler.component.html',
  styleUrls: ['./odevler.component.scss'],
})
export class OdevlerComponent implements OnInit {
  odev!: Odev[];
  ogrenci!: Ogrenci[];
  secOdev: Odev = new Odev();
  secOgr!: FBOgrenci;
  ogrId!: number;
  currentOgrName!: any;
  sonuc: Sonuc = new Sonuc();
  nameOgr!: any;
  fbOdev!: FBOdev[];
  fbSecOdev: FBOdev = new FBOdev();

  constructor(
    public servis: DataService,
    public route: ActivatedRoute,
    public fbservice: FbserviceService,
    public toast: HotToastService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((s) => {
      this.ogrId = s['ogrId'];
      this.ogrGetir();
      this.fbSecOdev.uid = s['ogrId'];
      console.log(this.fbSecOdev.uid);
      this.odevGetir();
      // this.ogrListeGetir();
      // this.secOdev.id = 0;
      // this.secOdev.ogrId = this.ogrId;
    });
    this.fbservice.UyeListele().subscribe((d) => {
      this.currentOgrName = d.filter((d: any) => d?.uid == this.ogrId);
      for (let x in this.currentOgrName) {
        this.nameOgr = this.currentOgrName[x].displayName;
      }
    });
  }

  ogrGetir() {
    this.fbservice.UyeListele().subscribe((d: any) => {
      this.secOgr = d.filter((d: any) => d.uid == this.ogrId);
      this.currentOgrName = this.secOgr.displayName;
    });
    // this.servis.ogrenciById(this.ogrId).subscribe((d: any) => {
    //   this.secOgr = d;
    // });
  }

  odevGetir() {
    this.fbservice.OdevListele(this.ogrId).subscribe((d: any) => {
      this.fbOdev = d.filter((a: any) => a.uid == this.fbSecOdev.uid);
    });
  }

  ogrListeGetir() {
    this.servis.ogrenciListe().subscribe((d: any) => {
      this.ogrenci = d;
    });
  }

  tamamla(od: FBOdev) {
    console.log(od);
    od.odevDurum = '1';
    this.fbservice.OdevDuzenle(od);
  }

  duzenle(odv: FBOdev) {
    Object.assign(this.secOdev, odv);
  }

  sil(od: FBOdev) {
    this.fbservice.OdevSil(od);
    // this.servis.odevSil(od.id).subscribe(
    //   (d) => {
    //     this.sonuc.islem = true;
    //     this.sonuc.mesaj = 'Ders Silindi';
    //     this.ogrListeGetir();
    //     this.odevGetir();
    //     this.secOdev = new Odev();
    //     this.secOdev.id = 0;
    //   },
    //   (err) => {
    //     this.sonuc.islem = false;
    //     this.sonuc.mesaj = 'Hata Oluştu';
    //   }
    // );
  }

  iptal() {
    this.secOdev = new Odev();
    this.secOdev.id = 0;
    this.secOdev.ogrId = this.ogrId;
    this.sonuc = new Sonuc();
  }

  kaydet() {
    this.fbSecOdev.odevDurum = '0';
    this.fbservice
      .OdevEkle(this.fbSecOdev)
      .pipe(
        this.toast.observe({
          success: 'Ödev Eklendi',
          loading: 'Ödev Ekleniyor...',
          error: ({ message }) => `${message}`,
        })
      )
      .subscribe();
    // if (this.secOdev.id == 0) {
    //   this.servis.odevEkle(this.secOdev).subscribe(
    //     (d) => {
    //       this.sonuc.islem = true;
    //       this.sonuc.mesaj = 'Ödev Eklendi';
    //       this.odevGetir();
    //       this.secOdev = new Odev();
    //       this.secOdev.id = 0;
    //       // this.secOdev.ogrId = Math.floor(Math.random() * 100);
    //     },
    //     (err) => {
    //       this.sonuc.islem = false;
    //       this.sonuc.mesaj = 'Hata Oluştu';
    //     }
    //   );
    // } else {
    //   this.servis.odevDuzenle(this.secOdev).subscribe(
    //     (d) => {
    //       this.sonuc.islem = true;
    //       this.sonuc.mesaj = 'Ödev Düzenlendi ve Eklendi';
    //       this.odevGetir();
    //       this.secOdev = new Odev();
    //       this.secOdev.id = 0;
    //     },
    //     (err) => {
    //       this.sonuc.islem = false;
    //       this.sonuc.mesaj = 'Hata Oluştu';
    //     }
    //   );
    // }
  }
}
