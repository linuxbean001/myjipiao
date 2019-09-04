/*
// assuming Redux passes in the state object as this.props.data
{this.props.data.byId.map((item, index) => (
  <div key={index}>
    {this.props.data.byHash[item].content.title}
  </div>
)}
*/

import util from '../util/utility'
import * as actionTypes from '../constants/step'

const isPC= () => {
        var userAgentInfo = navigator.userAgent;
        var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
        var flag = true;
        for (var v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) {
                flag = false;
                break;
            }
        }
        return flag;
}

const isApple = ()=> {
        var userAgentInfo = navigator.userAgent;
        var Agents = ["iPhone","iPad", "iPod"];
        var flag = true;
        for (var v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) {
                flag = false;
                break;
            }
        }
        return flag;
}

const initialState = {
  byId: ['system','legs', 'ccList', 'ffList', 'cart', 'paxes'],
  byHash: {
    system: {
        id:'system',
        currency:'NZD',
        language:'cn',
        languageDisplay:'English',
        device: isPC()?'pc':'mb',
        brand: isApple? 'apple':'other',
        legTotal:1,
        trip_type:'RT',
        legIndex:0,
        adult:1,
        infant:0,
        child:0,
        travel_class:'Economy',
        is_b2c: 0,
        IsAutoTicket: 0,
        isDomestic: false,
        isUsa:false,
        ffValue:'',
        ffName:'',
        menu:'Home',
        menuIndex:100,
        isShowLogin:false,
        isShowMenu:false,
        heading:'kMYJIPIAO',
        reloc:'',
        isCheckReissueReady:false,
        tab:0,
        searchIndex:0,
        activeKey:0,
        isDisabled:false
    },
    path:['/home'],
    legs:[util.getFreshFsr()],
    leg0:{
      id:'leg0',
      fsr:util.getFreshFsr()
    },
    ccList:[],
    ffList:[],
    ff_airline_list:[],
    cart:[],
    adult:util.createPax('adult',1),
    child:[],
    infant:[],
    contact_details:
      {
       Mobile: "",
       Phone: "",
       Email: "",
       SpecialNotes: "",
       LastPurchaseDate: ""
     }
  }
}

