import React, { Component } from 'react'
import  { Text,TextInput,KeyboardAvoidingView ,TouchableOpacity, View, ScrollView,StyleSheet,Image, ImageBackground, AsyncStorage, RefreshControl} from 'react-native'
import Button from '../../../reuseableComponents/button'
import { colors,api } from '../../../constants'
import {axios} from '../../../reuseableComponents/externalFunctions'
import Toast from 'react-native-easy-toast'
import {Field} from '../../signup'
import DropDownPicker from 'react-native-dropdown-picker';
import {Menu, Button as B , Provider, ActivityIndicator} from 'react-native-paper'
import ImagePicker from 'react-native-image-crop-picker';

export default class home extends Component {
    state={
        errors:{},
        create_team:{
            name: "",
            category: "",
            no_of_players: "",
            city: "",
            image: {},
            description:""
        },
    }
    handleInput=x=>{
        this.setState({create_team:{...this.state.create_team,[x.name]:x.val},errors:{...this.state.errors, [x.name]:false}})
    }
    componentDidMount=()=>{
        this.setState({isFetching:true})
        axios('get',api.get_teams,null,true)
        .then(async({data})=>{
            this.setState({isFetching:false})
            if(data.error){
                this.refs.toast.show(data.msg)
                return
            }

            this.props.dispatch({type:"SET_SCREEN", key:"teams", data:data.teams})
            if(data.teams.length>0){
                this.props.navigation.navigate("create_team")
            }
        })
        .catch(x=>{
            this.setState({isFetching:false})
            console.log(x)
        })
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
        ImagePicker.openPicker({
            multiple: false,
            width: 500,
            height: 500,
          }).then(async(image) => {
            if (image.path) {
                    var filename = image.path.split('/')
                    filename=filename[filename.length-1]
                    var blob = {
                        uri: image.path,
                        type: "image/*",
                        name: filename
                    }
                    console.log(blob)
                    this.setState({create_team:{...this.state.create_team, image:blob}})
                }
          })
        
    }
    submit=()=>{
        const {create_team} = this.state
        // console.log(create_team)
        this.setState({isSubmitting:true})
        axios('post',api.create_team,{team:create_team},true)
        .then(async({data})=>{
            this.setState({isSubmitting:false})
            if(data.error){
                this.refs.toast.show(data.msg)
                return
            }
            
            // this.setState({create_team:{image:{}}})
            this.componentDidMount()
            // this.props.navigation.navigate("invite_to_team",{team_id:data.team.id})
        })
        .catch(x=>{
            this.setState({isSubmitting:false})
            console.log(x)
        })
    }
    FieldWithLabel = (props)=>{
        return(
            <>
                <Text style={{color:colors.white,marginTop:10}}>{ props.placeholder}</Text>
                <Field style={{marginVertical:10}} fieldStyle={{backgroundColor:colors.white,color:colors.black,paddingHorizontal:10}} {...props} placeholder="" />
            </>
        )
    }
    render() {
        console.log(this.props.teams[0]?.invite_tokens)
        return (
            <ImageBackground style={styles.background} source={require('../../../images/app_background.png')}>
                <Toast 
                    ref="toast"
                    position='bottom'
                    positionValue={200}
                />
                <ScrollView refreshControl={<RefreshControl refreshing={this.state.isFetching} onRefresh={this.componentDidMount}/>} style={{marginTop:130}} contentContainerStyle={styles.root}>
                        <Text style={styles.title}>Make Your Own Team</Text>
                        <this.FieldWithLabel 
                            refs={r=>this.name=r}
                            error={this.state.errors.name} 
                            value={this.state.create_team.name} 
                            handleInput={this.handleInput} 
                            name="name" 
                            placeholder="Enter Your Team Name"
                        />
                        <>
                            <Text style={{color:colors.white,marginBottom:10}}>{ "Choose Category"}</Text>
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
                                defaultValue={this.state.create_team.category}
                                containerStyle={{height: 45,marginBottom:10}}
                                style={[this.state.errors.category&&{borderColor:colors.red},{borderTopLeftRadius: 0,elevation:10, borderTopRightRadius: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0}]}
                                itemStyle={{
                                    justifyContent: 'flex-start',
                                }}
                            
                                labelStyle={[{color:colors.black},this.state.errors.category&&{color:colors.red}]}
                                dropDownStyle={{backgroundColor: '#fafafa',elevation:3}}
                                onChangeItem={item => this.setState({
                                    create_team:{...this.state.create_team,category: item.value},
                                    errors:{...this.state.errors, category:false}
                                })}
                            />
                            

                        </>
                        <this.FieldWithLabel  focusOn={()=>this.city} error={this.state.errors.no_of_players} value={this.state.create_team.no_of_players} handleInput={this.handleInput} keyboardType={"numeric"} name="no_of_players" placeholder="Player Count" />
                        <this.FieldWithLabel refs={r=>this.city=r}  error={this.state.errors.city} value={this.state.create_team.city} handleInput={this.handleInput} name="city" placeholder="Choose City" />
                        <>
                            <Text style={{color:colors.white,marginBottom:10}}>{ "Upload Image of Team"}</Text>
                            <View style={{flexDirection:"row"}}>
                                <this.FieldWithLabel error={this.state.errors.image} value={this.state.create_team.image.uri} editable={false} style={{flex:1}}/>
                                <Button placeholder="Select Image" onPress={this.selectImage} style={{borderRadius:0,width:100,backgroundColor:colors.light_green,height:45}} placeholderStyle={{fontSize:11}}/>
                            </View>
                        </>
                        <this.FieldWithLabel multiline={5} error={this.state.errors.description} value={this.state.create_team.description} handleInput={this.handleInput} name="description" placeholder="Describe your team" style={{marginBottom:10}}/>
                        
                        <Button isLoading={this.state.isSubmitting} onPress={this.submit} placeholder="Submit" style={{...styles.button,backgroundColor:colors.light_green,marginTop:20,elevation:0}}/>

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