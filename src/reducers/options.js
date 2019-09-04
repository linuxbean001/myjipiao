import * as actionTypes from '../constants/options'

const initialState = {
  loginData:{},
  isLogin: false,
  languageList: ['English', '中文'],
  page:[],
  task:{
    agentprice: 1,
    cancelticket: 2,
    refund: 3,
    reissue: 4,
    revalidate: 5,
    resubmit:6,
    quote:7
  },
  currencyList: ['AUD', 'NZD', 'USD','CAD','CNY','HKD', 'SGD','IDR'],
  menu_top: ['kCustomerService','kGuide', 'kResponse', 'kFocus', 'kTopUp'],
  menu_top_right:['kSearchHistory', 'kMyOrder', 'kLogin'],
  menu_normal: ['kHome', 'kFareSearch', 'kNewZealandTour', 'kAustraliaTour'],
  month_en: ['',"Jan", "Feb", "Mar", "Apr",
            "May", "Jun", "July", "Aug",
          "Sep", "Oct", "Nov", "Dec"],
  month_cn: ['','一 月','二 月','三 月','四 月','五 月','六 月','七 月','八 月','九 月','十 月','十一月','十二月'],
  keywords:[
    {Name:'kHome', En:'Home', Cn:'首页'},
    {Name:'kFareSearch', En:'Fare Search', Cn:'机票查询'},
    {Name:'kNewZealandTour', En:'Newzealand Tour', Cn:'新西兰本地游'},
    {Name:'kAustraliaTour', En:'Australia Tour', Cn:'澳洲本地游'},
    {Name:'kMYJIPIAO', En:'MYJIPIAO', Cn:'MYJIPIAO'},
    {Name:'kEmailReg', En:'Email Regist', Cn:'邮件订阅'},
    {Name:'kPayment', En:'Payment Method', Cn:'支付方式'},
    {Name:'kInputEmail', En:'', Cn:''},
    {Name:'kEmailNote', En:'', Cn:''},
    {Name:'kMJPForYou', En:'', Cn:''},
    {Name:'kSubmit', En:'', Cn:''},
    {Name:'kWorldTouch', En:'', Cn:''}
  ],

  menu_list: [{
    title: 'kHome',
    icon: 'home',
    path: '/'
  }, {
    title: 'kSearchHistory',
    icon: 'flysearch',
    path: '/history'
  },
  {
    title: 'kMyOrder',
    icon: 'shopping-cart',
    path: '/myorder'
  }, {
    title: 'kLogin',
    icon: 'shopping-cart',
    path: '/login'
  },{
    title: 'kFareSearch',
    icon: 'flysearch',
    path: '/faresearch'
  }, {
    title: 'kNewZealandTour',
    icon: 'nztour',
    path: '/newzealand'
  },
  {
    title: 'kAustraliaTour',
    icon: 'autour',
    path: '/Australia'
  },
  {
    title: 'kCustomerService',
    icon: "customer-service",
    path: '/service'
  }, {
    title: 'kGuide',
    icon: 'info',
    path: '/aboutus'
  }, {
    title: 'kContactUs',
    icon: 'mail',
    path: '/contactus'
  }, {
    title: 'kResponse',
    icon: 'setting',
    path: '/response'
  }
]
}

export default function options(state = initialState, action) {
  switch (action.type) {
    case actionTypes.OPTIONS_UPDATE:
      return action.data
    default:
      return state
  }
}
