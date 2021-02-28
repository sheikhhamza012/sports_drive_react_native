import {StyleSheet} from 'react-native'
export const url="https://sports-drive.herokuapp.com/api/";
// export const url="http://10.0.2.2:3000/api/";
// export const url="http://0.0.0.0:3000/api/";
// export const url="http://192.168.10.14:3000/api/";
export const notification_types={
  BOOKING_REQUEST_RECIEVED:0,
  BOOKING_REQUEST_ACCEPTED:1
}
export const api={
    register: url+'users/',
    login: url+'users/login',
    get_user: url+'users/get_user',
    save_token: url+'/devices/',
    delete_token: (user,token)=>url+`/users/${user}/devices/${token}`,
    edit_profile: url+'users/',
    search: url+'arena/search',
    arena_booking_requests: url+'arena_booking_request',
    all_orders: url+'arena_booking_request/my_orders',
    order_detail: id=>url+`arena_booking_request/${id}/order_detail`,
    field_arena_booking_requests: (id,date)=>url+`/fields/${id}/arena_booking_request?date=${date}`,
    book_arena:(id)=>( url+`fields/${id}/book_arena`),
    get_arena:(id)=>( url+`arena/${id}`),
    get_arena_with_time:(id)=>( url+`arena/${id}/availibility`),
    get_group:(id)=>( url+`groups/${id}`),
    get_teams:url+`teams`,
    create_price:(id)=>( url+`groups/${id}/prices`),
    create_price_for_field:(id)=>( url+`fields/${id}/prices`),
    update_price:(pid,id)=>( url+`groups/${pid}/prices/${id}`),
    update_group:(id)=>( url+`groups/${id}`),
    update_field:(id)=>( url+`fields/${id}`),
    search_by_availability: url+'arena/search_by_availability',
    get_active_request: url+'arena_booking_request/get_active_request',
    become_a_vendor: url+'/users/become_a_vendor',
    my_arenas: url+'/arena/my_arenas',
    my_earning: url+'/arena_booking_request/my_earning',
    pending_requests: url+'/arena_booking_request/pending_requests',
    update_booking_requests: id=>url+ `/arena_booking_request/${id}`,
    delete_booking_request:id=> `${url}/arena_booking_request/${id}`,
    delete_price_slot:id=> `${url}/prices/${id}`,
    get_price_slots_of_field:(id,date)=> `${url}/fields/${id}/prices?date=${date}`,
    create_team: `${url}/teams`,
    join_team: token=>`${url}/teams/join?token=${token}`,
}
export const colors={
  dark_grey:"#666",
  black:"#000",
  white:"#fff",
  grey:"#999",
  light_grey3:"#ccc",
  light_grey2:"#9f9f9f",
  light_grey:"rgba(243,246,248,255)",
  light_green:'rgb(141,196,70)',
  transparent_light_grey:"rgba(0,0,0,0.4)",
  google_blue:"rgba(69,135,240,1)",
  fb_blue:"rgba(67,95,172,1)",
  blue:'rgba(5,54,122,255)',
  light_blue:'rgba(7,53,114,255)',
  blue_2:'rgba(76,101,130,255)',
  yellow:'rgba(255,255,16,255)',
  red:"#e74c3c",
  light_red:"#d29892",
  overlay:"rgba(0,0,0,0.6)"
}

export const global_styles = StyleSheet.create({
  headerPadding:{paddingTop:90}
  // headerPadding:{paddingTop:0}
})