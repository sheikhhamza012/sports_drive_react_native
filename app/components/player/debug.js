import React, { Component } from 'react'
import { Text, View,TextInput } from 'react-native'
import messaging from '@react-native-firebase/messaging';

export default class debug extends Component {
    state={
        apn:{},
        fcm:{},
        msg:{},
    }
    componentDidMount=()=>{
        messaging().requestPermission().then(permission=>{
          console.log(permission);
          if(permission){
              messaging().getAPNSToken().then(x=>this.setState({apn:{x,type:"token"}}))
              messaging().getToken().then(token => {
                  this.setState({fcm:{token,type:"token"}});
                  messaging().onMessage((message) => {
                      this.setState({msg:message});
                    });
                });
            }
        })
    }
    render() {
        return (
            <View>
                <TextInput value={JSON.stringify(this.state)} style={{backgroundColor:"white",height:200}} multiline={true}/>
            </View>
        )
    }
}
