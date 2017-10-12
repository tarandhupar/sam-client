import { WatchlistType } from "../../../api-kit/watchlist/watchlist.service";


export class Watchlist {
  private _raw: WatchlistType = {
    type: '',
    domainId: 'WD',
    recordId: '',
    active: 'Y',
    frequency: 'instant',
    uri: 'path',
    title: ''
  };

  constructor() {  }

  id(): number {
    return this._raw.id;
  }

  setId(id) {
    this._raw.id = id;
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

  recordId(): string {
    return this._raw.recordId;
  }
  setRecordId(recordId: string) {
    this._raw.recordId = recordId;
  }

  type(): string {
    return this._raw.type;
  }
  setType(type: string) {
    this._raw.type = type;
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

  title(): string {
    return this._raw.title;
  }
  setTitle(title: string) {
    this._raw.title = title;
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
