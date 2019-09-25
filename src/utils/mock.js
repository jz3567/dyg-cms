import Mock from 'mockjs'

Mock.setup({
  timeout: 100
})

Mock.mock(/\/sanyuan\/user\/info/, 'get', {
  code: 0,
  data: {
    code: 0,
    'data|50': [
      {
        'mainKey|+1': 1,
        data: {
          'id|+1': 1,
          phoneNumber: /1515\d{7}/,
          userPhoto: '@Image',
          gender: '男',
          'money|1-99999': 0,
          keyElements: 'fsvrg',
          passwd: '123456',
          userType: '0',
          account: '@email',
          'age|1-55': 1
        }
      }
    ],
    msg: 'success'
  },
  message: '操作成功',
  systemDate: new Date().getTime()
})

Mock.mock(/\/sanyuan\/activity\/list/, 'get', {
  code: 0,
  msg: 'success',
  data: {
    code: 0,
    'data|40-50': [
      {
        'mainKey|+1': 1,
        data: {
          'actId|+1': 1,
          name: '活动名称',
          commodityName: '商品名称',
          prizeName: '奖品名称',
          price: '12', // 商品价格
          value: '2000', // 奖品价值
          comImg: '@image', // 商品图片url
          prizeImg: '@image', // 奖品图片url
          tmpNum: '321', // 当前人数
          targetNum: '500', // 目标人数
          openTime: '2019-08-15 09:51:29', // 开奖时间
          openEndTime: '20200101000000', // 开奖截至时间
          startTime: '20200101000000', // 活动开始时间
          status: 1
        }
      }
    ],
    msg: 'success'
  }
})

Mock.mock(/\/sanyuan\/product\/infoList/, 'get', {
  code: 0,
  msg: 'success',
  data: {
    code: 0,
    'data|40-50': [
      {
        'mainKey|+1': 1,
        data: {
          'id|+1': 1,
          describe: '此产品。。。。。。',
          image: '@Image',
          'price|1-999': 0,
          joinedUserNum: '233',
          targetNum: '500',
          lotteryTime: '',
          lotteryCode: ''
        }
      }
    ],
    msg: 'success'
  },
  message: '操作成功',
  systemDate: new Date().getTime()
})
