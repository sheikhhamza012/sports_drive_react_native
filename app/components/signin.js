import React, { Component } from 'react'
import  { Text,TextInput ,TouchableOpacity, View, ScrollView,StyleSheet,Image, ImageBackground,AsyncStorage} from 'react-native'
import Button from '../reuseableComponents/button'
import { colors,api } from '../constants'
import {Field} from './signup'
import Toast from 'react-native-easy-toast';
import {axios} from '../reuseableComponents/externalFunctions'

export default class home extends Component {
    state={sign_in:{email:"",password:""}}
    sign_in=()=>{
        this.setState({isSubmitting:true})
        if (!this.state.sign_in.email.length>0||!this.state.sign_in.email.length>0){
            this.setState({isSubmitting:false})
            this.refs.toast.show("Please fill the form to continue")
            return
        }
        axios('post',api.login,{user:{email: this.state.sign_in.email.trim(),password:this.state.sign_in.password.trim()}},false)
        .then(async({data})=>{
            this.setState({isSubmitting:false})
            if(data.error){
                this.refs.toast.show(data.msg)
                return
            }
            await AsyncStorage.setItem("token", data.auth_token)
            this.props.dispatch({type:"SET_USER",data:data.user})
        })
        .catch(x=>{
            this.setState({isSubmitting:false})
            console.log(x)
        })
    }
    handleInput=x=>{
        this.setState({sign_in:{...this.state.sign_in, [x.name]:x.val}})
    }
   
    
    render() {
        return (
            <ImageBackground style={styles.background} source={require('../images/app_background.png')}>
                <Toast 
                    ref="toast"
                    position='bottom'
                    positionValue={200}
                />
                <ScrollView style={{marginTop:130}} contentContainerStyle={styles.root}>
                    <Text style={styles.title}>Log In</Text>
                    <Field refs={r=>this.email=r} focusOn={()=>this.password}  value={this.state.sign_in.email} handleInput={this.handleInput} name="email" placeholder="Email" />
                    <Field refs={r=>this.password=r} onSubmitEditing={this.sign_in}  value={this.state.sign_in.password} handleInput={this.handleInput} password={true} name="password" placeholder="Password" />
                    <Text style={styles.forgotPassword}>Forgot Your Password</Text>
                    <Button onPress={this.sign_in} isLoading={this.state.isSubmitting} placeholder="Log In" style={{...styles.button,backgroundColor:colors.light_green}}/>

                </ScrollView>
            </ImageBackground>
        )
    }
}
const styles=StyleSheet.create({
    forgotPassword:{
        marginBottom:50,
        color:colors.grey,marginTop:10,
        fontSize:10,
        textAlign:"right"
    },
    title:{
        marginBottom:30,
        fontSize:26,
        color:colors.white
    },  
    fieldContainerStyle:{
        backgroundColor:colors.white,
        borderWidth:1,
        borderColor:colors.grey
    },
    fieldStyle:{
        paddingVertical:12,
        paddingHorizontal:18,
        fontSize:16
    },
    cover:{
        // aspectRatio:2251/1403,
        height:200,
        width:"100%",
        resizeMode:"cover"
    },
    root:{
        flexGrow:1,
        padding:30
    },
    row:{
       
        flexDirection:"row",
        justifyContent:"space-around",
        paddingHorizontal:20,
        paddingBottom:20,
    },
    background:{
        resizeMode:"cover",
        width:"100%",
        height:"100%",
        justifyContent:"center",
        alignItems:"stretch",
    }
})