import React, { Component } from 'react'
import  { Text ,TouchableOpacity, View, ScrollView,StyleSheet,Image, ImageBackground, AsyncStorage, ActivityIndicator} from 'react-native'
import Button from '../reuseableComponents/button'
import { colors,api } from '../constants'
import {axios} from '../reuseableComponents/externalFunctions'
import Toast from 'react-native-easy-toast'
import {Field} from './signup'
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/Feather'
import ImagePicker from 'react-native-image-crop-picker';

export default class home extends Component {
    state={
        errors:{},
        profile:this.props.user,
    }
   
    changeImage = async () => {
        ImagePicker.openPicker({
            multiple: false,
            width: 500,
            height: 500,
          }).then(async(image) => {
              console.log(image)
            if (image.path) {
                    this.setState({isUploading:true})
                    var filename = image.path.split('/')
                    filename=filename[filename.length-1]
                    var blob = {
                        uri: image.path,
                        type: "image/*",
                        name: filename
                    }
                    let body= new FormData()
                    body.append("user[image]",blob)
                axios('patch',api.edit_profile,body,true)
                    .then(async({data})=>{
                        this.setState({isUploading:false})
                        if(data.error){
                            this.refs.toast.show(data.msg)
                            return
                        }
                        this.props.dispatch({type:"SET_USER",data:data.user})
                        this.setState({profile:data.user})
                    })
                    .catch(x=>{
                        this.setState({isUploading:false})
                        console.log(x)
                    })
                }
          })
        // const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
        // if (status != 'granted') {
        //     alert('Sorry, we need camera roll permissions change the picture!');
        //     return 
        // }
        // let result = await ImagePicker.launchImageLibraryAsync({
        //   mediaTypes: ImagePicker.MediaTypeOptions.All,
        //   allowsEditing: true,
        //   aspect: [4, 3],
        //   quality: 1,
        // });
    
        
        // 
    }
    handleInput=x=>{
        this.setState({profile:{...this.state.profile,[x.name]:x.val},errors:{...this.state.errors, [x.name]:false}})
    }
    validate = data=>{
        var error = false
        var arr = ["first_name","last_name","city","player_of"]
        arr.forEach(x=>{
            if(data[x]==null || data[x].length<=0){
                error=true
                this.state.errors[x] = true
                this.forceUpdate()
            }
        })
        return !error
    }
    update=()=>{
        this.setState({isSubmitting:true})
        if (!this.validate(this.state.profile)){
            this.setState({isSubmitting:false})
            this.refs.toast.show("Please fill the form to continue")
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
                    <TouchableOpacity disabled={this.state.isUploading} onPress={this.changeImage}>
                        <ImageBackground style={styles.profilePic} source={{uri:this.state.profile.image}}>
                            <View style={styles.overlay}>
                                {this.state.isUploading?
                                    <ActivityIndicator color={colors.white} size="large"/>
                                :   
                                    <Icon name="edit" color={colors.white} size={32}/>
                                }
                            </View>
                        </ImageBackground>
                    </TouchableOpacity>
                    <View style={{flexDirection:"row"}}>
                        <Field refs={r=>this.first_name=r} focusOn={()=>this.last_name} error={this.state.errors.first_name} value={this.state.profile.first_name} handleInput={this.handleInput} name="first_name" placeholder="First Name" style={{flex:1}}/>
                        <Field refs={r=>this.last_name=r} focusOn={()=>this.city} error={this.state.errors.last_name} value={this.state.profile.last_name} handleInput={this.handleInput} name="last_name" placeholder="Last Name" style={{flex:1}}/>
                    </View>
                    <Field refs={r=>this.city=r} error={this.state.errors.city} value={this.state.profile.city} handleInput={this.handleInput} name="city" placeholder="City" style={{marginTop:10,marginBottom:10}}/>
                    
                    <DropDownPicker
                        items={[
                            {label: 'Cricket', value: 'Cricket'},
                            {label: 'Football', value: 'Football'},
                            {label: 'Basket Ball', value: 'Basket Ball'},
                            {label: 'Badminton', value: 'Badminton'},
                            {label: 'Squash', value: 'Squash'},
                            {label: 'Swimming', value: 'Swimming'},
                            {label: 'Tennis', value: 'Tennis'},
                            {label: 'Table Tenis', value: 'Table Tennis'},
                        ]}
                        defaultValue={this.state.profile.player_of}
                        containerStyle={{height: 45}}
                        style={[this.state.errors.player_of&&{borderColor:colors.red},{borderTopLeftRadius: 0, borderTopRightRadius: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0}]}
                        itemStyle={{
                            justifyContent: 'flex-start',
                            elevation:4
                        }}
                       
                        labelStyle={[{color:colors.black},this.state.errors.player_of&&{color:colors.red}]}
                        dropDownStyle={{backgroundColor: '#fafafa',elevation:3}}
                        onChangeItem={item => this.setState({
                            profile:{...this.state.profile,player_of: item.value},
                            errors:{...this.state.errors, player_of:false}
                        })}
                    />
                    
                    <Button isLoading={this.state.isSubmitting} onPress={this.update} placeholder="Update" style={{...styles.button,backgroundColor:colors.light_green,marginTop:20}}/>
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