export default function step(state = initialState, action) {
  switch (action.type) {
    case actionTypes.STEP_ADD_ITEM:
      if ((action.payload.data != null) && Array.isArray(action.payload.data))
      {
        return {
         byId: [ ...state.byId, action.id],
         byHash: {
           ...state.byHash,
           [action.id]: action.payload.data
         }
       }
      }

      return {
       byId: [ ...state.byId, action.id],
       byHash: {
         ...state.byHash,
         [action.id]: action.payload
       }
     }


     case actionTypes.STEP_ADD_MULTI_ITEM:

       return {
        byId: [ ...state.byId, action.id, ...Object.keys(action.payload)],
        byHash: {
          ...state.byHash,
          ...action.payload
        }
      }

    case actionTypes.STEP_UPDATE_ITEM:
      {
        state.byHash[action.id] = {
          ...state.byHash[action.id],
          ...action.payload
        }
        return {
          ...state
        }
      }
      case actionTypes.STEP_UPDATE_MULTI_ITEM:
      {
        return {
         byId: [ ...state.byId, action.id, ...Object.keys(action.payload)],
         byHash: {
           ...state.byHash,
           ...action.payload
         }
      }
    }
    case actionTypes.STEP_REMOVE_ITEM: {
          const prunedIds = state.byId.filter(item => {
           return item !== action.id // return all the items not matching the action.id
         })

         delete state.byHash[action.id] // delete the hash associated with the action.id

         return {
           byId: prunedIds,
           byHash: state.byHash
         }
        }

      case actionTypes.STEP_REMOVE_MULTI_ITEM: {
            const prunedIds = state.byId.filter(item => {
             return action.payload.indexOf(item) < 0 // return all the items not matching the action.id
           })

           for (var i=0; i< action.payload.length; i++)
           {
             delete state.byHash[action.payload[i]] // delete the hash associated with the action.id
           }

           return {
             byId: prunedIds,
             byHash: state.byHash
           }
      }

    case actionTypes.STEP_ADD_ARRAY_ITEM: {
         let pl = action.payload
         let arr = state.byHash[action.id]
         let index = ((pl.index == null) ||(pl.index <0))? arr.length:pl.index
         let obj = action.payload.obj
         if (Array.isArray(obj))
         {
           //obj is array
           //at the index
           state.byHash[action.id] = [...arr.slice(0, index),...obj,...arr.slice(index + 1)]
         }
         else {
           //is obj //at the index
           state.byHash[action.id] =[...arr.slice(0, index), obj, ...arr.slice(index + 1)]
         }

         return {
           ...state
         }
      }
    case actionTypes.STEP_UPDATE_ARRAY_ITEM:
        {
          let pl = action.payload
          let arr = state.byHash[action.id]

          var index = -1

          if ((pl.index ==null) || (pl.index <0))
          {
            if(pl.obj==null)
            {
              //console.log("STEP_UPDATE_ARRAY_ITEM: param error")
              return {
                ...state
              }
            }
            else {
              for (var i=0; i< arr.length; i++)
              {
                if(JSON.stringify(pl.obj) == JSON.stringify(arr[i]))
                {
                  index = i
                  break
                }
              }

              if(index == -1)
              {
                //console.log("STEP_UPDATE_ARRAY_ITEM: param error")
                return {
                  ...state
                }
              }
            }
          }
          else {
            index = pl.index
          }

          if (pl.obj == null)
          {
            state.byHash[action.id] = [...arr.slice(0, index), {
                        ...arr[index],
                        ...{
                          [pl.key]: pl.value
                        }
                      },
                      ...arr.slice(index + 1)]
          }
          else {
            state.byHash[action.id] = [...arr.slice(0, index), pl.obj,
                      ...arr.slice(index + 1)]
          }



          return {
            ...state
          }
        }
    case actionTypes.STEP_REMOVE_ARRAY_ITEM:
          {
            let pl = action.payload
            let arr = state.byHash[action.id]

            var index = -1

            if ((pl.index ==null) || (pl.index <0))
            {
              if(pl.obj==null)
              {
                //console.log("STEP_UPDATE_ARRAY_ITEM: param error")
                return {
                  ...state
                }
              }
              else {
                for (var i=0; i< arr.length; i++)
                {
                  if(JSON.stringify(pl.obj) == JSON.stringify(arr[i]))
                  {
                    index = i
                    break
                  }
                }

                if(index == -1)
                {
                  //console.log("STEP_UPDATE_ARRAY_ITEM: param error")
                  return {
                    ...state
                  }
                }
              }
            }
            else {
              index = pl.index
            }

            state.byHash[action.id] = [...arr.slice(0, index),...arr.slice(index + 1)]

            return {
              ...state
            }
          }

    case actionTypes.STEP_UPDATE_ARRAY_LENGTH: {
        let pl = action.payload
        let name = (pl.name == null) || (pl.name == '')? 'data':pl.name
        let arr = state.byHash[action.id]

        var length = (pl.length ==null) || (pl.length <0)? 0: pl.length

        state.byHash[action.id] = [...arr.slice(0, length)]

        return {
          ...state
        }
    }

    case actionTypes.STEP_CLEAR_ARRAY: {
        let pl = action.payload
        let arr = state.byHash[action.id]

        state.byHash[action.id] = []
        return {
          ...state
        }
    }

    case actionTypes.STEP_CLEAR_MULTI_ARRAY: {

        var tempArr ={};
        for (var i=0; i< action.payload.length; i++)
        {
          tempArr[action.payload[i]] =[];
        }

        return {
          ...state,
          byHash:{...state.byHash, ...tempArr}
        }
    }

    default:
      return state
  }
}
