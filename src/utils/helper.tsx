export const getItemFromStorage: any = (
  key: string,
  storage: string = "localStorage"
) => {
  let _window = window as any;
  const item: any = _window[storage].getItem(key);
  let result = null;
  try {
    result = item ? JSON.parse(item) : null;
  } catch {
    result = item;
  }
  return result;
};

export const setItemInStorage: any = (
  name: any,
  data: any,
  storage = "localStorage"
) => {
  let _window = window as any;
  _window[storage].setItem(name, JSON.stringify(data));
};

export const removeItemFromStorage: any = (
  name: any,
  storage = "localStorage"
) => {
  let _window = window as any;
  _window[storage].removeItem(name);
};
