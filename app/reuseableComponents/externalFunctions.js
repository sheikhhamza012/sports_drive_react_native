import {AsyncStorage} from 'react-native'
import axio from 'axios'
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