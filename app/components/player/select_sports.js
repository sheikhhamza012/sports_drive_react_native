import React, { Component } from 'react'
import  { Text, RefreshControl,TouchableOpacity,FlatList , View, ScrollView,StyleSheet,Image,TextInput, ImageBackground, ActivityIndicator, Platform, Dimensions} from 'react-native'
import Button from '../../reuseableComponents/button'
import { colors, api, global_styles } from '../../constants'
// import MapView from 'react-native-maps'
import {axios} from '../../reuseableComponents/externalFunctions'
import DatepickerRange,{SingleDatepicker} from '../../reuseableComponents/react-native-range-datepicker';
import moment from 'moment'
import { color } from 'react-native-reanimated'
import DateTimePicker from '@react-native-community/datetimepicker';
import Toast from 'react-native-easy-toast'
import Rating from 'react-native-star-rating'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {Field} from '../signup'
import Icon from 'react-native-vector-icons/AntDesign'

export default class SportsMenu extends Component {
    state={
        isLoading:false,
        error:{

        }
    }

    componentDidMount = ()=> {
        
    }
    handleInput=x=>{
        const {become_a_vendor} = this.props
        let checkedGames = become_a_vendor.checkedGames
        let index = checkedGames.findIndex(i=>i.name==x.name)
        if(index>=0){
            if(x.subname){
                i=checkedGames[index].subname.findIndex(k=>k==x.subname)
                if(i>=0){
                    if(checkedGames[index].subname.length>1){
                        checkedGames[index].subname.splice(i,1)
                    }else{
                        checkedGames.splice(index,1)        
                    }
                }else{
                    checkedGames[index].subname.push(x.subname)
                }
            }else{

                checkedGames.splice(index,1)
            }
        }else{
            if(x.subname){
                checkedGames.push({name: x.name,subname:[x.subname],place:x.place})
            }else{
                checkedGames.push(x)
            }
        }
        this.props.dispatch({type:"SET_VALUE", screen:"become_a_vendor",key:'checkedGames',data:checkedGames})
        this.setState({error:{...this.state.error,[x.name]:false}})
    }
    
