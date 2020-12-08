
import {createStore} from 'redux'

const initialState={
    isLoggedIn:false,
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
    become_a_vendor:{

    },
    activeBooking:null
 }

rootReducer=(istate,action)=>{
    var state = JSON.parse(JSON.stringify(istate))
    switch(action.type){
        case "SET_LOGGED_IN":
            state.isLoggedIn=action.data
            return state
        case "LOGOUT": 
            state=initialState
            return state
        case "RESET_FORMS": 
            
            state.booking=initialState.booking
            return state
        case "SIGNUP": 
            state.sign_up[action.data.key] = action.data.val
            return state
        case "SIGNIN": 
            state.sign_in[action.data.key] = action.data.val
            return state
        case "SET_USER": 
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
        default: 
            return state; 
    }    
}
export const store= createStore(rootReducer,initialState)
