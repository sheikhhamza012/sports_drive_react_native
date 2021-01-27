import React, { Component } from 'react'
import  { Text ,TouchableOpacity, View, ScrollView,StyleSheet,Image, ImageBackground, AsyncStorage, ActivityIndicator} from 'react-native'
import Button from '../../reuseableComponents/button'
import { colors,api } from '../../constants'
import {axios} from '../../reuseableComponents/externalFunctions'
import Toast from 'react-native-easy-toast'
import {Field} from '../signup'
import DropDownPicker from 'react-native-dropdown-picker';

export default class home extends Component {
    state = {
        index: 0,
        isAnimating: false
    };
    seq=[
        require('../../images/booking_request_recieved/1.jpg'),
        require('../../images/booking_request_recieved/2.jpg'),
        require('../../images/booking_request_recieved/3.jpg'),
        require('../../images/booking_request_recieved/4.jpg'),
        require('../../images/booking_request_recieved/5.jpg')
    ]
    componentDidMount() {
        const that=this
        this.id = setInterval(() => {
            that.setState({ index: ++this.state.index %5});
        }, 100);
    }
    componentWillUnmount=()=>{
        clearInterval(this.id)
    }
    render() {
        return (
            <View style={styles.root}>
                <Text style={{color:colors.light_blue,fontSize:32}}>Thank You</Text>
                <Text style={{color:colors.blue,fontSize:16,marginLeft:5,marginTop:5,marginBottom:100}}>Your booking has been processed (time)</Text>
                <Text style={{color:colors.blue,fontSize:16,marginLeft:5,}}>- Booking recieved by the arena</Text>
                {/* <Image style={styles.background}  source={require('../../images/booking_request_recieved/booking_request_recieved.jpg')}/> */}
                <View style={{width:"99%",borderBottomWidth:1,borderBottomColor:colors.light_blue}}>
                     <Image style={styles.background} source={this.seq[this.state.index]}  />
                </View>
                
                <Text style={{color:colors.blue,marginTop:30,fontSize:16,marginLeft:5,}}>- Waiting for approval</Text>
            </View>
        )
    }
}

const styles=StyleSheet.create({
    
    title:{
        color:colors.white,
        fontSize:32
    },
    root:{padding:20,backgroundColor:colors.white,flex:1,paddingTop:130},
    
    background:{
        aspectRatio:63/54,
        width:50,
        height:undefined,
        marginTop:20,
        alignSelf:"center",

    }
})