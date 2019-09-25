import config from '../config'

const configUtils = {

  setStateAsync: (context, ...rest) =>
    new Promise(resolve => {
      context.setState(...rest, resolve)
    }),

  token_info: () => {
    let ti = localStorage.getItem(config.TOKEN_INFO)
    try {
      ti = JSON.parse(ti)
    } catch (e) {
      ti = ''
    }
    return ti
  },

  getColName: (key) => {
    return key in config.COL_MAPPER ? config.COL_MAPPER[key] : key
  },

  getColNameByMapper: (key, mapper) => (mapper && mapper[key]) || key,

  isNumber: (value) => {
    var patrn = /^(-)?\d+(\.\d+)?$/
    if (patrn.exec(value) == null || value == '') {
      return false
    } else {
      return true
    }
  },

  isDate: (key) => {
    return key.toLowerCase().endsWith('time') || key.toLowerCase().includes('date')
  },

  isSelector: key => Object.keys(config.optionValues).includes(key),

  isRulesNeednotInput: id => config.NEED_NOT_INPUT_ID.includes(id),

  isAllNeednotInput: id => config.ALL_NEED_NOT_INPUT_ID.includes(id),

  isPhoto: name => config.PHOTO_NAME.includes(name),

  // isModal: id => ['img'].includes(id),

  // 有增加，修改，删除权限
  hasAdd: key => !config.HAS_NOT_ADD.includes(key),
  hasEdit: key => !config.HAS_NOT_EDIT.includes(key),
  hasDel: key => !config.HAS_NOT_DEL.includes(key),

  // 单独修改
  table_extra: key => key === 'tableflag',

  // 内容显示缩小
  isShrink: key => config.INFO_SHRINK.includes(key),

  // 弹出框配置
  isModal: id => config.ALERT_MODAL.includes(id),

}

export default configUtils
