import { WatchlistType } from "../../../api-kit/watchlist/watchlist.service";


export class Watchlist {
  private _raw: WatchlistType = {
    type: '',
    domainId: 'WDL',
    recordId: '',
    active: 'Y',
    frequency: 'daily',
    uri: 'path'
  };

  constructor() {  }

  id(): number {
    return this._raw.watchlistId;
  }

  setId(id) {
    this._raw.watchlistId = id;
  }

  active(): string {
    return this._raw.active;
  }

  setActive(active : string) {
    this._raw.active = active;
  }

  domainId(): string {
    return this._raw.domainId;
  }
  setDomainId(domainId: string) {
    this._raw.domainId = domainId;
  }

  recrodId(): string {
    return this._raw.recordId;
  }
  setRecordId(recordId: string) {
    this._raw.recordId = recordId;
  }

  frequency(): string {
    return this._raw.frequency;
  }
  setFrequency(frequency: string) {
    this._raw.frequency = frequency;
  }

  uri(): string {
    return this._raw.uri;
  }
  setUri(uri: string) {
    this._raw.uri = uri;
  }

 
  raw(): WatchlistType {
    return this._raw;
  }

  static FromResponse(res: WatchlistType): Watchlist {
    let a = new Watchlist();
    a._raw = res;
    return a;
  }
}
