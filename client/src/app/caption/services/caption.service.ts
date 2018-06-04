import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from 'angularfire2/firestore';
import { map, take, filter, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CaptionModel } from '../sotre/caption-items.state';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CaptionService {
  constructor(private http: HttpClient) {}

  getCaptionList(): Observable<CaptionModel[]> {
    return this.http.get<CaptionModel[]>('/api/caption/list');
  }

  createAndUpdateCaption(id, item) {
    if (!id) {
      return this.http.post('api/caption/create', item);
    } else {
      return this.http.put(`api/caption/update/${id}`, item);
    }
  }

  removeCaption(id) {
    return this.http.delete(`api/caption/remove/${id}`);
  }

  setAreaPosition(areaPosition) {
    return this.http.post('api/caption/areaPosition', areaPosition);
  }

  getAreaPosition() {
    return this.http.get('api/caption/areaPosition');
  }

  setCustomCSS(cssStyle) {
    return this.http.post('api/caption/customCSS', { cssStyle: cssStyle });
  }

  getCustomCSS(): Observable<string> {
    return this.http
      .get('api/caption/customCSS')
      .pipe(map((item: any) => item.cssStyle));
  }

  setOBSConnectionInformation(host, port) {
    return this.http.post('api/caption/connectionInfo', {
      host: host,
      port: port
    });
  }
}
