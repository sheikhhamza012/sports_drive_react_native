import React, { Component } from 'react'
import  { Text ,TouchableOpacity, View, ScrollView,StyleSheet,Image, ImageBackground, AsyncStorage, ActivityIndicator} from 'react-native'
import Button from '../reuseableComponents/button'
import { colors,api } from '../constants'
import {axios} from '../reuseableComponents/externalFunctions'
import Toast from 'react-native-easy-toast'
import {Field} from './signup'
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/AntDesign'

export default class home extends Component {
  
    render() {
        return (
            <View style={styles.background} >
                <Toast 
                    ref="toast"
                    position='bottom'
                    positionValue={200}
                />
                <ScrollView style={{marginTop:130}} contentContainerStyle={styles.root}>
                    <Text style={styles.title}>{this.props.route.params.text}</Text>
                    {/* <Text style={styles.title}>Successful</Text> */}
                    <Icon name="checkcircleo" size={54} color={colors.white} style={{marginTop:20}}/>
                    {/* <Button  onPress={()=>{
                        this.props.dispatch({type:"RESET_FORMS"})
                        this.props.navigation.navigate("home")
                        }} placeholder="HOME" style={{backgroundColor:colors.light_green,marginTop:20,}}/> */}
                </ScrollView>
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
        flexGrow:1,
        padding:30,
        paddingBottom:100,
        alignItems:"center",
        justifyContent:"center"
    },
    
    background:{
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:colors.blue
    }
})