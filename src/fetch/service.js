import { get } from './get'
import { post } from './post'
import { html } from './html'

const isMock = false;  window.location.hostname === 'localhost' && window.location.port == 3000;
const token = document.getElementById("token").innerHTML;

export function getTicketsData(param) {
    param.token = token
    const result = isMock? get('api/tickets') : post('/b2capi/service/tickets',param)
    return result
}

export function getPaymentTransaction(param) {
    param.token = token
    const result = isMock? get('Json/payment_transaction.json?seq='+ Math.floor(Math.random() * 100)) : post('/b2capi/service/GetPaymentTransaction',param)
    return result
}

export function getPaymentData(param) {
    param.token = token
    const result = isMock? get('Json/gateway.json?seq='+ Math.floor(Math.random() * 100)) : post('/b2capi/service/GetPaymentGateway',param)
    return result
}


export function updateTableData(param) {
    param.token = token
    const result = isMock? get('api/tickets') : post('/b2capi/service/updateTable',param)
    return result
}

export function getPnr(param) {
    param.token = token
    const result = isMock? get('api/tickets') : post('/b2capi/service/GetPnr',param)
    return result
}

export function removeTableData(param) {
    param.token = token
    const result = isMock? get('api/tickets') : post('/b2capi/service/removeTable',param)
    return result
}

export function loadTableData(param) {
    param.token = token
    const result = isMock? get('api/tickets') : post('/b2capi/service/loadTable',param)
    return result
}

export function getKeyPair() {
    //const result =  get('api/options')
    const result = isMock? get('api/capcha'):get('/service/capcha')
    return result
}

export function getToken() {
    //const result =  get('api/options')
    const result = isMock? get('api/token'):get('/home/token')
    return result
}

export function getOptions(param) {
    param.token = token
    //const result =  isMock? get('Json/options.json'):post('b2capi/service/options', param)
    const result =  post('b2capi/service/options', param)
    return result
}

export function getExtraOptions(param) {
    param.token = token
    const result =  isMock? get('api/extraOptions'):post('b2capi/service/GetExtraOptions', param)
    return result
}

export function register(param) {
    const result = post('/b2capi/service/register',param)
    return result
}

export function resetPassword(param) {
    const result = post('/b2capi/service/resetpwd',param)
    return result
}

export function getDashboardData(param) {
    param.token = token
    const result = isMock? get('api/dashboard') : post('/b2capi/service/dashboard',param)
    return result
}

export function login(param) {
    param.token = token
    const result = isMock? get('api/login') :post('/b2capi/service/login',param)
    return result
}

export function getPriceData(param) {
  param.token = token
  const result = isMock? get('Json/price.json?seq='+ Math.floor(Math.random() * 100)) :post('/b2capi/service/GetPriceMethod',param)
  return result
  }

export function getAirlineData() {
    //const result = get('/api/airline/' + encodeURIComponent(city) + '/' + page)
    const result = get('/api/airline')
    return result
}

export function getFaresData(param) {
    param.token = token
    const result = isMock? get('Json/fares.json?seq='+ Math.floor(Math.random() * 100)) :post('/b2capi/service/GetFaresMethod',param)
    return result
}

export function createBooking(param) {
    param.token = token

    const result = isMock? get('Json/relocators.json?seq='+ Math.floor(Math.random() * 100)) : post('/b2capi/service/CreateBookingMethod',param)
    return result
}

export function getPage(param) {
    param.token = token

    const result = isMock? get('Json/page.json?seq='+ Math.floor(Math.random() * 100)) : post('/b2capi/service/getPage',param)
    return result
}

export function getSubscribe(param) {
    param.token = token
    const result = isMock? get('api/tickets') : post('/b2capi/service/GetSubscribe',param)
    return result
}
