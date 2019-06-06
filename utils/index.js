function onFormat(result, params = {}, method) {
  const query = result.param.query.filter(item => {
    if (!item.$.method) {
      return true
    }
    if (item.$.method.toLocaleUpperCase() === method) {
      return true
    }
    if (item.$.method === '*') {
      return true
    }
    return false
  })
  const tmp = onDeconstruction(query)
  const configs = onSortByTotal(tmp, params).sort((before, after) => (after.__sort__ - before.__sort__));
  console.log('sort:', configs[0].__sort__)
  return {
    value: configs[0].__sort__ >= 0 ? configs[0].__url__ : ''
  }
}

function onSuffix(str) {
  return str.substr(str.lastIndexOf('.') + 1, str.length)
}
module.exports = {
  onSuffix: onSuffix,
  onFormat: onFormat,
  onSort: onSortByTotal
}

function onFormatByJS(source, format = 'String') {
  if (format === 'String') {
    return source + ''
  }
  if (format === 'Number') {
    return source * 1
  }
  if (format === 'Boolean') {
    return JSON.parse(source)
  }
  if (format === 'Object') {
    return JSON.parse(source)
  }
  if (format === 'Array') {
    return JSON.parse(source)
  }
}
function onDeconstruction(xml, num = 0, config) {
  config = config ? config : Array.isArray(xml) ? [] : {}
  xml.forEach((item, index) => {
    if (item.property) {
      let tmp = null
      if (item.$) {
        tmp = item.property.some(i => i.$ && i.$.name) ? {} : []
      } else {
        tmp = []
      }
      if (num === 0) {
        config[index] = onDeconstruction(item.property, num + 1, tmp)
        config[index]['__url__'] = item.$.value;
        return
      }
      if (item.$ && item.$.name) {
        config[item.$.name] = onDeconstruction(item.property, num + 1, tmp)
        return
      }
      tmp = item.property.some(i => i.$ && i.$.name) ? {} : []
      config[index] = onDeconstruction(item.property, num + 1, tmp)
      return
    }
    const type = getDataType(config);
    const dataType = item.$ && item.$.type ? item.$.type : 'String'
    if (num === 0) {
      config[index] = {}
      config[index]['__url__'] = item.$.value;
      return;
    }
    if (type === 'Array') {
      if (item._ && item.$.name) {
        config.push({
          [item.$.name]: onFormatByJS(item._, dataType),
        })
        return;
      }
      config.push(onFormatByJS(item._ ? item._ : item, dataType))
      return;
    }
    if (type === 'Object') {
      config[item.$.name] = onFormatByJS(item._, dataType)
      return;
    }
  })
  return config;
}

function getDataType(value) {
  let str = ''
  if (value == null) {
    str = value === undefined ? '[object Undefined]' : '[object Null]'
  }
  str = Object.prototype.toString.call(value)
  return str.slice(str.indexOf(' '), str.indexOf(']')).trim()
}

function onSortByTotal(result, params) {
  return result.map(item => {
    onSortByItem(item, params)
    return item
  })
}

function onSortByItem(result, params, num = 0) {
  const dataType = getDataType(result)
  if (dataType === 'Object') {
    num = Object.keys(result).reduce(onSort.bind(null, result, params), num)
    if (result.__url__) {
      result['__sort__'] = num
    }

  }
  if (dataType === 'Array') {
    num = result.reduce(onSort.bind(null, result, params), num)
    if (result.__url__) {
      result['__sort__'] = num
    }
  }
  return num
}

function onSort(result, params, before, after, index) {
  // const resultType = getDataType(result[after])
  const curType = getDataType(after)
  // 配置类型
  const resultType = curType === 'String' ? getDataType(result[after]) : getDataType(after)
  // 配置参数
  const curResult = curType === 'String' ? result[after] : after
  // 请求参数
  const curParams = curType === 'String' ? params[after] : params[index]
  // 请求参数类型
  const paramsType = curType === 'String' ? getDataType(params[after]) : getDataType(params[index]);
  if ((after === '__url__')) {
    return before
  }
  if (paramsType === 'Undefined') {
    return before
  }
  if (curResult === '*') {
    before++
    return before
  }
  if (paramsType !== resultType) {
    before += -100
    return before
  }
  if (paramsType === 'Array') {
    const isBaseDataType = curResult.every(item => {
      const itemType = getDataType(item)
      return itemType === 'String' || itemType === 'Boolean' || itemType === 'Number'
    })
    const isParamsDataType = curParams.every(item => {
      const itemType = getDataType(item)
      return itemType === 'String' || itemType === 'Boolean' || itemType === 'Number'
    })
    if (isBaseDataType && isParamsDataType) {
      const curResultSort = curResult.sort();
      const curParamsSort = curParams.sort();
      curResultSort.forEach((curResultItem, index) => {
        const curParamsItem = curParamsSort[index];
        if (!curParamsItem) {
          return;
        }
        if (curParamsItem === curResultItem) {
          before += 2
          return
        }
        if (curResultItem === '*') {
          before++
          return
        }
        before += -100
      })
      return before
    } else {
      return onSortByItem(curResult, curParams, before)
    }
  }
  if (paramsType === 'Object') {
    return onSortByItem(curResult, curParams, before)
  }
  if (curParams === curResult) {
    before += 2
    return before
  }
  before += -100
  return before
}