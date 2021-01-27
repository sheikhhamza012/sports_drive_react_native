import React, { Component } from 'react'
import  { Text,TextInput,KeyboardAvoidingView ,TouchableOpacity, View, ScrollView,StyleSheet,Image, ImageBackground, AsyncStorage} from 'react-native'
import Button from '../reuseableComponents/button'
import { colors,api } from '../constants'
import {axios} from '../reuseableComponents/externalFunctions'
import Toast from 'react-native-easy-toast'
import { color } from 'react-native-reanimated'
export default class home extends Component {
    state={
        errors:{},
        sign_up:{
            email:"",
            first_name:"",
            last_name:"",
            password:"",
            confirm_password:"",
            city:"",
            phone:"",
            // isVendor:false
        },
    }
    handleInput=x=>{
        this.setState({sign_up:{...this.state.sign_up,[x.name]:x.val},errors:{...this.state.errors, [x.name]:false}})
    }
    validate = data=>{
        var error = false
        Object.keys(data).map(x=>{
            if(data[x].length<=0){
                error=true
                this.state.errors[x] = true
                this.forceUpdate()
            }
        })
        return !error
    }
    sign_up=()=>{
        this.setState({isSubmitting:true})

        if (!this.validate(this.state.sign_up)){
            this.setState({isSubmitting:false})
            this.refs.toast.show("Please fill the form to continue")
            return
        }
        if (this.state.sign_up.password != this.state.sign_up.confirm_password){
            this.setState({isSubmitting:false,errors:{...this.state.errors, confirm_password:true}})
            this.refs.toast.show("Confirm Password does not match your Password")
            return
        }
        axios('post',api.register,{user:this.state.sign_up},false)
        .then(async({data})=>{
            this.setState({isSubmitting:false})
            if(data.error){
                data.keys.map(x=>{
                    this.state.errors[x] = true
                    this.forceUpdate()
                })
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
    render() {
        return (
            <ImageBackground style={styles.background} source={require('../images/app_background.png')}>
                <Toast 
                    ref="toast"
                    position='bottom'
                    positionValue={200}
                />
                <ScrollView style={{marginTop:130}} contentContainerStyle={styles.root}>
                    <KeyboardAvoidingView behavior="height">

                    <Text style={styles.title}>Sign Up</Text>
                    <Field refs={r=>this.email=r} focusOn={()=>this.phone} error={this.state.errors.email} value={this.state.sign_up.email} handleInput={this.handleInput} name="email" placeholder="Email" />
                    <Field refs={r=>this.phone=r} focusOn={()=>this.first_name} keyboardType="numeric" error={this.state.errors.phone} value={this.state.sign_up.phone} handleInput={this.handleInput} name="phone" placeholder="Phone number"/>
                    <View style={{flexDirection:"row"}}>
                        <Field refs={r=>this.first_name=r} focusOn={()=>this.last_name} error={this.state.errors.first_name} value={this.state.sign_up.first_name} handleInput={this.handleInput} name="first_name" placeholder="First Name" style={{flex:1,borderRightWidth:1}}/>
                        <Field refs={r=>this.last_name=r} focusOn={()=>this.password} error={this.state.errors.last_name} value={this.state.sign_up.last_name} handleInput={this.handleInput} name="last_name" placeholder="Last Name" style={{flex:1,paddingLeft:15}}/>
                    </View>
                    <Field refs={r=>this.password=r} focusOn={()=>this.confirm_password} error={this.state.errors.password} value={this.state.sign_up.password} handleInput={this.handleInput} password={true} name="password" placeholder="Create Password" />
                    <Field refs={r=>this.confirm_password=r} focusOn={()=>this.city} error={this.state.errors.confirm_password} value={this.state.sign_up.confirm_password} handleInput={this.handleInput} password={true} name="confirm_password" placeholder="Confirm Password" />
                    <Field refs={r=>this.city=r} onSubmitEditing={this.sign_up} error={this.state.errors.city} value={this.state.sign_up.city} handleInput={this.handleInput} name="city" placeholder="City" style={{marginBottom:40}}/>
                    {/* <View style={{flexDirection:"row",marginBottom:30}}>
                        <CheckBox handleInput={this.handleInput} checked={this.state.sign_up.isVendor} value={false} name="isVendor" text="Player"/>    
                        <View style={{width:10}}/>
                        <CheckBox handleInput={this.handleInput} checked={this.state.sign_up.isVendor} value={true} name="isVendor" text="Vendor"/>
                    </View> */}
                    <Button isLoading={this.state.isSubmitting} onPress={this.sign_up} placeholder="Sign Up" style={{...styles.button,backgroundColor:colors.light_green}}/>
                    </KeyboardAvoidingView>

                </ScrollView>
            </ImageBackground>
        )
    }
}




class Field extends Component {
    onSubmitEditing=()=>{
        if(this.props.focusOn){
            this.props.focusOn().focus()
        }else{
            this.props.onSubmitEditing&&this.props.onSubmitEditing()
        }
    }
    render() {
        return (
            <View style={[styles.fieldContainerStyle,this.props.style,this.props.error&&{borderColor:colors.light_red},this.props.multiline&&{paddingVertical:10}]}>
                <TextInput 
                    editable={this.props.editable??true}
                    blurOnSubmit={this.props.focusOn?false:true}
                    ref={this.props.refs}
                    keyboardType={this.props.keyboardType}
                    value={this.props.value}
                    autoCorrect={false}
                    style={[styles.fieldStyle,this.props.fieldStyle,this.props.error&&{color:colors.red},this.props.multiline&&{height:100}]}
                    placeholder={this.props.placeholder}
                    placeholderTextColor={this.props.error? colors.red:(this.props.placeholderColor ?? colors.light_grey)}
                    onChangeText={t=>this.props.handleInput({name:this.props.name,val:t})}
                    autoCapitalize={this.props.autoCapitalize??"none"}
                    secureTextEntry={this.props.password??false}
                    onSubmitEditing={this.onSubmitEditing}
                    multiline={this.props.multiline&&true}
                    numberOfLines = {this.props.multiline}
                />
                
            </View>
            )
    }
}
export {Field}
const styles=StyleSheet.create({
    checkbox_label:{
        fontSize:16,
        color:colors.grey,
    },
    checkbox_container:{
        alignItems:"center",
        justifyContent:"center",
        backgroundColor:colors.white,
        borderRadius:5,
        paddingVertical:20,
        flex:1,
        flexDirection:"row"
    },
    title:{
        marginBottom:26,
        fontSize:30,
        color:colors.white
    },  
    fieldContainerStyle:{
        borderBottomWidth:1,
        borderColor:colors.grey
    },
    fieldStyle:{
        paddingVertical:12,
        fontSize:16,
        color:colors.white
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