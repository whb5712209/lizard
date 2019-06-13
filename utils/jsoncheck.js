/**
 * 比较对象相似度,层级越靠前比重越大
 * {a:1,b:2}与{a:1:b:3} : 50;
 * {a:1,objs:{aa:11,bb:22}} 与 {a:1,objs:{aa:11,bb:33333}} : 75
 */
const _ = require("lodash");

function isObjectParams(params1,params2){
  return Object.prototype.toString.call(params1) === '[object Object]' &&
  Object.prototype.toString.call(params2) === '[object Object]'
}
function isArrayParams(params1,params2){
  return Object.prototype.toString.call(params1) === "[object Array]" &&
  Object.prototype.toString.call(params2) === "[object Array]"
}
/**
 * 比较两个对象相似度
 * @return {Number} 0-100
 * @param {Number} score 初始相似度（100开始）
 * @param {Object} params 预定义入参
 * @param {Object} requestParams 实际请求接口入参
 */
function check(score,params,requestParams){
  const maxDiff = score;
  let diff = maxDiff;
  let len;//每个参数占的比重
  if(isObjectParams(params,requestParams)){
    len = maxDiff / Object.keys(params).length;
  }else if(isArrayParams(params,requestParams)){
    len = maxDiff / params.length;
  }
  for(var key in params){
    if(!_.isEqual(params[key],requestParams[key])){
      diff = diff - len;
      //是对象或数组进行深度比较，调整精度
      if(typeof params[key] === 'object' && typeof requestParams[key] === 'object'){
        diff = diff + check(len,params[key],requestParams[key]);
      }
    }
  }
  return diff;
}


module.exports = check