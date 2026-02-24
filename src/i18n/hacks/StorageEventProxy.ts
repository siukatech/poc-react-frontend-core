/**
 * Reference:
 * https://stackoverflow.com/a/69380917
 */

Storage.prototype.setItem = new Proxy(Storage.prototype.setItem, {
  apply(target, thisArg, argumentList) {
    // console.debug(`Storage.prototype.setItem - Proxy - thisArg: `, thisArg);
    // console.debug(`Storage.prototype.setItem - Proxy - (thisArg === localStorage): `, (thisArg === localStorage));
    // console.debug(`Storage.prototype.setItem - Proxy - (thisArg === sessionStorage): `, (thisArg === sessionStorage));
    const event = new CustomEvent('storagecustom', {
      detail: {
        storageArea: thisArg,
        key: argumentList[0],
        oldValue: thisArg.getItem(argumentList[0]),
        newValue: argumentList[1],
      },
    });
    window.dispatchEvent(event);
    return Reflect.apply(target, thisArg, argumentList);
  },
});

Storage.prototype.removeItem = new Proxy(Storage.prototype.removeItem, {
  apply(target, thisArg, argumentList) {
    const event = new CustomEvent('storagecustom', {
      detail: {
        storageArea: thisArg,
        key: argumentList[0],
      },
    });
    window.dispatchEvent(event);
    return Reflect.apply(target, thisArg, argumentList);
  },
});

Storage.prototype.clear = new Proxy(Storage.prototype.clear, {
  apply(target, thisArg, argumentList) {
    const event = new CustomEvent('storagecustom', {
      detail: {
        storageArea: thisArg,
        key: '__all__',
      },
    });
    window.dispatchEvent(event);
    return Reflect.apply(target, thisArg, argumentList);
  },
});
