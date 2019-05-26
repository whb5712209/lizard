function onFormat(result, params = {},method) {
  const query = result.param.query.filter(item =>!item.$.method ||  item.$.method === method )
  const config = {}
  let defaultConfig = {}
  let sort = 0
  query.forEach(item => {
    sort = 0
    if (!item.property) {
      defaultConfig = item.$
      config[0] = item.$
      return true
    } else {
      const list = item.property.map(i => i.$)
      sort = list.length
      const _val = list.every(i => {
        i.value = onFormatByJS(i.value, i.type)
        if (i.type === 'Object') {
          Object.keys(i.value).forEach(j => {
            if (i.value[j] == params[i.name][j]) {
              sort += 2;
            }
            if (i.value[j] == '*') {
              sort++;
            }
          })
          return Object.keys(i.value).some(j => (i.value[j] == '*' || i.value[j] == params[i.name][j]))
        }
        if (i.value == params[i.name]) {
          sort += 2;
        }
        if (i.value == '*') {
          sort++;
        }
        return i.value == params[i.name] || i.value == '*'
      })
      if (_val) {
        value = item.$
        config[sort] = item.$
        return true
      }
    }
    return false
  })
  const sortList = Object.keys(config).map(item => item * 1)
  const maxSort = Math.max.apply(null, sortList)
  if (maxSort) {
    return config[maxSort]
  }
  return defaultConfig
}
function onSuffix(str) {
  return str.substr(str.lastIndexOf('.') + 1, str.length)
}
module.exports = {
  onSuffix:onSuffix,
  onFormat:onFormat
}

function onFormatByJS(source, format = 'String') {
  if (format === 'String') {
    return source + ''
  }
  if (format === 'Number') {
    return source * 1
  }
  if (format === 'Boolean') {
    return source === 'true' || source === 'True' || source === 'TRUE'
  }
  if (format === 'Object') {
    return JSON.parse(source)
  }
  if (format === 'Array') {
    return JSON.parse(source)
  }
}