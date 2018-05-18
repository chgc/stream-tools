import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from 'angularfire2/firestore';
import { map, take, filter, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CaptionModel } from '../sotre/caption-items.state';

@Injectable({
  providedIn: 'root'
})
export class CaptionService {
  myCaptionDocument: AngularFirestoreDocument<any>;

  constructor(private af: AngularFirestore) {}

  initFireStore(uid) {
    this.myCaptionDocument = this.af.doc(`caption/${uid}`);
  }

  getCaptionList(): Observable<CaptionModel[]> {
    const mapData = actions =>
      actions.map(action => {
        const data = action.payload.doc.data();
        const id = action.payload.id;
        return { id, ...data };
      });

    return this.myCaptionDocument
      .collection('captions')
      .snapshotChanges()
      .pipe(take(1), map(mapData));
  }

  createAndUpdateCaption(id, item) {
    id = id || this.af.createId();
    return this.myCaptionDocument
      .collection('captions')
      .doc(id)
      .set(item, { merge: true });
  }

  removeCaption(id) {
    return this.myCaptionDocument
      .collection('captions')
      .doc(id)
      .delete();
  }

  setAreaPosition(areaPosition) {
    return this.myCaptionDocument.update(areaPosition);
  }

  getAreaPosition() {
    const pluckFields = (item: any) => ({
      MAX_WIDTH: item.MAX_WIDTH,
      MAX_HEIGHT: item.MAX_HEIGHT,
      START_X: item.START_X,
      START_Y: item.START_Y
    });

    return this.myCaptionDocument
      .valueChanges()
      .pipe(take(1), filter(value => !!value), map(pluckFields));
  }

  setCustomCSS(cssStyle) {
    return this.myCaptionDocument.set({ cssStyle: cssStyle }, { merge: true });
  }

  getCustomCSS(): Observable<string> {
    return this.myCaptionDocument
      .valueChanges()
      .pipe(take(1), map(item => item.cssStyle));
  }

  setOBSConnectionInformation(host, port) {
    return this.myCaptionDocument.set(
      { connectionInfo: { host, port } },
      { merge: true }
    );
  }
}
