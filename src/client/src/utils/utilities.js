import React from 'react';

export const formatNumber = (x, separator) => {
  if (x) return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator || ',');
  else return x;
};

export const formatMoney = (x, currency = '$', separator) => {
  if (x) {
    return currency + '' + formatNumber(x, separator);
  } else {
    return '';
  }
};

export const any = (array, checker) => {
  array = array || [];
  let found = false;
  array.forEach((element) => {
    let res = checker(element);
    if (res === true) {
      found = true;
      return true;
    }
  });

  return found;
};

export const findOne = (array, checker) => {
  array = array || [];
  for (let index = 0; index < array.length; index++) {
    let element = array[index];
    let res = checker(element);
    if (res === true) {
      return element;
    }
  }

  return null;
};

export const modify = (array, key, expression) => {
  for (let index = 0; index < array.length; index++) {
    const element = array[index];
    if (key(element) === true) {
      array[index] = expression(element);
    }
  }
};

export const firstIndex = (array, key) => {
  for (let index = 0; index < array.length; index++) {
    const element = array[index];
    if (key(element) === true) {
      return index;
    }
  }

  return -1;
};

const isEmpty = (obj) => {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
};

export const isNullOrEmpty = (obj) => {
  if (typeof obj === 'undefined') return true;
  if (!obj) return true;
  if (Array.isArray(obj) && obj.length <= 0) return true;
  if (typeof obj === 'object' && isEmpty(obj)) return true;

  return false;
};

let lastId = 0;
export const componentId = (prefix) => {
  return prefix + `${lastId++}`;
};

let lastDataId = 0;
export const dataId = (prefix) => {
  return prefix + `${lastDataId++}`;
};

export const setCookie = (name, value, days) => {
  let expires = '';
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = '; expires=' + date.toUTCString();
  }
  document.cookie = name + '=' + (value || '') + expires + '; path=/';
};

export const deleteCookie = (name) => {
  document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};

export const storageGetItem = (key) => localStorage.getItem(key);

export const storageSetItem = (key, value) => localStorage.setItem(key, value);

export const storageRemoveItem = (key) => localStorage.removeItem(key);

export const normalizePhone = (phone) => {
  phone = phone.replace('+', '');
  // if (phone.length > 0)
  //         phone = phone[0] !== '0' ? '0' + phone : phone

  return phone;
};
export const toPascalCase = (s) => {
  return s
    ? s.replace(/(\w)(\w*)/g, function (g0, g1, g2) {
        return g1.toUpperCase() + g2.toLowerCase();
      })
    : s;
};

export const compareArrayOfString = (array1, array2) => {
  if (!(Array.isArray(array1) && Array.isArray(array2))) return false;

  if (array1.length != array2.length) return false;

  array1.sort();
  array2.sort();

  for (let index = 0; index < array1.length; index++) {
    const element = array1[index];
    if (element != array2[index]) return false;
  }

  return true;
};

export const convertRemToPixels = (rem) => {
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
};

export const round = (value, precision) => {
  var multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
};

export const IsJsonString = (str) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};
