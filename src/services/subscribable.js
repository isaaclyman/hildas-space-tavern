export class Subscribable {
  constructor(name) {
    this._name = name
    this._subscribers = []
  }

  onEvent(fn) {
    this._subscribers.push(fn)
  }

  removeSubscriber(fn) {
    const ix = this._subscribers.indexOf(fn)
    if (ix === -1) {
      console.warn(
        `Attempted to remove subscriber '${fn}' from Subscribable '${this._name}', but subscriber was not found.`
      )
      return
    }

    this._subscribers.splice(ix, 1)
  }

  trigger(value) {
    for (const s of this._subscribers) {
      s(value)
    }
  }
}
