import menu from './menu'

const API_URL = 'http://10.238.131.21:8080' // xiaofeng
// const API_URL = 'http://10.238.131.28:8080' //yulong

// const API_URL = 'http://10.238.131.46:8080' // junyu
// const API_URL = 'http://10.238.131.51:8080' // tuqiang

export default {
  OSS_PATH: 'https://njtech.oss-cn-shanghai.aliyuncs.com/controll_center',

  TOKEN_INFO: 'token_info',
  USER_INFO: 'user_info',

  SUCCESS_CODE: 0,

  LOGIN_API_URL: '//106.15.202.86:8080/njtech/api',
  API_URL,

  // UPLOAD_URL: '/upLoad/upLoadFile',
  UPLOAD_URL: 'http://10.234.196.221:8012/upload',
  PIC_URL: 'http://10.234.196.221:8000/',

  INFO_SHRINK: ['info', 'status', 'describe', ''],
  ALERT_MODAL: ['info', 'depart_id', 'describe'],

  NEED_NOT_INPUT_ID: [''],
  ALL_NEED_NOT_INPUT_ID: [''],

  // 图片上传id
  PHOTO_NAME: ['userPhoto', 'image', 'comImg', 'prizeImg', 'photoUrl', 'com_photo_url'],

  HAS_NOT_ADD: [],
  HAS_NOT_EDIT: ['2'],
  HAS_NOT_DEL: ['2', '3'],

  /// ////////////////////////////////////////////////////////////
  menu,
  optionValues: {
    userType: { 0: '普通用户', 1: '管理员' },
    gender: { 男: '男', 女: '女' },
    status: { '-1': '未上线', 0: '未开始', 1: '开奖中', 2: '开奖成功', 3: '不满足条件', 5: '公布中奖名单', 6: '完成退款' },
    actStatus: { 0: '未激活', 1: '激活' }
  },
  injectOptionUrls: [
    { id: 'userId', url: '/trade/getAllUserIDs' },
    { id: 'actId', url: '/trade/getAllActIDs' },
    { id: 'comId', url: '/trade/getAllComIDs' },
    { id: 'prizeId', url: '/trade/getAllPrizeIDs' }
  ]
}
