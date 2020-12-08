import React, { Component } from 'react'
import  { Text,TextInput,KeyboardAvoidingView ,TouchableOpacity, View, ScrollView,StyleSheet,Image, ImageBackground, AsyncStorage} from 'react-native'
import Button from '../reuseableComponents/button'
import { colors,api } from '../constants'
import {axios} from '../reuseableComponents/externalFunctions'
import Toast from 'react-native-easy-toast'
import {Field} from './signup'
import DropDownPicker from 'react-native-dropdown-picker';
import { color } from 'react-native-reanimated'
export default class App extends Component {
    state={
        errors:{},
        profile:this.props.user,
    }
    handleInput=x=>{
        this.setState({profile:{...this.state.profile,[x.name]:x.val},errors:{...this.state.errors, [x.name]:false}})
    }
    update=()=>{
        this.setState({isSubmitting:true})
        if (!this.state.profile.featured?.length>0){
            this.setState({isSubmitting:false,errors:{featured:true}})
            this.refs.toast.show("Please fill the information to continue")
            return
        }
        axios('patch',api.edit_profile,{user:{...this.state.profile,image:undefined}},true)
        .then(async({data})=>{
            this.setState({isSubmitting:false})
            if(data.error){
               
                this.refs.toast.show(data.msg)
                return
            }
            this.props.dispatch({type:"SET_USER",data:data.user})
            this.props.navigation.navigate("profile")
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
                    <Text style={styles.title}>Update Profile</Text>
                    <Field refs={r=>this.featured=r} multiline={5} error={this.state.errors.featured} value={this.state.profile.featured} handleInput={this.handleInput} name="featured" placeholder="Featured" style={{marginTop:10,marginBottom:10}}/>
                    <Button isLoading={this.state.isSubmitting} onPress={this.update} placeholder="Update"  style={{...styles.button,backgroundColor:colors.light_green,marginTop:20}}/>
                </ScrollView>
            </ImageBackground>
        )
    }
}

const styles=StyleSheet.create({
    checkbox_label:{
        fontSize:16,
        color:colors.grey,
    },
    overlay:{
        backgroundColor:colors.overlay,
        width:"100%",
        height:"100%",
        alignItems:"center",
        justifyContent:"center"
    },
    profilePic:{
        height:200,
        width:"100%",
        backgroundColor:colors.white,
        marginBottom:10,
        resizeMode:"cover"
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
        marginBottom:30,
        fontSize:30,
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
        padding:30,
        paddingBottom:100
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