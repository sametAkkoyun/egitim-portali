import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Odev } from '../models/odev';
import { Ogrenci } from '../models/ogrenci';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public apiUrl = "http://localhost:3000/";

  constructor(
    public http: HttpClient
  ) { }

  /* Üye Login Servis Başlanğıç */

  ParolaUret(s: number) {
    var st: string = "abcdefghijklmnopqrstuvwxyz0123456789";
    var p = "";
    for (let i = 0; i < s; i++) {
      var r = Math.floor(Math.random() * st.length);
      p += st.charAt(r);
    }
    return p;
  }

  UyeLogin(k: string, s: string) {
    return this.http.get(this.apiUrl + "uye?kadi=" + k + "&sifre=" + s);
  }

  OturumKontrol() {
    var token = localStorage.getItem("token");
    if (token) {
      return true;
    } else {
      return false;
    }
  }

  YetkiKontrol(yetkiler: string[]) {
    var sonuc: boolean = false;
    var uyeYetkiler: string[] = JSON.parse(localStorage.getItem("uyeYetkileri") || '{}');
    if (yetkiler) {
      yetkiler.forEach(element => {
        if (uyeYetkiler.indexOf(element) > -1) {
          sonuc = true;
        }
      });
    }
    return sonuc;
  }

  /* Üye Login Servis Bitiş */

  /* Öğrenci Servis Başlanğıç */

  ogrenciListe() {
    return this.http.get(this.apiUrl + "ogrenciler");
  }

  ogrenciById(id: number) {
    return this.http.get(this.apiUrl + "ogrenciler/" + id);
  }

  ogrenciEkle(ogr: Ogrenci) {
    return this.http.post(this.apiUrl + "ogrenciler", ogr);
  }

  ogrenciDuzenle(ogr: Ogrenci) {
    return this.http.put(this.apiUrl + "ogrenciler/" + ogr.id, ogr);
  }

  ogrSil(id: number) {
    return this.http.delete(this.apiUrl + "ogrenciler/" + id);
  }

  /* Öğrenci Servis Bitiş */

  /* Ödev Servis Başlanğıç */

  odevListe() {
    return this.http.get(this.apiUrl + "odevler");
  }

  odevById(id: number) {
    return this.http.get(this.apiUrl + "odevler/" + id);
  }

  odevGetirByOgrId(oId: number) {
    return this.http.get(this.apiUrl + "odevler?ogrId=" + oId);
  }

  odevEkle(od: Odev) {
    return this.http.post(this.apiUrl + "odevler", od);
  }

  odevDuzenle(od: Odev) {
    return this.http.put(this.apiUrl + "odevler/" + od.id, od);
  }

  odevSil(id: number) {
    return this.http.delete(this.apiUrl + "odevler/" + id);
  }

  /* Ödev Servis Bitiş */
}
