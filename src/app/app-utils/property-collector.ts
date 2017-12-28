import * as _ from 'lodash';

export type ObjectPath = Array<any>;

export class PropertyCollector {
  constructor(private obj: any) { }

  collect(path: ObjectPath): any[] {
    return this.helper(path, [], this.obj);
  }

  private helper(path: ObjectPath, currentPath: ObjectPath, currentObject: any): any[] {
    if (_.isUndefined(currentObject)) {
      return [];
    }
    if (_.isEqual(path, currentPath)) {
      return [currentObject];
    }
    let nextProperty = path[currentPath.length];
    let nextPath = _.clone(currentPath);
    nextPath.push(nextProperty);
    if (_.isEqual(nextProperty, [])) {
      let ret = [];
      if (!_.isArray(currentObject)) {
        return [];
      }
      currentObject.forEach(i => {
        let children = this.helper(path, nextPath, i);
        if (children) {
          ret = ret.concat(children);
        }
      });
      return ret;
    } else {
      if (_.isObject(currentObject) || _.isArray(currentObject)){
        let nextObject = currentObject[nextProperty];
        return this.helper(path, nextPath, nextObject);
      } else {
        return [];
      }
    }
  }
}
