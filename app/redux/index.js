
import {createStore} from 'redux'
import moment from 'moment'
import messaging from '@react-native-firebase/messaging';
import {api} from '../constants'
import {axios} from '../reuseableComponents/externalFunctions'
const initialState={
    current_view:"player",
    current_sports:"",
    isLoggedIn:false,
    isLoggingIn:true,
    sign_up:{
        email:"",
        first_name:"",
        last_name:"",
        password:"",
        confirm_password:"",
        city:"",
        phone:"",
    },
    sign_in:{
        email:"",
        password:""
    },
    
    user:{
    },
    selected_sports:"",
    booking:{

    },
    booking_calendar:{
        selectedDate:moment().format("YYYY-MM-DD"),
        field_id:null
    },
    become_a_vendor:{
        game_index:0,
        name_of_arena:"",
        checkedGames:[]
    },
    activeBooking:null,
    my_arena:{},
    pending_booking_requests:[],
    teams:[]
 }

rootReducer=(istate,action)=>{
    
    var state = JSON.parse(JSON.stringify(istate))
    switch(action.type){
        case "SET_LOGGED_IN":
            state.isLoggedIn=action.data
            return state
        case "LOGOUT": 
            messaging().requestPermission().then(permission=>{
                if(permission){
                    messaging().getToken().then(token => {
                        axios('delete',api.delete_token(action.data,token),null,false)
                        .then(async ({data})=>{
                            if(data.error){                            
                                console.log(data.msg, "in deleteing token")
                                return
                            }

                        })
                        .catch(async(x)=>{
                            console.log(x,"in deleteing token")
                        })
                    });
                }
            })
           
            state=initialState
            return state
        case "RESET_FORMS": 
            state.become_a_vendor = initialState.become_a_vendor
            state.booking=initialState.booking
            return state
        case "SIGNUP": 
            state.sign_up[action.data.key] = action.data.val
            return state
        case "SIGNIN": 
            state.sign_in[action.data.key] = action.data.val
            return state
        case "SET_USER":
            messaging().requestPermission().then(permission=>{
                if(permission){
                    messaging().getToken().then(token => {
                        axios('post',api.save_token,{token:token},true)
                        .then(async({data})=>{
                            if(data.error){                            
                                console.log(data.msg,"in saving token")
                                return
                            }
                        })
                        .catch(x=>console.log(x,"in saving token"))
                        
                    });
                  }
              })
            state.user = action.data
            state.isLoggedIn = true
            return state
        case "SELECT_SPORTS": 
            state.selected_sports = action.data
            return state
        case "SET_BOOKING_PARAMS": 
            state.booking[action.key] = action.data
            return state
        case "SET_ACTIVE_REQUEST": 
            state.activeBooking = action.data
            return state
        case "SET_BOOKING_PARAMS_DATE": 
            state.booking["from_time"] = action.data.from
            state.booking["to_time"] = action.data.to
            return state
        case "SET_BOOKING_TIME": 
            let time = state.booking[action.key].split(' ')
            time[1] = action.data
            time = time.join(' ')
            state.booking[action.key] = time
            return state
        case "MY_ARENA_BOOKING_REQUESTS": 
            state.user.arena_booking_requests = action.data
            return state
        case "SET_VALUE": 
            state[action.screen][action.key] = action.data
            return state
        case "IS_LOGGING_IN": 
            state.isLoggingIn = action.data
            return state
        case "SET_SCREEN": 
            state[action.key] = action.data
            return state
        case "BOOKING_REQUEST_RECIEVED":
            state.current_view = "vendor"
            state.isLoggingIn = true
            state.pending_booking_requests.push(JSON.parse(action.data.data.booking_request))
            return state
        default: 
            return state; 
    }    
}
export const store= createStore(rootReducer,initialState)