    next=()=>{
        const {become_a_vendor} = this.props
        let {checkedGames} = become_a_vendor
        if(this.props.become_a_vendor.checkedGames.length<=0){
            this.refs.toast.show("Please select at least one sport")
            return
        }
        // checkedGames = checkedGames.reduce((arr,x)=>{
        //     if(!x.group){
        //         arr.push(x)
        //     }
        //     if(arr.filter(i=>i.name==i.group).length==0){
        //         x.name = x.group
        //         arr.push(x)
        //     }
        //     return arr
        // },[])
        this.props.dispatch({type:"SET_VALUE", screen:"become_a_vendor",key:'game_index',data:0})
        this.props.navigation.navigate("arena_info")
    }
    render() {
        console.log(JSON.stringify(this.props.become_a_vendor))
        return (
            <>
                <Toast 
                    ref="toast"
                    position='bottom'
                    positionValue={350}
                    
                />
                <ScrollView contentContainerStyle={[styles.root,global_styles.headerPadding]} refreshControl={<RefreshControl refreshing={this.state.isLoading}/>}>
                    <Text style={{fontWeight:"bold"}}>Select Offered Sports</Text>
                    <Text style={{marginVertical:10,fontWeight:"bold",fontSize:12}}>Outdoor Sports</Text>

                    <CheckBox name="Outdoor" subname="Cricket" place="ground" handleInput={this.handleInput} text="Cricket" checked={this.props.become_a_vendor.checkedGames} value="Outdoor"/>
                    <CheckBox name="Outdoor" subname="Football" place="ground" handleInput={this.handleInput} text="Football" checked={ this.props.become_a_vendor.checkedGames} value="Outdoor"/>
                    <CheckBox name="Outdoor" subname="DodgeBall" place="ground" handleInput={this.handleInput} text="DodgeBall" checked={this.props.become_a_vendor.checkedGames} value="Outdoor"/>
                    
                    <Text style={{marginVertical:10,fontWeight:"bold",fontSize:12}}>Indoor Sports</Text>
                    
                    <CheckBox name="BasketBall" place="court" handleInput={this.handleInput} text="BasketBall" checked={this.props.become_a_vendor.checkedGames} value="BasketBall"/>
                    <CheckBox name="VolleyBall" place="court" handleInput={this.handleInput} text="VolleyBall" checked={ this.props.become_a_vendor.checkedGames} value="VolleyBall"/>
                    <CheckBox name="Tennis" place="court" handleInput={this.handleInput} text="Tennis" checked={this.props.become_a_vendor.checkedGames} value="Tennis"/>
                    <CheckBox name="Badminton" place="court" handleInput={this.handleInput} text="Badminton" checked={this.props.become_a_vendor.checkedGames} value="Badminton"/>
                    <CheckBox name="Table Tennis" place="table" handleInput={this.handleInput} text="Table Tennis" checked={this.props.become_a_vendor.checkedGames} value="Table Tennis"/>
                    <CheckBox name="Squash" place="table" handleInput={this.handleInput} text="Squash" checked={this.props.become_a_vendor.checkedGames} value="Squash"/>
                    <CheckBox name="Gym" place="hall" handleInput={this.handleInput} text="Gym" checked={this.props.become_a_vendor.checkedGames} value="Gym"/>
                    <CheckBox name="Snooker" place="table" handleInput={this.handleInput} text="Snooker" checked={this.props.become_a_vendor.checkedGames} value="Snooker"/>
                    <CheckBox name="Swimming" place="pool" handleInput={this.handleInput} text="Swimming" checked={this.props.become_a_vendor.checkedGames} value="Swimming"/>
                    
                    <Button isLoading={this.state.isSubmitting} onPress={this.next} iconRight="right" style={styles.button}/>



                </ScrollView>
            </>
        )
    }
}
export class CheckBox extends Component {
    state = { 
        isChecked:this.props.isChecked
    }
    onPress=()=>{
        // this.setState({isChecked:!this.state.isChecked},
        this.props.handleInput({name:this.props.name,place:this.props.place,subname:this.props.subname})
    }
    render() {
        var checked=false 
        if(this.props.subname){
            checked = (this.props.checked??[]).find(x=>x.name==this.props.name)
            checked = checked?.subname?.includes(this.props.subname)
        }else{
            checked =(this.props.checked??[]).filter(x=>x.name==this.props.value).length>0
        }
        return (
            <TouchableOpacity onPress={this.onPress} style={[styles.checkbox_container,checked&&{backgroundColor:colors.blue}]}>
               {checked&&<Icon name= "check" color={checked?colors.white : colors.grey} size={22}/>}
                <Text style={[styles.checkbox_label,checked&&{color:colors.white,fontWeight:"bold"}]}>{this.props.text}</Text>
            </TouchableOpacity>
          );
    }
}


const styles=StyleSheet.create({
    checkbox_container:{
        borderRadius:5,
        flexDirection:"row",
        alignItems:"center",
        padding:10,
        marginBottom:3
    },
    title:{
        color:colors.grey,
        fontSize:16
    },
    button:{marginTop:40,width:40,paddingRight:6,alignSelf:"flex-end",borderRadius:10,backgroundColor:colors.blue},
    fieldStyle:{color:colors.black,fontSize:14},
    header:{
        backgroundColor:colors.light_grey3,
        paddingHorizontal:10,
        paddingVertical:5,
        marginVertical:10,
        marginBottom:40
    },
    root:{
        flexGrow:1,
        padding:30,
        paddingTop:40,
        // paddingHorizontal:30,
        alignItems:"stretch",
    },   
    
    arenaButton:{borderRadius:4,height:25,marginTop:5,width:70,backgroundColor:colors.blue,alignSelf:"center"}
})