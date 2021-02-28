import React, { Component } from 'react'
import  { Text,Share,TextInput,KeyboardAvoidingView ,TouchableOpacity, View, ScrollView,StyleSheet,Image, ImageBackground, AsyncStorage, RefreshControl} from 'react-native'
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
        
    }
    componentDidMount() {
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
    
    handleInput=x=>{
        this.setState({create_team:{...this.state.create_team,[x.name]:x.val},errors:{...this.state.errors, [x.name]:false}})
    }
    share=async (token) => {
        try {
          const result = await Share.share({
            message:`sportsdrive:teams/?token=${token}`
          });
        } catch (error) {
          alert(error.message);
        }
    }
    FieldWithLabel = (props)=>{
        return(
            <>
                <Text style={{color:colors.white,marginTop:10}}>{ props.label}</Text>
                <View style={{flexDirection:"row",alignItems:"center"}}>
                    <Field style={{marginVertical:10, width:"100%"}} fieldStyle={{borderRadius:5,backgroundColor:colors.white,color:colors.black,paddingHorizontal:10}} {...props} />
                    <Button disabled={!props.token} placeholder="Share Link" onPress={()=>this.share(props.token)} style={{borderRadius:0,right:5,width:100,backgroundColor:colors.light_green,height:35,position:"absolute",opacity:!props.token?0.4:1}} placeholderStyle={{fontSize:11}}/>

                </View>
            </>
        )
    }
    render() {
        const team = this.props.teams[0]
        return (
            <ImageBackground style={styles.background} source={require('../../../images/app_background.png')}>
                <Toast 
                    ref="toast"
                    position='bottom'
                    positionValue={200}
                />
                <ScrollView refreshControl={<RefreshControl refreshing={this.state.isFetching} onRefresh={this.componentDidMount}/>} style={{marginTop:130}} contentContainerStyle={styles.root}>
                        <Text style={[styles.title,{color:colors.blue,fontWeight:"bold"}]}>Congratulations!</Text>
                        <Text style={styles.title}>Your Team Is Registered</Text>
                        
                        <Text style={{color:colors.white,fontSize:18, marginTop:10}}>Captain Info</Text>
                        <View style={{backgroundColor:colors.white,borderRadius:10,padding:10, marginVertical:10, alignItems:"center"}}>
                            <Text style={{fontSize:18, fontWeight:"bold"}}>{team.captain.first_name} {team.captain.last_name}</Text>
                            <Text style={{color:colors.blue,fontSize:18}}>Age: <Text style={{color:colors.black}}>{"N/A"}</Text></Text>
                            <Text style={{color:colors.blue,fontSize:18}}>Category: <Text style={{color:colors.black}}>{team.category}</Text></Text>
                            <Text style={{color:colors.blue,fontSize:18}}>Team Name: <Text style={{color:colors.black}}>{team.name}</Text></Text>
                            <Text style={{color:colors.blue,fontSize:18}}>Team Id: <Text style={{color:colors.black}}>{team.id}</Text></Text>
                        </View>
                        {(this.props.teams[0]??{}).invite_tokens.map((x,i)=>
                            <>
                                <this.FieldWithLabel 
                                    value={x.assigned?x.username :""}
                                    refs={r=>this.name=r}
                                    handleInput={this.handleInput} 
                                    name="name" 
                                    label={`Player ${i+1}`}
                                    placeholder={`Player ${i+1} name`}
                                    editable={false}
                                    token={x.token}
                                
                                />
                            </>
                        )}
                        
                </ScrollView>
            </ImageBackground>
        )
    }
}

const styles=StyleSheet.create({
    
    title:{
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