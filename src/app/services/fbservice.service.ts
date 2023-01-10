import { Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  Firestore,
  query,
  setDoc,
  where,
} from '@angular/fire/firestore';
import { concatMap, from, map, Observable, of, switchMap, take } from 'rxjs';
import { addDoc, updateDoc } from '@firebase/firestore';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  User,
  UserInfo,
} from '@angular/fire/auth';
import {
  getDownloadURL,
  ref,
  Storage,
  uploadBytes,
} from '@angular/fire/storage';
import { FBUye } from '../models/FBUye';
import { FBOdev } from '../models/FBOdev';
import { Router } from '@angular/router';
// import { AngularFireAuth } from '@angular/fire/compat/auth';
// import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root',
})
export class FbserviceService {
  [x: string]: any;
  user!: any;
  loggedIn!: any;
  aktifUye = authState(this.auth);
  constructor(
    public fs: Firestore,
    public router: Router,
    public auth: Auth,
    public storage: Storage // public af: AngularFireAuth,
  ) {}

  KayitOl(mail: string, parola: string) {
    return from(createUserWithEmailAndPassword(this.auth, mail, parola));
  }
  OturumAc(mail: string, parola: string) {
    return from(signInWithEmailAndPassword(this.auth, mail, parola));
  }
  OturumKapat() {
    this.router.navigate(['']);
    return from(this.auth.signOut());
  }

  // return from(
  //   signInWithPopup(this.auth, new firebase.auth.GoogleAuthProvider())
  // );
  // return from(
  //   signInWithPopup(this.auth, new firebase.auth.GoogleAuthProvider())
  // );

  get AktifUyeBilgi() {
    return this.aktifUye.pipe(
      switchMap((user) => {
        if (!user?.uid) {
          return of(null);
        }
        const ref = doc(this.fs, 'Uyeler', user?.uid);
        return docData(ref);
      })
    );
  }

  OdevListele(uid: any) {
    var ref = collection(this.fs, 'Odevler');
    return this.aktifUye.pipe(
      concatMap((user) => {
        const myQuery = query(ref, where('uid', '==', uid));
        return collectionData(myQuery, { idField: 'gorevId' });
      })
    );
  }

  OdevEkle(odev: FBOdev) {
    var ref = collection(this.fs, 'Odevler');
    return this.aktifUye.pipe(
      take(1),
      concatMap((user) =>
        addDoc(ref, {
          odevDurum: odev.odevDurum,
          odevAdi: odev.odevAdi,
          uid: odev.uid,
        })
      ),
      map((ref) => ref.id)
    );
  }

  OdevDuzenle(odev: any) {
    var ref = doc(this.fs, 'Odevler/' + odev.gorevId);
    return updateDoc(ref, { ...odev });
  }

  OdevSil(odev: any) {
    var ref = doc(this.fs, 'Odevler/' + odev.gorevId);
    return deleteDoc(ref);
  }
  // GorevEkle(gorev: Gorev) {
  //   var ref = collection(this.fs, 'Gorevler');
  //   return this.aktifUye.pipe(
  //     take(1),
  //     concatMap((user) =>
  //       addDoc(ref, {
  //         baslik: gorev.baslik,
  //         aciklama: gorev.aciklama,
  //         tamam: gorev.tamam,
  //         uid: user?.uid,
  //       })
  //     ),
  //     map((ref) => ref.id)
  //   );
  // }
  // GorevDuzenle(gorev: Gorev) {
  //   var ref = doc(this.fs, 'Gorevler/' + gorev.gorevId);
  //   return updateDoc(ref, { ...gorev });
  // }
  // GorevSil(gorev: Gorev) {
  //   var ref = doc(this.fs, 'Gorevler/' + gorev.gorevId);
  //   return deleteDoc(ref);
  // }

  UyeListele() {
    var ref = collection(this.fs, 'Uyeler');
    return collectionData(ref, { idField: 'uid' }) as Observable<FBUye[]>;
  }
  UyeEkle(uye: any) {
    var ref = doc(this.fs, 'Uyeler', uye.uid);
    return from(setDoc(ref, uye));
  }
  UyeDuzenle(uye: any) {
    console.log(uye);
    var ref = doc(this.fs, 'Uyeler', uye.uid);
    return from(updateDoc(ref, { ...uye }));
  }
  UyeSil(uye: FBUye) {
    var ref = doc(this.fs, 'Uyeler', uye.uid);
    return deleteDoc(ref);
  }

  uploadImage(image: File, path: string): Observable<string> {
    const storageRef = ref(this.storage, path);
    const uploadTask = from(uploadBytes(storageRef, image));
    return uploadTask.pipe(switchMap((result) => getDownloadURL(result.ref)));
  }
}
