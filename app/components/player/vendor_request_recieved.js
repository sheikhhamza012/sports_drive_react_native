import React, { Component } from 'react'
import  { Text ,TouchableOpacity, View,StatusBar, ScrollView,StyleSheet,Image, ImageBackground, AsyncStorage, ActivityIndicator} from 'react-native'
import { colors,api } from '../../constants'
import Icon from 'react-native-vector-icons/Octicons'
export default class home extends Component {
    state = {
    };
    
    componentDidMount() {
    }
    componentWillUnmount=()=>{
    }
    render() {
        return (
            <View style={styles.root}>
                <StatusBar barStyle="light-content"/>
                <Text style={{color:colors.white,fontSize:32,borderWidth:1,borderColor:colors.white,padding:10,paddingHorizontal:20,marginBottom:10}}>Submitted</Text>
                <Icon name="checklist" color={colors.white} size={100} style={{marginLeft:30}}/>
                <Text style={{color:colors.white,marginTop:20,fontSize:22}}>Awaiting Approval</Text>
            </View>
        )
    }
}

const styles=StyleSheet.create({
    
    title:{
        color:colors.white,
        fontSize:32
    },
    root:{
        
        backgroundColor:colors.blue,
        flex:1,
        justifyContent:"center",
        alignItems:"center"
    },
    
    background:{
        aspectRatio:63/54,
        width:50,
        height:undefined,
        marginTop:20,
        alignSelf:"center",

    }
})