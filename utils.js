/**
 * 创建元素
 * @param {String} eleName - 要创建的元素名字
 * @param {Array} classArr - 元素的类名集合
 * @param {Object} styleObj - 元素的样式
 */
function createEle (eleName, classArr, styleObj) {
  var dom = document.createElement(eleName);

  for(var i = 0; i < classArr.length; i ++) {
    dom.classList.add(classArr[i]);
  }

  for(var key in styleObj) {
    dom.style[key] = styleObj[key];
  }

  return dom;
};

/**
 * 从localStorage中获取数据名称
 * @param {*} key - 数据名称
 */
function getLocal (key) {
  var value = localStorage.getItem(key);
  if(value === null){return null}
  if(value[0] === '[' || value[0] === '{'){
    return JSON.parse(value);
  }
  return value;
}

/**
 * 设置localStorage数据
 * @param {String} key - 数据名称
 * @param {*} value - 数据值
 */
function setLocal (key, value) {
  if(typeof value === 'object' && value !== null){
    value = JSON.stringify(value);
  }
  localStorage.setItem(key, value);
}

function setSession (key, value) {
  sessionStorage.setItem(key, value);
};

function getSession (key) {
  return sessionStorage.getItem(key);
}

/**
 * 将个位数转为双位，如 8 变为 08
 * @param {Number|String} number - 要转换的数字
 */
function formatNum (number) {
  if(number < 10) {
    return '0' + number;
  }
  return number;
}