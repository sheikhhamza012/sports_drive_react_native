import {connect} from 'react-redux'
import splash from './splash'
import authentication from './components/authentication'
import signup from './components/signup'
import signin from './components/signin'
import home from './components/home'
import player_sports_menu from './components/player/sports_menu'
import vendor_sports_menu from './components/vendor/sports_menu'
import booking_search from './components/player/booking_search'
import booking_details from './components/player/booking_details'
import player_profile from './components/player/profile'
import vendor_profile from './components/vendor/profile'
import update_profile from './components/update_profile'
import update_featured from './components/update_featured'
import update_about from './components/update_about'
import done from './components/done'
import booking_request_recieved from './components/player/booking_request_recieved'
import booking_history from './components/player/booking_history'
import register_arena from './components/vendor/register_arena'
import become_a_vendor from './components/player/become_a_vendor'
import arena_info from './components/player/arena_info'
export default {
    splash:connect((state)=>state)(splash),
    Authentication:connect((state)=>state)(authentication),
    signup:connect((state)=>state)(signup),
    signin:connect((state)=>state)(signin),
    home:connect((state)=>state)(home),
    update_profile:connect((state)=>state)(update_profile),
    update_featured:connect((state)=>state)(update_featured),
    update_about:connect((state)=>state)(update_about),
    done:connect((state)=>state)(done),
    player:{
        profile:connect((state)=>state)(player_profile),
        sports_menu:connect((state)=>state)(player_sports_menu),
        booking_search:connect((state)=>state)(booking_search),
        booking_details:connect((state)=>state)(booking_details),
        booking_request_recieved:connect((state)=>state)(booking_request_recieved),
        booking_history:connect((state)=>state)(booking_history),
        become_a_vendor:connect((state)=>state)(become_a_vendor),
        arena_info:connect((state)=>state)(arena_info),
    },
    vendor:{
        profile:connect((state)=>state)(vendor_profile),
        sports_menu:connect((state)=>state)(vendor_sports_menu),
        register_arena:connect((state)=>state)(register_arena),
        booking_details:connect((state)=>state)(booking_details),
    }
}
