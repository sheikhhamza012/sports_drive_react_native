import React, { Component } from 'react'
import  { Text,TextInput,KeyboardAvoidingView ,TouchableOpacity, View, ScrollView,StyleSheet,Image, ImageBackground, AsyncStorage} from 'react-native'
import Button from '../../reuseableComponents/button'
import { colors,api } from '../../constants'
import {axios} from '../../reuseableComponents/externalFunctions'
import Toast from 'react-native-easy-toast'
import {Field} from '../signup'

export default class home extends Component {
    state={
        errors:{},
        register_arena:{
            image:{},
            name:"",
            location:"",
        },
    }
    handleInput=x=>{
        this.setState({register_arena:{...this.state.register_arena,[x.name]:x.val},errors:{...this.state.errors, [x.name]:false}})
    }
    validate = data=>{
        var error = false
        const {register_arena} = this.state
        if(!register_arena.image.uri){
            this.state.errors.image = "Please select the image"
            var error = true
        }
        if(!register_arena.name){
            this.state.errors.name = "Please select the name"
            var error = true
        }
        if(!register_arena.location){
            this.state.errors.location = "Please select the location"
            var error = true
        }
        this.forceUpdate()
        return !error
    }
    selectImage = async () => {
        const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
        if (status != 'granted') {
            alert('Sorry, we need camera roll permissions change the picture!');
            return 
        }
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
        
        if (!result.cancelled) {
            let file = /^.*\/(.*)\.(.*)$/g.exec(result.uri);
            var image = {
                uri: result.uri,
                type: "image/*",
                name: file[1]+"."+file[2] 
            }
            this.setState({register_arena:{...this.state.register_arena,image:image},errors:{...this.state.errors, image:false}})

            
        }
    }
    submit=()=>{
        this.setState({isSubmitting:true})

        if (!this.validate(this.state.register_arena)){
            this.setState({isSubmitting:false})
            this.refs.toast.show("Please fill the form to continue")
            return
        }
      
        axios('post',api.register_arena,{user:this.state.sign_up},false)
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
            <ImageBackground style={styles.background} source={require('../../images/app_background.png')}>
                <Toast 
                    ref="toast"
                    position='bottom'
                    positionValue={200}
                />
                <ScrollView style={{marginTop:130}} contentContainerStyle={styles.root}>
                        <Text style={styles.title}>Register Your Arena</Text>
                        <View style={{flexDirection:"row"}}>
                            <Field error={this.state.errors.image} value={this.state.register_arena.image.uri} editable={false} placeholder="Image" style={{flex:1}}/>
                            <Button placeholder="Select Image" onPress={this.selectImage} style={{borderRadius:0,width:100,backgroundColor:colors.light_green,height:45}} placeholderStyle={{fontSize:11}}/>
                        </View>
                        <Field refs={r=>this.name=r} focusOn={()=>this.location} error={this.state.errors.name} value={this.state.register_arena.name} handleInput={this.handleInput} name="name" placeholder="Name" />
                        <Field refs={r=>this.location=r} onSubmitEditing={()=>this.submit} error={this.state.errors.location} value={this.state.register_arena.location} handleInput={this.handleInput} name="location" placeholder="Location" />
                        
                        <Button isLoading={this.state.isSubmitting} onPress={this.submit} placeholder="Submit" style={{...styles.button,backgroundColor:colors.light_green,marginTop:20}}/>

                </ScrollView>
            </ImageBackground>
        )
    }
}

const styles=StyleSheet.create({
    
    title:{
        marginBottom:30,
        fontSize:30,
        color:colors.white
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