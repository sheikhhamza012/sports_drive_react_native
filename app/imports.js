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
import booking_request_recieved from './components/player/booking_request_recieved/index'
import booking_request_accepted from './components/player/booking_request_recieved/booking_request_accepted'
import booking_history from './components/player/booking_history'
import register_arena from './components/vendor/register_arena'
import become_a_vendor from './components/player/become_a_vendor'
import select_sports from './components/player/select_sports'
import arena_info from './components/player/arena_info'
import vendor_request_recieved from './components/player/vendor_request_recieved'
import my_arenas from './components/vendor/my_arena'
import group_pricing from './components/vendor/group_pricing'
import booking_calender from './components/vendor/calendar_bookings/calendar'
import time_slots from './components/vendor/calendar_bookings/time_slots'
import price_slots from './components/vendor/calendar_bookings/price_slots'
import my_orders from './components/vendor/my_orders/index'
import view_order from './components/vendor/my_orders/view_order'
import my_earnings from './components/vendor/my_earnings/index'
import pending_booking_requests from './components/vendor/pending_booking_requests/index'
import show_pending_booking_requests from './components/vendor/pending_booking_requests/show'
import debug from './components/player/debug'
import create_team from './components/player/create_team'
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
        booking_request_accepted:connect((state)=>state)(booking_request_accepted),
        booking_history:connect((state)=>state)(booking_history),
        select_sports:connect((state)=>state)(select_sports),
        become_a_vendor:connect((state)=>state)(become_a_vendor),
        arena_info:connect((state)=>state)(arena_info),
        vendor_request_recieved:connect((state)=>state)(vendor_request_recieved),
        debug:connect((state)=>state)(debug),
        create_team:{
            index:connect((state)=>state)(create_team),
        }
    },
    vendor:{
        profile:connect((state)=>state)(vendor_profile),
        sports_menu:connect((state)=>state)(vendor_sports_menu),
        register_arena:connect((state)=>state)(register_arena),
        booking_details:connect((state)=>state)(booking_details),
        my_arenas:connect((state)=>state)(my_arenas),
        pending_booking_requests:{
            index:connect((state)=>state)(pending_booking_requests),
            show:connect((state)=>state)(show_pending_booking_requests),
        },
        group_pricing:connect((state)=>state)(group_pricing),
        my_orders:{
            index:connect((state)=>state)(my_orders),
            view_order:connect((state)=>state)(view_order),
        },
        my_earnings:{
            index:connect((state)=>state)(my_earnings),
        },
        booking_calendar:{
            calendar:connect((state)=>state)(booking_calender),
            time_slots:connect((state)=>state)(time_slots),
            price_slots:connect((state)=>state)(price_slots),
        }
    }
}
