export default {
  log: function(key) {
    // //console.log(key);
  },

  getFreshFsr:function() {
    return {
    from_city: "",
    to_city: "",
    departure_date: this.formatDateValue(new Date()),
    return_date:'',
    carrier: "",
    trip_type:'RT',
    adult:1,
    infant:0,
    child:0,
    travel_class:'Economy',
    is_b2c: 0,
    currency:'AUD',
    IsAutoTicket: 0,
    isDomestic: false,
    isUsa:false}
  },

  getDiffDate:function(dString, diff)
  {
    var m_names = new Array("JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC")

    for (var i=0; i< m_names.length; i++)
    {
      let month = m_names[i]
      if (dString.indexOf(month) > 0)
      {
        var newString = dString.replace(month, ' ')
        var arr = newString.split(' ')
        var d = new Date('20'+arr[1], i, arr[0]);
        d.setDate(d.getDate() + diff*1)
        var day = d.getDate() <10? '0'+d.getDate(): d.getDate()
        var mon = m_names[d.getMonth]
        var year = (d.getFullYear()+'').substring(2)
        return day+mon+year
      }
    }

    return diff
  },


  getTime:function() {
   var today = new Date();
   var h = today.getHours();
   var m = today.getMinutes();
   var s = today.getSeconds();
   // add a zero in front of numbers<10
   m = m<0? '0'+m:''+m;
   s = s<0? '0'+s:''+s;

   return (h+''+m+''+s)*1
  },

   getDomain: function() {
    if (window.location.host.indexOf("localhost") >=0)
    {
      return "http://myjipiao.com.au";
    }
    else {
      return window.location.protocol + "//" + window.location.host;
    }
  },

  createPax(type, count) {
    //console.log('pax '+count)
    var paxType = type =='adult'? 'ADT': type=='child'? 'CHD':'INF'
    var arr =[]
    for (var i=0; i< count; i++) {
      var aPax = { PaxType: paxType, pax_type:paxType, BookingPaxType:paxType, PaxDay: "", PaxMonth: "", PaxYear: "", PaxDob: "",
      PaxFirstName: "", PaxLastName: "", PaxMiddleName: "", PaxNumber: "", PaxTitle: "", Member: "", Membership: "", IDType: "",
      PassportNo: "", Nationality: "", PassportPlace: "", PassportExpireYear: "", PassportExpireMonth: "", PassportExpireDay: "",
      ktn: "", rcn: "" }
      arr.push(aPax)
    }
    return arr
  },

  getCountryFlagUrl(name) {
    return this.getDomain()+"/Images/airlines/flags/" + name + ".png";
  },

  getSupplierFlagUrl(name,supplier) {
    for (var i = 0; i < supplier.length; i++) {
      var obj = supplier[i];
      if (obj.Name === name) {
        return this.getDomain()+"/images/airlines/flags/" + obj.Country.trim() + ".png";
      }
    }
  },

  getUploadImageUrl(name) {
    return this.getDomain()+"/images/uploads/"+name;
  },

  getPageFrom(pIndex, preIndex)
  {
    if (preIndex == null)
    {
      return 0;
    }

    if ((pIndex/100) !== (preIndex/100))
    {
      return 0;
    }

    return pIndex > preIndex? 0:1;
  },



  getReduxDataByID: function(data_center, key)
  {
    return data_center.byHash[key];
  },

  getReduxDataArrayByID: function(data_center, key)
  {
    return data_center.byHash[key].data;
  },

  getDefaultID: function(data, key)
  {
    for (var i=0; i< data.length; i++)
    {
      if(data[i].Key_Type == key)
      {
        return data[i].ID
      }
    }

    return 0
  },

  getItemIndex: function(arr, obj) {

    var index = -1;
    if(!Array.isArray(arr)) return -1;
    if(arr.length == 0) return -1;

    for (var i=0; i< arr.length; i++)
    {
        let tempObj = arr[i]
        if(JSON.stringify(tempObj) == JSON.stringify(obj))
        {
          index = i;
          break;
        }
    }

    return index;
  },


  updateItem: function(item, key, value) {
    return {
        ...item,
        ...{[key]:value}
    }
  },

  addArrayItem:function(arr, obj, index=-1)
  {
    if (!Array.isArray(arr))
    {
      return arr
    }

    if(index < 0)
    {
      index = arr.length -1;
    }
    var bArray = Array.isArray(obj)
    if (index > 0)
    {
      if (arr.length > index)
      {
        if(bArray)
        {
          return [
            ...arr.slice(0,index),
            ...obj,
            ...arr.slice(index+1)
          ]
        }
        else {
          return [
            ...arr.slice(0,index),
            obj,
            ...arr.slice(index+1)
          ]
        }

      }
    }

    if(index < 0)
    {
      if(bArray)
      {
        return [
            ...arr,
            ...obj
         ]
      }
      else {
        return [
            ...arr,
            obj
         ]
      }
    }

    if(bArray)
    {
      return [
          ...obj,
          ...arr
       ]
    }
    else {
      return [
          obj,
          ...arr
       ]
    }
  },

  updateArrayItem: function(arr, key, value, index)
  {
      return [
              ...arr.slice(0, index),
              {...arr[index], ...{[key]:value}},
              ...arr.slice(index+1)
      ]

  },

  removeArrayItem: function(arr, index=0)
  {
        return [
          ...arr.slice(0, index),
          ...arr.slice(index+1)
       ]
  },

  addArrayItemByID:function(arrObj, name, obj, index=0)
  {
    if ((arrObj==null) || (arrObj[name] == null) || !Array.isArray(arrObj[name]))
    {
      return arrObj
    }

    return {
      ...arrObj,
      ...{
        [name]: this.addArrayItem(arrObj[name],obj,index)
      }
    }
  },

  updateArrayItemByID: function(arrObj, name, key, value, index)
  {
    if ((arrObj==null) || (arrObj[name] == null) || !Array.isArray(arrObj[name]))
    {
      return arrObj
    }

    return {
      ...arrObj,
      ...{
        [name]: this.updateArrayItem(arrObj[name],key, value,index)
      }
    }
  },

  updateArrayObjByID: function(arrObj, name, key, value, obj)
  {
    if ((arrObj==null) || (arrObj[name] == null) || !Array.isArray(arrObj[name]))
    {
      return arrObj
    }

    var index = this.getItemIndex(arrObj[name], obj)
    if (index >=0)
    {
      return {
        ...arrObj,
        ...{
          [name]: this.updateArrayItem(arrObj[name],key, value,index)
        }
      }
    }

    return arrObj
  },

  removeArrayItemByID: function(arrObj, name, index=0)
  {
    if ((arrObj==null) || (arrObj[name] == null) || !Array.isArray(arrObj[name]))
    {
      return arrObj
    }

    return {
      ...arrObj,
      ...{
        [name]: this.removeArrayItem(arrObj[name],index)
      }
    }
  },

  removeArrayObjByID: function(arrObj, name, obj)
  {
    if ((arrObj==null) || (arrObj[name] == null) || !Array.isArray(arrObj[name]))
    {
      return arrObj
    }
    var index = this.getItemIndex(arrObj[name], obj);
    if(index >=0)
    {
      return {
        ...arrObj,
        ...{
          [name]: this.removeArrayItem(arrObj[name],index)
        }
      }
    }

    return arrObj;

  },

  getCartItem: function(data_center, item, return_type = '') {

  var resultArr=[];
  //var displayType = return_type===''? 0:1;
  try {
    const data = this.getReduxDataByID(data_center,"searchResult").SearchList[item.source_index].Rows[item.fare_index]
    //const fsr = this.getReduxDataByID(data_center,"fsr")
    const ab = data.AvailReference[item.av_index]

    if (return_type === '') {
      resultArr.push(this.getItemToCart(data_center,item, ab, 0));
      if (ab.ReturnId > 0) {
        resultArr.push(this.getItemToCart(data_center, item, ab, 1));
      }
    }
    else {
      resultArr.push(this.getItemToCart(data_center,item, ab, return_type));
    }
  }
  catch (err) {
    //console.log("error", err.message)
    //this.setState(error : err.message)
  }

  window.scrollTo(0,0);
  return resultArr;
},

getItemToCart:function(data_center, item, ab, return_type) {
  try {
    const data = this.getReduxDataByID(data_center,"searchResult").SearchList;
    const fsr = this.getReduxDataByID(data_center,"fsr");

    var cart_item = {};

    cart_item.search_index = this.getReduxDataByID(data_center,"searchResult").search_index;
    cart_item.segment_type = return_type;

    cart_item.pcc = data[item.source_index].PCC;

    cart_item.fare = this.clone(data[item.source_index].Rows[item.fare_index]);
    if (return_type == 0) {
      cart_item.segment = this.clone(data[item.source_index].Departure[ab.DepartureId - 1]);
    } else {
      cart_item.segment = this.clone(data[item.source_index].Return[ab.ReturnId - 1]);
    }


    cart_item.DepartureUTCTick = cart_item.segment.FlightList[0].DepartureUTCTick;
    cart_item.date_time = cart_item.segment.FlightList[0].FromDate + cart_item.segment.FlightList[0].FromTime;
    cart_item.segment.CabinClass = return_type == 0
      ? cart_item.fare.Departure.CabinClass
      : cart_item.fare.Return.CabinClass;

    for (var i = 0; i < cart_item.segment.FlightList.length; i++) {
      //var bClass = return_type == 0 ? cart_item.fare.Departure.BookClass : cart_item.fare.Return.BookClass;
      var fare = data[item.source_index].Rows[item.fare_index];
      if (fare.Source === 'AMADEUS') {
        var arrBookClass = fare.BookClass.split('/');
        var offset = return_type == 0
          ? 0
          : data[item.source_index].Departure[ab.DepartureId - 1].FlightList.length;
        cart_item.segment.FlightList[i].BookClass = arrBookClass[i + offset];
      } else {
        cart_item.segment.FlightList[i].BookClass = return_type == 0
          ? cart_item.fare.Departure.BookClass
          : cart_item.fare.Return.BookClass;
      }
    }

    cart_item.return_type = fsr.trip_type;
    cart_item.SupplierId = data[item.source_index].SupplierId;
    return cart_item;
    }
    catch (err) {
      return null
    }
  },

  isDataLoadNeeded: function(pIndex, preIndex)
  {
    if (preIndex == null)
    {
      return true;
    }

    if (Math.floor(pIndex/100) !== Math.floor(preIndex/100))
    {
      return true;
    }

    return pIndex > preIndex;
  },

  selectedFilter:function(item) {
    return item.idField == 1;
  },

  isShowAv:function(av, step, segType) {
    //filter by stop
      var keys = [];
      if(segType == 0){
        keys.push('dep_stop');
      } else {
        if(segType == 1){
          keys.push('ret_stop');
        }
        else {
          keys.push('dep_stop');
          keys.push('ret_stop');
        }
      }

      for (var j=0; j< keys.length; j++)
      {
        var isFound = false;
        var isSelected = false;
        var filter = step.byHash["filter"];
        const target = filter[keys[j]];
        const value = av[keys[j]];


        for (var i=0; i< target.length; i++)
        {
          var obj = target[i];
          if (obj.is_selected === 1) {
            isSelected = true;
            if(obj.id == value)
            {

              isFound = true;
              break;
            }
          }
        }

        if (isSelected && !isFound)
        {
          //clent has select stop and not found
          return false;
        }
      }


      let fsr = step.byHash["fsr"];
      const rangeKeys = fsr.trip_type ==='OW'
        ? ['dep_travel_time', 'dep_take_off_time', 'dep_landing_time']
        : [
          'dep_travel_time',
          'dep_take_off_time',
          'dep_landing_time',
          'ret_travel_time',
          'ret_take_off_time',
          'ret_landing_time',
          'total_travel_time'
        ]

      for (var i = 0; i < rangeKeys.length; i++) {
        const key = rangeKeys[i];
        const value = av[key];
        const range = filter[key];
        if ((value < range.low) || (value > range.high)) {
          return false;
        }
      }

      return true;
  },

  getUploadImageUrl:function(name) {
    return "https://www.flightsb2b.com/images/uploads/"+name;
  },

  getImageUrl:function(name) {
    return process.env.PUBLIC_URL + '/images/' + name;
  },

  getGlobalImageByName:function(name) {
    return process.env.PUBLIC_URL + '/images/' + name;
  },

  getAirlineImage:function(name) {
    return process.env.PUBLIC_URL + '/images/airlines/' + name+'.png';
  },

  getIconImage:function(name) {
    return process.env.PUBLIC_URL + '/images/icon/' + name;
  },

  getAirlineAllianceImage:function(name) {
    return process.env.PUBLIC_URL + '/images/' + name;
  },

  getNormalImageUrl:function(name) {
    return process.env.PUBLIC_URL + '/images/'+name;
  },

  getSupplierImage:function(id) {
    return process.env.PUBLIC_URL + '/images/flags/'+id+'.png';
  },
  getCountryFlagUrl:function(name) {
    return process.env.PUBLIC_URL + '/images/flags/' + name + ".png";
  },

  isLogin: function(options)
  {
    return (options != null) && (options.isLogin)
  },


  goHome: function(f1,f2)
  {
    f1.updateItem({menuIndex:'FLIGHTSB2B'})
    f2.push("/")
  },

  getCurrencySymbol: function(key) {
    if (key == '')
    {
      return key
    }
    else {
      if (key === "CNY")
      {
        return "￥";
      }

      return "$"
   }
  },

  isNumeric: function(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
  },

  getMoneyFormat: function(currency, value) {
    if (this.isNumeric(value))
    {
      return this.getCurrencySymbol(currency)+ parseFloat(value).toFixed(2)
    }
    return this.getCurrencySymbol(currency)
  },

  clone: function(obj){
    return JSON.parse(JSON.stringify(obj));
  },



  isArrayLoad:function(arr)
  {
    if(arr == null)
    {
      return false;
    }

    if (Object.prototype.toString.call(arr) != '[object Array]')
    {
      return false;
    }

    if (arr.length == 0)
    {
      return false;
    }

    return true;

  },

  getKeyword:function(key, arr, lang){

    if((key == null) && (key==''))
    {
      return key
    }

    if (arr == null)
    {
      return key;
    }

    if (lang== null)
    {
      lang = 'en'
    }

    if (!Array.isArray(arr))
    {
      return key;
    }

    for (var i=0; i< arr.length; i++)
    {
        try {
          if ((arr[i].Name != null) && ((key+'').trim().toLowerCase() == arr[i].Name.trim().toLowerCase()))
          {
            //console.log(key, arr[i].Name+' '+arr[i]['Cn']+' '+arr[i]['En']+ ' '+)
            var langTag =  lang.trim()=='en'? "En":"Cn"
            return arr[i][langTag];
          }
       }
       catch (err) {
         //console.log(key, arr[i].Name)
       }
    }

    return key;
  },

  isEmptyObject: function(obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object
  },

  isNumeric: function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  },

  isMoreInfoNeed(code)
  {
    var codes = [
      'US', 'CA',
	'AD','AL','AT','BA','BE','BG','BY','CH','CY','CZ','DE','DK','EE','ES','FI','FO','FR','GG','GI','GR','HR','HU','IE','IM','IS','IT','JE','LI','LT','LU','LV','MC','MD','MK','MT','NL','NO','PL','PT','RO','RU','SE','SI','SJ','SK','SM','TR','UA','UK','VA','YU'
]
   return codes.indexOf(code) >=0;
 },

 validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email.trim());
},

  dayDiff: function(d1, d2)
  {
    var date1 = this.getDateByString(d1);
    var date2 = this.getDateByString(d2);
    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return diffDays > 0? ' +'+diffDays+'d':''
  },

  getAmPm: function(t)
  {
    if (t=='')
    {
      return "";
    }

    var hour = t.substring(0,2)*1;

    if (hour >= 12)
    {
       return 'PM';
    }

    return 'AM'
  },

  getTimeFormat: function(t)
  {
    if (t=='')
    {
      return "";
    }

    var hour = t.substring(0,2)*1;

    if (hour >= 12)
    {
      if (hour >= 22)
      {
        return t.replace(hour, (hour-12)+'');
      }

      if (hour > 12)
      {
        return '0'+ t.replace(hour, (hour-12)+'');
      }

      return t;
    }

    return t;
  },


  formatDateValue: function(d, sep='-'){
    var month = '' + (d.getMonth() + 1);
    var    day = '' + d.getDate();
    var    year = d.getFullYear();

   if (month.length < 2) month = '0' + month;
   if (day.length < 2) day = '0' + day;

   if (sep != '/')
   {
     return [year, month, day].join(sep);
   }
   else {
   return [day, month, year ].join(sep);
  }
 },


  isEmpty: function(obj) {

    // null and undefined are "empty"
    if (obj == null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;

    // If it isn't an object at this point
    // it is empty, but it can't be anything *but* empty
    // Is it empty?  Depends on your application.
    if (typeof obj !== "object") return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
},

  getTravelTime: function(itineraries) {
    var mins = 0;
    for (var i = 0; i < itineraries.length; i++) {
      var the_time = itineraries[i].TravelTime;
      if ((the_time == null) || (the_time == '') || !this.isNumeric(the_time)) {
        continue;
      }

      mins += this.getMinutes(the_time);
    }

    return mins;
  },

  getDateByString: function(strDate)
  {
    if (strDate.trim() === '') {
      return new Date();
    }

    var str_dates;
    var d;

     if (strDate.indexOf('-') >=0) {
       str_dates = strDate.split('-');
       d = new Date(+str_dates[0], (+str_dates[1]-1), +str_dates[2]);
     }

    if (strDate.indexOf('/') >=0)
    {
      str_dates = strDate.split('/');
      d = new Date(+str_dates[2], (+str_dates[1]-1), +str_dates[0]);
    }

    return d;
  },

  getDay: function(strDate) {
    if (strDate === '') {
      return 0;
    }

    var str_dates = strDate.split('-');
    var d = new Date(+str_dates[0], +str_dates[1], +str_dates[2]);
    return d.getDay();
  },

  getMinutes: function(traveltime) {
    if(traveltime.indexOf(':') >=0)
    {
      traveltime = traveltime.replace(':','');
    }

    if ((traveltime === '') || !this.isNumeric(traveltime)) {
      return 0;
    }

    var int_time = parseInt(traveltime);

    var minute = int_time % 100;
    var hour = Math.floor(int_time / 100);

    return hour * 60 + minute;
  },

  replaceAll: function(str, search, replacement) {
    return str.split(search).join(replacement);
  },

  updateSliderRange: function(filter, value) {
    ////console.log("filter",filter)
    if (Math.floor(value) < filter.floor) {
      filter.floor = Math.floor(value);
      filter.low= filter.floor;
    }

    if (Math.ceil(value) > filter.ceil) {
      filter.ceil = Math.ceil(value);
      filter.high = filter.ceil;
    }
  },

  formatTravelTime: function(traveltime) {
    var mins = this.getMinutes(traveltime);
    return this.formatPeriod(mins);
  },

  formatPeriod: function(value) {
    var minutes = value % 60;
    var hours = Math.floor(parseInt(value) / 60);
    return hours + 'h ' + minutes + 'min ';
  },

  getAv: function(searchResult,i, j,k,type=0){

    const dep = searchResult.SearchList[i].Departure;
    const ret = searchResult.SearchList[i].Return;
    const fare = searchResult.SearchList[i].Rows[j]
    const av = fare.AvailReference[k];

    ////console.log("av"+k,fare)

    var avs =[];

    if (type !== 2) {
    avs.push({itinerary:dep[av.DepartureId-1], bookClass:fare.Departure});
    }

    if (type !== 1)
    {
    if(av.ReturnId >0)
    {
      avs.push({itinerary:ret[av.ReturnId-1], bookClass:fare.Return});
    }
  }
    return avs;
  },

  getFareIndex:function(fare){
    return fare.source_index * 10000+ fare.fare_index
  },

  getNumberArray:function(l,r) {
    return new Array(r - l+1).fill().map((_,k) =>  k + l);
  },

  getAirlineImage(code) {
    return this.getDomain()+"/images/airlines/png/"+code.trim()+".png";
  },

  getPriceParam(step, currency='NZD'){
    const fsr = step.byHash['leg0'].fsr;
    var param = {
      token: "rrr",
      data: {
        AvailList: [],
        PaxDetails: [
          {
            BookingPaxType: "ADT",
            Number: fsr.adult
          }, {
            BookingPaxType: "CHD",
            Number: fsr.child
          }, {
            BookingPaxType: "INF",
            Number: fsr.infant
          }
        ],
        Parameter: {
          Currency: step.byHash['system'].currency,
          is_b2c:'1'
        }
      }
    }

    const carts = step.byHash['cart'];


    for (var k=0; k< carts.length; k++)
    {
      var cart = carts[k]
      var searchResult = step.byHash['leg'+cart.leg].searchResult.SearchList;
      var dep = searchResult[cart.gds].Departure;
      var av = searchResult[cart.gds].Rows[cart.fare].AvailReference[cart.av];
      var cartItem = {}
      cartItem = Object.assign({}, dep[av.DepartureId - 1])
      cartItem.SupplierId = searchResult[cart.gds].SupplierId

      param.data.Parameter.SupplierId = cartItem.SupplierId

      param.data.AvailList.push(cartItem);

      var bookClass = searchResult[cart.gds].Rows[cart.fare].BookClass.split('/');


      var lastAv = param.data.AvailList[param.data.AvailList.length-1]
      var offset = lastAv.FlightList.length
      for (var i = 0; i < lastAv.FlightList.length; i++) {
        var obj = lastAv.FlightList[i];
        obj.BookClass = i>=bookClass.length? bookClass[bookClass.length-1]: bookClass[i];
      }

      if (av.ReturnId > 0)
      {
        var ret = searchResult[cart.gds].Return;
        cartItem = Object.assign({}, ret[av.ReturnId - 1])
        cartItem.SupplierId = searchResult[cart.gds].SupplierId
        param.data.AvailList.push(cartItem);

        lastAv = param.data.AvailList[param.data.AvailList.length-1]
        for (var i = 0; i < lastAv.FlightList.length; i++) {
          var obj = lastAv.FlightList[i];
          obj.BookClass = (i+offset)>=bookClass.length? bookClass[bookClass.length-1]: bookClass[i+offset];
          //obj.BookClass = searchResult[cart.gds].Rows[cart.fare].Return.BookClass;
        }
      }
    }

    return param
  },

  getImageUrl(name) {
    return this.getDomain()+"/images/"+name;
  },

  caculateCartTotal(cart) {
        var priceAmount = 0.0
        var taxAmount = 0.0

        for (var i = 0; i < cart.length; i++) {
            priceAmount += cart[i].return_type == "RT" ? cart[i].fare.FarePrice /2 : cart[i].fare.FarePrice;
            taxAmount += cart[i].return_type == "RT" ?cart[i].fare.TaxAmount/2 : cart[i].fare.TaxAmount;
        }

        return {nett:priceAmount.toFixed(2), tax:taxAmount.toFixed(2), total:(priceAmount + taxAmount).toFixed(2)}
    },

  sortByKey: function(array, key, is_asc) {
    //console.log("sort:"+key, is_asc)
    return array.sort(function(a, b) {

      var x = 0;
      var y=0;

      if (key==='from_time')
      {
        x = a[key].replace(':','')*1;
        y = b[key].replace(':','')*1;
      }
      else {
        if (key==='price')
        {
          x = +a[key]*1;
          y = +b[key]*1;
        }
        else {
        x = a[key];
        y = b[key];
      }
      }


      if (is_asc)
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
      else
        return ((x > y) ? -1 : ((x < y) ? 1 : 0));
    });
  },


  getFaresBySegment:function (data, source_index, seg_index, sector) {
    var target_fare_table = [];
    for (var j = 0; j < data[source_index].Rows.length; j++) {
      var f_obj = data[source_index].Rows[j];
      try {
        for (var k = 0; k < f_obj.AvailReference.length; k++) {
          var segId = sector == 0
            ? f_obj.AvailReference[k].DepartureId
            : f_obj.AvailReference[k].ReturnId;
          if (segId == seg_index + 1) {
            target_fare_table.push({source_index: source_index, fare_index: j, av_index:k, price: f_obj.BaseFare, total_fare: f_obj.TotalFare})
            break;
          }
        }
      } catch (err) {}
    }

    return target_fare_table;
  },

  createSegTable:function(data, i, seg_table, seg_list, it)
  {
    for (var k = 0; k < seg_list.length; k++) {

      var segment_key = "";
      var seg_obj = seg_list[k];

      for (var f = 0; f < seg_obj.FlightList.length; f++) {
        var f_obj = seg_obj.FlightList[f];
        segment_key += f_obj.CarrierCode;
        segment_key += f_obj.FlightNumber;
        segment_key += f_obj.FromCode;
      }

      var seg_found = false;

      for (var s = 0; s < seg_table.length; s++) {
        var s_obj = seg_table[s];
        if (s_obj.segment_key === segment_key) {
          s_obj.source_index.push(i);
          s_obj.seg_index.push(k);
          //s_obj.pcc.push(gds.PCC);
          seg_found = true;
          s_obj.fares.push.apply(s_obj.fares, this.getFaresBySegment(data, i, k, it));
          break;
        }
      }



      if (!seg_found) {
        var segment = {
          source_index: [i],
          seg_index: [k],
          segment_key: segment_key,
          is_no_stop: seg_obj.FlightList.length == 1,
          from_time: seg_obj.FlightList[0].FromTime,
          travel_time:seg_obj.TravelTime*1,
          seats:seg_obj.SeatAvailable,
          fares: [],
          DepartureUTCTick: seg_obj.FlightList[0].DepartureUTCTick
        }
        segment.fares.push.apply(segment.fares, this.getFaresBySegment(data, i, k, it));
        seg_table.push(segment);
      }
    }
  },

  // create time range
  getTimeRange: function(av_obj, fare_obj, filter, is_return) {
    var preFix = is_return
      ? "ret_"
      : "dep_";
    //travel time

    var t_time = this.getMinutes(av_obj.TravelTime);



    fare_obj[preFix + 'travel_time'] = t_time;

    //travel time filter

    this.updateSliderRange(filter[preFix + 'travel_time'], t_time);

    //dep time and landing time
    if (av_obj.FlightList.length > 0) {
      var flight_obj = av_obj.FlightList[0];
      var last_flight_obj = av_obj.FlightList[av_obj.FlightList.length - 1];

      var d_time = this.replaceAll(flight_obj.FromDate, '-', '') * 1440 + this.getMinutes(flight_obj.FromTime.replace(':', ''));
      var l_time = this.replaceAll(last_flight_obj.ToDate, '-', '') * 1440 + this.getMinutes(last_flight_obj.ToTime.replace(':', ''));
      fare_obj[preFix + 'take_off_time'] = d_time;
      fare_obj[preFix + 'landing_time'] = l_time;

      //dep and landing time filter

      this.updateSliderRange(filter[preFix + 'take_off_time'], d_time);

      this.updateSliderRange(filter[preFix + 'landing_time'], l_time);
    }
  },
  //fare searchResult create fare seg_table
  createFareTable:function(data) {
    // this.props.stepActions.addItem({
    //     id:'fareFilter',
    //     prefered: false,
    //     farebasis: '',
    //     flightNo: ''
    // })
    const the_min = 1000000000000000000000;
    var filterTemp = {
      floor: the_min,
      low: 0,
      high: 0,
      ceil: 0
    };

    var fareArr = [];
    var avRef = {
      id: 'avRef',
      dep: [],
      ret: []
    };
    var availabilityArr = [];

    var lowPrice ={};

    var filter = {
      carrier: [],
      supplier:[],
      dep_stop:[],
      ret_stop:[],
      travel_class: [],
      price: Object.assign({}, filterTemp),
      dep_travel_time: Object.assign({}, filterTemp),
      ret_travel_time: Object.assign({}, filterTemp),
      total_travel_time: Object.assign({}, filterTemp),

      dep_take_off_time: Object.assign({}, filterTemp),
      dep_landing_time: Object.assign({}, filterTemp),
      ret_take_off_time: Object.assign({}, filterTemp),
      ret_landing_time: Object.assign({}, filterTemp)
    }

    for (var i = 0; i < data.length; i++) {
      //create fare table and airlines table
      var gds_obj = data[i];

      filter.supplier.push({id:gds_obj.SupplierId, name:gds_obj.SupplierName, is_selected:0});

      this.createSegTable(data, i, avRef.dep, gds_obj.Departure, 0)

      if (gds_obj.Return != null) {
        this.createSegTable(data,i,  avRef.ret, gds_obj.Return, 1)
      }

      for (var j = 0; j < gds_obj.Rows.length; j++) {
        var row_obj = gds_obj.Rows[j];
        //add b2b fareArr
        var fare_obj = {
            source_index: i,
            pcc:gds_obj.PCC,
            supplier_id: gds_obj.SupplierId,
            supplier_name: gds_obj.SupplierName,
            price: (1.0 *row_obj.TotalFare).toFixed(2),
            baggage: row_obj.Baggage,
            meal: row_obj.Meal,
            refundable:row_obj.Refundable,
            gross: (1.0 * row_obj.BaseFare).toFixed(2),
            equiv_gross: row_obj.EquivFare==0? (1.0 * row_obj.BaseFare).toFixed(2):(1.0 * row_obj.EquivFare).toFixed(2),
            currency: row_obj.EquivFareCurrency != null ? row_obj.EquivFareCurrency : row_obj.FareCurrency,
            original_currency:row_obj.FareCurrency,
            commission: Math.abs(row_obj.Commission),
            comm: (row_obj.Commission*row_obj.BaseFare/100.0).toFixed(2),
            tax_amount: row_obj.TaxAmount.toFixed(2),
            source: row_obj.Source,
            fee: (row_obj.ServiceFee+ row_obj.Incentive + row_obj.Markup).toFixed(2),
            dep_stop:'',
            ret_stop:'',
            fare_index: j
          }

        fareArr.push(fare_obj);

        if (lowPrice[row_obj.CarrierCode.trim()] != null)
        {
          if (+lowPrice[row_obj.CarrierCode.trim()] > +fare_obj.price)
          {
            lowPrice[row_obj.CarrierCode.trim()] = fare_obj.price;
          }
        }
        else {
          lowPrice[row_obj.CarrierCode.trim()] = fare_obj.price;
        }

        if (filter.travel_class.indexOf(row_obj.TravelClass.replace("Premium", "Premium ")) < 0) {
          filter.travel_class.push(row_obj.TravelClass.replace("Premium", "Premium "));
        }

        //carrier
        var is_found = false;
        for (var c = 0; c < filter.carrier.length; c++) {
          var c_obj = filter.carrier[c];
          if (c_obj.code === row_obj.CarrierCode) {
            is_found = true;
            c_obj.count++;
            this.updateSliderRange(c_obj.price_range, Math.ceil(row_obj.TotalFare));
            break;
          }
        }

        if (!is_found) {
          var new_carrier = {
            name: row_obj.CarrierName,
            code: row_obj.CarrierCode,
            price_range: Object.assign({}, filterTemp),
            count: 1,
            id: filter.carrier.length,
            is_selected: 0
          };

          this.updateSliderRange(new_carrier.price_range, Math.ceil(row_obj.TotalFare));
          filter.carrier.push(new_carrier);
        }

        //price filter
        this.updateSliderRange(filter.price, row_obj.TotalFare);

        for (var k = 0; k < row_obj.AvailReference.length; k++) {

          var av_obj = row_obj.AvailReference[k];

          var aAv = {
            source_index: i,
            supplier_id: gds_obj.SupplierId,
            supplier_name: gds_obj.SupplierName,
            fare_index: j,
            av_index: k,
            book_class: [row_obj.Departure.BookClass],
            travel_class: row_obj.TravelClass.replace("Premium", "Premium "),
            price: Math.ceil(row_obj.TotalFare),
            currency: row_obj.FareCurrency,
            carrier: row_obj.CarrierName,
            carrier_code: row_obj.CarrierCode,
            dep_take_off_time: "",
            dep_landing_time: "",
            ret_take_off_time: "",
            ret_landing_time: "",
            dep_travel_time: "",
            ret_travel_time: "",
            dep_stop:-1,
            ret_stop:-1
          };

          // dep_travel_time
          if ((av_obj.DepartureId > 0) && (gds_obj.Departure.length >= av_obj.DepartureId)) {
            //push dep itineraries
            var av = gds_obj.Departure[av_obj.DepartureId - 1];
            aAv.dep_stop =  av.FlightList.length
            if (fare_obj.dep_stop.indexOf('_'+ aAv.dep_stop+'_') < 0)
            {
              fare_obj.dep_stop += '_'+aAv.dep_stop+'_';
            }

            var flag = false;
            for (var c = 0; c < filter.dep_stop.length; c++) {
              var c_obj = filter.dep_stop[c];
              if (c_obj.stop === aAv.dep_stop) {
                flag = true;
                break;
              }
            }

            if (!flag) {
              var new_stop = {
                stop: aAv.dep_stop,
                id: aAv.dep_stop,
                is_selected: 0
              };
             // add new fare
             filter.dep_stop.push(new_stop);
           }

            this.getTimeRange(av, aAv, filter, false);
          }

          if ((av_obj.ReturnId > 0) && (gds_obj.Return != null) && (gds_obj.Return.length > 0) && (gds_obj.Return.length >= av_obj.ReturnId)) {
            var av = gds_obj.Return[av_obj.ReturnId - 1];
            aAv.ret_stop =  av.FlightList.length
            if (fare_obj.ret_stop.indexOf('_'+ aAv.ret_stop+'_') < 0)
            {
              fare_obj.ret_stop += '_'+aAv.ret_stop+'_';
            }

            var flag = false;
            for (var c = 0; c < filter.ret_stop.length; c++) {
              var c_obj = filter.ret_stop[c];
              if (c_obj.stop === aAv.ret_stop) {
                flag = true;
                break;
              }
            }

            if (!flag) {
              var new_stop = {
                stop: aAv.ret_stop,
                id: aAv.ret_stop,
                is_selected: 0
              }
             // add new fare
             filter.ret_stop.push(new_stop);
           }

            this.getTimeRange(av, aAv, filter, true);
            aAv.total_travel_time = aAv.dep_travel_time + aAv.ret_travel_time;
          } else {
            aAv.total_travel_time = aAv.dep_travel_time;
          }

          this.updateSliderRange(filter.total_travel_time, aAv.total_travel_time);
          availabilityArr.push(aAv);
      }
    }
    }

    return {
      filter:{
      id:"filter",
      lowPrice: lowPrice,
      carrier: filter.carrier,
      dep_stop: filter.dep_stop,
      ret_stop: filter.ret_stop,
      carrier_list: [],
      travel_class: filter.filter_travel_class,
      price: filter.price,
      dep_travel_time: filter.dep_travel_time,
      ret_travel_time: filter.ret_travel_time,
      total_travel_time: filter.total_travel_time,
      dep_take_off_time: filter.dep_take_off_time,
      dep_landing_time: filter.dep_landing_time,
      ret_take_off_time: filter.ret_take_off_time,
      ret_landing_time: filter.ret_landing_time,
      supplier:filter.supplier,
      prefered: false,
      farebasis: '',
      flightNo: '',
      sort0: 'price',
      sort1: 'travel_time',
      sort_arr:[
        ['price'], ['travel_time', 'departure_time']
      ],
      isAsc0: "1",
      isAsc1: "1",
      displayType:0,
      currentPage0:1,
      currentPage1:1,
      pageSize0:10,
      pageSize1:10,
      ffName:'',
      ffValue:''
      },
      avRef: avRef,
      fareTable: {id:"fareTable", data:fareArr},
      availabilityArr: {id:"availabilityArr", data:availabilityArr},
      faresIndex: {id:"faresIndex", data:[]}
      }
  }
}
