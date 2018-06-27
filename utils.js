/**
 * @工具函数库
 * @date:2016-5-14
 */
import hasOwn from '../var/hasOwnProperty';
import 'whatwg-fetch';//fetch polyfill

//服务器渲染才用到
/*import nodeFetch from 'node-fetch';

//node环境下使用node-fetch替换原生window.fetch
let fetchApi=nodeFetch;
try {
  if (typeof window!=='undefined')　fetchApi = window.fetch;
}catch (e){}*/

let fetchApi = window.fetch;

/**
 * fetch异部获取数据
 * 使用时注意：
 * 1.是否需要设置请求头headers　'Content-Type':'application/x-www-form-urlencoded',
 * 2.发送数据body是否需要序列化，可以使用param方法
 * @param url {String}
 * @param opts [Object]
 */
export const fetch = (url, opts = {}) => fetchApi(url, Object.assign({ method: 'get' }, opts))
    .then(response => {
      if (200 <= response.status && response.status < 300) {
        if (opts.type === 'text') {
          return response.text();
        }
        
        return response.json();
      } else {
        //return {code:response.status,error:response.statusText};
        /*const err = new Error(response.statusText);
        err.response = response;
        
        throw err;*/
        /*const e=new Error('fetch data err!');
        e.error=response.statusText;
        e.code=response.status;*/
        throw {code:response.status,error:response.statusText};
      }
    });

/**
 * 生成随机字符串
 * @param len　[number=32]
 * @returns {string}
 */
export const randomStr = (len = 42) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let str = '';
  
  for (; len > 0; len--) {
    str += chars.charAt(Math.trunc(Math.random() * chars.length));
  }
  
  return str;
};

/**
 * 检测数据类型
 * @param obj
 * @returns {string}
 */
export const type = obj => {
  //null,undefinded
  if (obj == null) {
    return obj + "";
  }
  
  let type = typeof obj;
  
  if (type === 'object') {
    type = Object.prototype.toString.call(obj).slice(8, -1).toLocaleLowerCase();
  }
  
  return type;
};

/**
 * 纯对象判断
 * @param obj
 * @returns {*|boolean}
 */
export const isPlainObject = obj => obj.constructor && obj.constructor.name === 'Object' && obj.constructor.prototype.hasOwnProperty('hasOwnProperty');

/**
 * 对象参数序列化
 * @param obj {Object}
 * @returns {string}
 */
export const param = obj => {
  const returnData = [];
  
  // If an array was passed in, assume that it is an array of form elements.
  if (Array.isArray(obj) || !isPlainObject(obj)) {
    // Serialize the form elements
    for (let item of obj) {
      add(item.name, item.value, returnData);
    }
  } else {
    // If traditional, encode the 'old' way (the way 1.3.2 or older
    // did it), otherwise encode params recursively.
    for (let key of Object.keys(obj)) {
      buildParams(key, obj[key], add, returnData);
    }
  }
  
  // Return the resulting serialization
  return returnData.join('&');
  
  /*param辅助函数*/
  function add(key, valueOrFunction, data) {
    // If value is obj function, invoke it and use its return value
    const value = typeof valueOrFunction === 'function'
        ? valueOrFunction(): valueOrFunction;
    
    data.push(encodeURIComponent(key) + '=' + encodeURIComponent(value === null ? '': value));
  }
  
  function buildParams(key, value, add, data) {
    const isBracket = /[]$/.test(key);
    
    if (Array.isArray(value)) {
      // Serialize array navs.
      // 序列化数组项
      for (let [i, v] of value.entries()) {
        if (isBracket) {
          // Treat each array navs as a scalar.
          add(key, v, data);
        } else {
          // Item is non-scalar (array or object), encode its numeric index.
          buildParams(key + '[' + (typeof v === 'object' && v !== null ? i: '') + ']', v, add, data);
        }
      }
    } else if (typeof value === 'object' && value !== null) {
      // Serialize object navs.
      for (let name of Object.keys(value)) {
        buildParams(key + '[' + name + ']', value[name], add, data);
      }
    } else {
      // Serialize scalar navs.
      add(key, value, data);
    }
  }
};

/**
 * 函数节流生成器
 * 应用场景：鼠标移动，mousemove事件；DOM元素动态定位，window对象的resizet和scroll事件
 * @param fn [Function] -节流函数
 * @param delay {Number} - 控制函数连续调用的频率
 * @returns {Function}
 */
export const throttle = (fn, delay) => {
  let timer = null;
  
  return function (...arg) {
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, arg);
    }, delay);
  }
};

/**
 * 高频执行函数防抖生成器，
 * @param fn {function} - 绑定需要防抖函数
 * @param wait {Number} -空闲时间间隔，空闲时间必须大于或等于此值时才会执行调用函数
 * @param immediate [Boolean] - 无此参数或此参数为false时，执行函数在空闲时间间隔之后执行；相反刚在之前执行。
 * @returns {Function}
 */
export const debounce = (fn, wait, immediate) => {
  let timeout;
  
  return function (...args) {
    clearTimeout(timeout);
    
    if (immediate && !timeout) {
      fn.apply(this, args);
    }
    
    timeout = setTimeout(() => {
      timeout = null;
      if (!immediate) {
        fn.apply(this, args);
      }
    }, wait);
  };
};

/**
 * 解析字符串形式的对象为js对象，如：{name:'ruying'}
 * @param optsStr {String}
 * @returns {*}
 */
export const parseOptions = optsStr => {
  if (optsStr) {
    try {
      return (new Function('return JSON.parse(JSON.stringify(' + optsStr + '));'))();
    } catch (e) {
      throw e;
    }
  }
};

/**
 * 生成唯一id值
 * @param prfix [String='r']
 * @returns {string}
 */
let id = 0;
export const guid = (prfix = '') => `${prfix}_${+(new Date()) + '_' + id++}`;

/**
 * 中划线形式单词转换为驼峰式单词
 * @param str {String}
 * @returns {String}
 */
export const camelCase = str => {
  str = str.toLowerCase();
  
  const keyArr = str.split('-');
  
  if (keyArr.length === 1) {
    return str;
  }
  
  return keyArr.reduce((prevItem, nextItem) => prevItem + nextItem.charAt(0).toLocaleUpperCase() + nextItem.slice(1));
};

/**
 * A simple javascript utility for conditionally joining classNames together.
 * http://jedwatson.github.io/classnames
 * @returns {string}
 */
export const classnames = (...args) => {
  const classes = [];
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (!arg) continue;
    
    const argType = typeof arg;
    
    if (argType === 'string' || argType === 'number') {
      classes.push(arg);
    } else if (Array.isArray(arg)) {
      classes.push(classnames.apply(null, arg));
    } else if (argType === 'object') {
      for (let key in arg) {
        if (hasOwn.call(arg, key) && arg[key]) {
          classes.push(key);
        }
      }
    }
  }
  
  return classes.join(' ');
};


/**
 * 函数记录器
 * @param arr
 */
export const recFn=arr=>fnName=>arr.push(fnName);

/**
 * 函数是否已记录检查
 * @param arr
 */
export const hasRecFn=arr=>fnName=>arr.includes(fnName);
