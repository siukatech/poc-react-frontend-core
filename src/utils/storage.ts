const restoreJsonStr = (storageKey: string) => {
  // const jsonStr = sessionStorage.getItem(storageKey);
  const jsonStr = restoreRawStr(storageKey);
  if (jsonStr) {
    let jsonObj = JSON.parse(jsonStr);
    return jsonObj;
  }
  return null;
};

const saveJsonObj = (storageKey: string, jsonObj: {}) => {
  if (jsonObj != null) {
    // sessionStorage.setItem(storageKey, JSON.stringify(jsonObj));
    saveRawStr(storageKey, JSON.stringify(jsonObj));
  }
};

const restoreRawStr = (storageKey: string) => {
  const str = sessionStorage.getItem(storageKey);
  return str;
}

const saveRawStr = (storageKey: string, str: string) => {
  if (str != null) {
    sessionStorage.setItem(storageKey, str);
  }
};

export { restoreJsonStr, saveJsonObj, restoreRawStr, saveRawStr };
