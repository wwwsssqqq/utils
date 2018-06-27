/**
 * 模块工具函数库
 */
/**
 * 日期格式转换
 */
    //1. '3-6'=>['3:00','6:00']
const timeToArr=R.split('-');
const timeFormat=R.map(time=>time+':00');
export const changeTimeToArr=R.compose(timeFormat,timeToArr);
/*export const changeTime=R.compose(R.join('-'),timeFormat,timeToArr);*/
export const changeTime = R.compose(
    R.append(':00'),
    R.replace('-',':00-'),
);

//日期转换
/* eslint no-confusing-arrow: 0 */
const datePad=n => n < 10 ? `0${n}` : n;
const datePadPhone=n => n < 8 ? n+16 : n-8;//手机时间修正
const isZHTimeFn=()=>(new Date("2018-01-01T23:01:01")).getUTCHours()===15;//是否是中国东8区时间
export const formatDate=date=>`${date.getFullYear()}-${datePad(date.getMonth() + 1)}-${datePad(date.getDate())}`;
export const formatTime=formatStr=>date=>{
  const isZHTime=isZHTimeFn();
  if (formatStr === 'HH') {
    return isZHTime?`${datePad(date.getHours())}`:`${datePad(datePadPhone(date.getHours()))}`;
  }
  if (formatStr === 'mm') {
    return `${datePad(date.getMinutes())}`;
  }
  
  return isZHTime?`${datePad(date.getHours())}:${datePad(date.getMinutes())}`:`${datePad(datePadPhone(date.getHours()))}:${datePad(date.getMinutes())}`;
};

//GMT格式时间格式化
export const formatTimeGMT=formatStr=>date=>{
  if (formatStr === 'HH') {
    return `${datePad(date.getHours())}`;
  }
  if (formatStr === 'mm') {
    return `${datePad(date.getMinutes())}`;
  }
  
  return `${datePad(date.getHours())}:${datePad(date.getMinutes())}`;
};

// 设置移动端不同设备适配
export const setFontSize = ()=>{
  let html = document.documentElement;
  
  // 1rem = 10px  iphone6.width = 375px
  if (html.getBoundingClientRect().width >= 1024) {
    window.rem = html.getBoundingClientRect().width / 102.4;
    html.style.fontSize = window.rem + 'px';
  }else if (html.getBoundingClientRect().width > 768 && html.getBoundingClientRect().width <1024) {
    window.rem = html.getBoundingClientRect().width / 76.8;
    html.style.fontSize = window.rem + 'px';
  } else if(html.getBoundingClientRect().width <= 768
    && html.getBoundingClientRect().width >= 375){
    window.rem = html.getBoundingClientRect().width / 37.5;
    html.style.fontSize = window.rem + 'px';
  } else{
    window.rem = html.getBoundingClientRect().width / 32;
    html.style.fontSize = window.rem + 'px';
  }
}

//antd-mobile　picker数据获取
export const getPickerValue=pickerKey=>R.compose(
    R.prop('label'),
    R.find(R.propEq('value',pickerKey)),
    R.head,
);
export const getPickerKey=pickerValue=>R.compose(
    R.prop('value'),
    R.find(R.propEq('label',pickerValue)),
    R.head,
);

//计算字符串长度
export const getStrLength = str=>str.replace(/[\u0391-\uFFE5]/g,"aa").length;

/**
 * 按角色跳转逻辑
 * 返回{targetUrl,rolesUrl}
 * targetUrl:需要跳转到的路由，rolesUrl：角色的根路由
 */
/*
import Roles from '../config/Roles';
export const getRolesUrl=(rolesIdArr)=>{
  const rolesLists = R.prop('rolesId')(Roles);//角色列表
  const rolesIndex = R.map(uRole => R.findIndex(roles => R.contains(uRole)(roles))(rolesLists))(rolesIdArr);
  const index = R.find(item => R.lte(0)(item))(rolesIndex);
  
  return R.nth(index)(R.prop('rolesUrl')(Roles));
};
export const getJumpUrl=(visitorUrl,userInfo,rolesUrlArr,loginUrl)=>{
  //排除非受控路由
  if (visitorUrl&&!R.contains(visitorUrl,rolesUrlArr)) {
    return {};
  }
  
  //用户未登录重置路由为登录页
  if (!userInfo) {
    return {targetUrl:loginUrl};
  }
  
  const rolesLists = R.prop('rolesId')(Roles);//角色列表
  const rolesIndex = R.map(uRole => R.findIndex(roles => R.contains(uRole)(roles))(rolesLists))(userInfo.rolesId);
  const index = R.find(item => R.lte(0)(item))(rolesIndex);
  
  if (index !== undefined) {
    const rolesUrl = R.nth(index)(R.prop('rolesUrl')(Roles));
    const url={};
    
    //角色根径下的子路径不需要跳转
    if (!R.contains(visitorUrl, rolesUrl)) {
      url.targetUrl=rolesUrl;
    }
    
    url.rolesUrl=rolesUrl;
    return url;
  } else {
    //没有登录权限
    return {targetUrl:loginUrl};
  }
};
*/

/*
export const jumpByRoles = (userInfo, pushAction,visitorUrl,ctrUrl) => {
  //不受控网址直接返回
  console.log(visitorUrl);
  if (visitorUrl&&!R.contains(visitorUrl,ctrUrl)) {
    return;
  }
  
  
  if (!userInfo) {
    return pushAction('/');
  }
  
  const userRolseIs = userInfo.rolesId;
  const rolesLists = R.prop('rolesId')(Roles);//角色列表
  const rolesIndex = R.map(uRole => R.findIndex(roles => R.contains(uRole)(roles))(rolesLists))(userRolseIs);
  
  const index = R.find(item => R.lte(0)(item))(rolesIndex);
  
  if (index !== undefined) {
    const rolesUrl = R.nth(index)(R.prop('rolesUrl')(Roles));
    
    //不是本根径下跳转
    //R.contains(visitorUrl,rolesUrl)||pushAction(rolesUrl);
    return rolesUrl;
  } else {
    pushAction('/');
    
    return false;
  }
};*/
