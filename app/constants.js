export const url="https://sports-drive.herokuapp.com/api/";
// export const url="http://192.168.10.10:3000/api/";
export const api={
    register: url+'users/',
    login: url+'users/login',
    get_user: url+'users/get_user',
    edit_profile: url+'users/',
    search: url+'arena/search',
    arena_booking_requests: url+'arena_booking_request',
    book_arena:(id)=>( url+`arena/${id}/book_arena`),
    get_arena:(id)=>( url+`arena/${id}`),
    search_by_availability: url+'arena/search_by_availability',
    get_active_request: url+'arena_booking_request/get_active_request',
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
  overlay:"rgba(0,0,0,0.7)"
}