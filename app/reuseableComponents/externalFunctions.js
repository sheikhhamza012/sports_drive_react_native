import {AsyncStorage} from 'react-native'
import axio from 'axios'
import moment from 'moment'
export const trim=(str,size=10)=>{
    if(!str) return ""  
    if(str.length<size){
          return str;
      }
      return(str.substr(0,size-1)+"...");
  }


export const axios =async(method, url,data=null,auth=true)=> {
    const headers=auth?{
        Accept:'application/json',
        Authorization:await AsyncStorage.getItem('token')
    }:{
        Accept:'application/json',
    }
    return axio({
    method: method,
    url:url,
    data: data,
    headers:headers
  });
}
const moment_using_time = (t)=>moment.utc("2000-01-01 "+moment(t).utc().format("HH:mm"))
export const getPrice=(group_obj, booking)=>{

    const group = group_obj
    const {field_id,from_time,to_time,date} = booking
    const peak = ((group[0]??{}).prices?.find(x=>x.price_type=="Peak")??{})
    const off_peak =( (group[0]??{}).prices?.find(x=>x.price_type=="Off Peak")??{})
    const current_range = from_time&&to_time && moment.range(moment_using_time(from_time), moment_using_time(to_time).isBefore(moment_using_time(from_time)) ?moment_using_time(to_time).add(1,'days') : moment_using_time(to_time) )
    const hours = current_range && current_range.duration()/1000/60/60
    // console.log(peak)
    if(field_id){
        const field = (((group[0]??{}).fields??[]).find(x=>x.id==field_id)??{})
        for(var i=0;i<(field.prices??[]).length;i++){
            const individual = moment.range(moment(moment(field.prices[i].from_time)),moment(field.prices[i].to_time < field.prices[i].from_time ? moment(field.prices[i].to_time).add(1,'day') : moment(field.prices[i].to_time)))        
            if(current_range&&current_range.overlaps(individual)){
                return field.prices[i].price * hours
            }
        }
    }
    if(moment(date).day()==6||moment(date).day()==0){
        const weekend = ((group[0]??{}).prices?.find(x=>x.price_type=="Weekend")??{})
        const weekend_range = moment.range(moment(moment(weekend.from_time)),moment(weekend.to_time < weekend.from_time ? moment(weekend.to_time).add(1,'day') : moment(weekend.to_time)))
        if( current_range&&current_range.overlaps(weekend_range)){
            return weekend.price * hours
        }
    }

    
    // console.log(peak.from_time < peak.to_time)
    const peak_range = moment.range(moment(moment(peak.from_time)),moment( peak.to_time < peak.from_time ? moment(peak.to_time).add(1,'day') : moment(peak.to_time)))        
    console.log(current_range,peak)
    
    if(current_range && current_range.overlaps(peak_range)){
        return peak.price * hours
    }
    const off_peak_range = moment.range(moment(moment(off_peak.from_time)),moment(off_peak.to_time < off_peak.from_time ?moment(off_peak.to_time).add(1,'day') : moment(off_peak.to_time)))        
    if(current_range&&current_range.overlaps(off_peak_range)){
        return off_peak.price * hours
    }
    return "N/A"
}