/**
 * Event listener class, based off Stoyan Stefanov's implementation
 * in Object Oriented Javascript.
 * 
 * Justification: I wanted to use events without having to rely on
 * the DOM, since we could move the project to server side rendering
 * or potentially other platforms in the future (mobile via
 * NativeScript or similar, for example).
 */

export class SamEventListener {
  /**
   * Properties are the names of events.
   * 
   * The arrays for each property essentially hold callbacks
   * that are executed whenever the event is fired. In this
   * implementation, each item in the array is an object with
   * a callback and an optional context. See addEventListener
   */
  private _subscribers: any = {
    /**
     * End users can subscribe to the class without specifying
     * an event. In this case, it will default to "any".
     */
    any: [],
  };

  /**
   * 
   * @param args Any number of args is allowed. Each must be a string representing the name of an event.
   * 
   * More events can be added after initialization via registerEvent method.
   */
  constructor(...args) {
    /**
     * Args is not an Array type, so using this hack to call forEach.
     */
    [].forEach.call(args, arg => {
      if (typeof arg === 'string') {
        if (!this._subscribers[arg]) {
          this._subscribers[arg] = [];
        }
      }
    });
  }

  /**
   * 
   * @param type Name of event
   * @param fn Callback to execute when event fires
   * @param context Value to use for 'this' when callback is fired
   */
  public addEventListener(type: string, fn: Function, context?: any) {
    type = type || 'any';
    if (!this._subscribers[type]) {
      this._subscribers[type] = [];
    }
    this._subscribers[type].push({ fn: fn, context: context || this });
    return this;
  }

  /**
   * 
   * @param type Name of event
   * @param fn Callback that was registered with event when listener added
   * @param context Value used for 'this' when originally registered
   */
  public removeEventListener(type: string, fn: Function, context?: any) {
    this._visitSubscribers('unsubscribe', type, fn, context || this);
    return this;
  }

  /**
   * 
   * @param subscriber String representing name to use for new event
   */
  public registerEvent(subscriber: string) {
    if (!this._subscribers[subscriber]) {
      this._subscribers[subscriber] = [];      
    }
    return this;
  }

  /**
   * 
   * @param type Name of event to fire
   * @param publication Args to be passed into callbacks
   */
  public fire(type: string, publication?: any) {
    this._visitSubscribers('publish', type, publication);
    return this;
  }

  /**
   * 
   * @param action Name of action for switch case
   * @param type Name of event to fire
   * @param args Additional args to pass into callbacks
   * @param context Context to use for 'this'
   */
  private _visitSubscribers(action: string, type: string, args: any, context?: any ) {
    let pubtype = type || 'any';
    switch (action) {
      case "publish":
        this._subscribers[type].forEach(sub => sub.fn.call(sub.context, args));
        break;
      case "unsubscribe":
        this._subscribers[type].forEach((sub, idx) => {
          if (sub.fn === args && sub.context === context) {
            this._subscribers.splice(idx, 1);
          }
        });
        break;
      default:
        break;
    }
    return this;
  }
}