
export default {
  menus: [
    {
      key: 'sub1',
      title: '用户',
      icon: 'user',
      subs: [
        { key: '1', title: '用户管理' },
        { key: '2', title: '交易账单' }
      ]
    },
    {
      key: 'sub2',
      title: '活动',
      icon: 'block',
      subs: [
        { key: '3', title: '活动管理', icon: 'mail' }
      ]
    },
    {
      key: 'sub3',
      title: '商品',
      icon: 'gold',
      subs: [
        { key: '4', title: '商品管理' }
      ]
    }
  ],

  urls: {
    1: {
      // selectUrl: '/user/allUserInfo?userName=' + _.get(JSON.parse(localStorage.getItem('user_info')), 'userName', ''),
      selectUrl: '/user/info/',
      addUrl: '/user/add/',
      delUrl: '/user/delete',
      upUrl: '/user/update',
      mapper: {
        id: '用户ID',
        phoneNumber: '手机号码',
        userPhoto: '用户头像',
        gender: '性别',
        money: '余额',
        keyElements: 'keyElements',
        passwd: '密码',
        userType: '用户类型',
        account: '账号',
        age: '年龄',
        actStatus: '激活状态',
        /// ////////////
        user_id: '用户ID',
        com_id: '商品ID',
        com_name: '商品名称',
        com_price: '商品价格',
        com_photo_url: '商品图片',
        trade_time: '交易时间',
        user_name: '用户名'
      },
      columns: ['id', 'phoneNumber', 'userPhoto', 'gender', 'money', 'passwd', 'userType', 'account', 'age', 'actStatus'],
      detail: '/trade/user_details',
      detailParam: 'userId',
      addKeys: ['account', 'passwd', 'userType'],
      fixedColumns: ['id', 'userPhoto', 'account']
    },

    2: {
      selectUrl: '/trade/bills',
      addUrl: '/trade/transaction',
      mapper: {
        user_id: '用户ID',
        userId: '用户ID',
        com_id: '商品ID',
        com_name: '商品名称',
        com_price: '商品价格',
        com_photo_url: '商品图片',
        trade_time: '交易时间',
        user_name: '用户名',
        actId: '活动ID'
      },
      columns: ['user_id', 'com_id', 'user_name', 'com_name', 'com_price', 'com_photo_url', 'trade_time'],
      addKeys: ['userId', 'actId']
    },

    3: {
      selectUrl: '/activity/listForAdmin',
      addUrl: '/activity/addActivity',
      delUrl: '/activity/list',
      upUrl: '/activity/modifyActivity',
      mapper: {
        id: '活动ID',
        name: '活动名称',
        comName: '商品名称',
        prizeName: '奖品名称',
        price: '商品价格', // 商品价格
        value: '奖品价值', // 奖品价值
        comImg: '商品图片', // 商品图片url
        prizeImg: '奖品图片', // 奖品图片url
        tmpNum: '当前人数', // 当前人数
        targetNum: '目标人数', // 目标人数
        openTime: '开奖时间', // 开奖时间
        openEndTime: '开奖截至时间', // 开奖截至时间
        startTime: '活动开始时间', // 活动开始时间
        status: '状态',
        comId: '商品ID',
        prizeId: '奖品ID',
        endTime: '活动结束时间',
        joined: '是否参加',
        lucky: '中奖',
        account: '用户名',
        actStatus: '活动状态',
        age: '年龄',
        money: '余额',
        passwd: '密码',
        phoneNumber: '手机号',
        userPhoto: '头像',
        userType: '用户类型',
        endTimeStr: '活动结束时间',
        openTimeStr: '开奖时间', // 开奖时间
        openEndTimeStr: '开奖截至时间', // 开奖截至时间
        startTimeStr: '活动开始时间', // 活动开始时间
        gender: '性别'
      },
      columns: ['id', 'comId', 'prizeId', 'name', 'comName', 'prizeName', 'price', 'value', 'comImg', 'prizeImg', 'tmpNum', 'targetNum',
        'status', 'startTime', 'endTime', 'openTime', 'openEndTime'],
      addKeys: ['name', 'comId', 'prizeId', 'openTime', 'openEndTime', 'startTime', 'endTime', 'targetNum'],
      fixedColumns: ['id', 'comName', 'prizeName', 'price', 'value', 'comImg', 'prizeImg', 'tmpNum'],
      detail: '/activity/selectJoinedUserAndWinner',
      detailParam: 'actId'
    },

    4: {
      // selectUrl: '/depart/allDepInfo',
      selectUrl: '/commodity/list',
      addUrl: '/commodity/add',
      delUrl: '/commodity/delete',
      upUrl: '/commodity/update',
      mapper: {
        id: '用户ID',
        info: '描述',
        image: '图片',
        price: '价格',
        joinedUserNum: 'joinedUserNum',
        targetNum: 'targetNum',
        lotteryTime: 'lotteryTime',
        lotteryCode: 'lotteryCode',
        photoUrl: '图片',
        name: '商品名称'
      },
      columns: ['id', 'info', 'price', 'name', 'photoUrl'],
      addKeys: ['info', 'price', 'name', 'photoUrl']

    }

  }
}
