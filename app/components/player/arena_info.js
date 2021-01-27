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
// import nav from '@react-native-community/geolocation'
navigator.geolocation = require('@react-native-community/geolocation')
export default class SportsMenu extends Component {

    state={
        game_index:this.props.become_a_vendor.game_index,
        isSubmitting:false,
        error : false,
        
    }
    
    componentDidMount = ()=> {
        const { become_a_vendor } =this.props
        let game = this.props.become_a_vendor.checkedGames[become_a_vendor.game_index]
        this.props.navigation.setParams({title: `Become A Vendor` ,subtitle:game.name})
    }
    handleInput=x=>{
        if(this.state.error){
            this.setState({error:false})
        }
        const {become_a_vendor} = this.props
        let games = become_a_vendor.checkedGames
        games[this.state.game_index] = {...games[this.state.game_index],[x.name]:x.val}
        this.props.dispatch({type:"SET_VALUE",screen:"become_a_vendor",key:"checkedGames",data:games})
    }
    
    submit=()=>{
        const {become_a_vendor} = this.props
        let game = become_a_vendor.checkedGames[this.state.game_index]
        if(!game.capacity){
            this.setState({error:true})
            this.refs.toast.show("Please add the capacity before moving to next step")
            return
        }
        this.setState({isSubmitting:true})
        const params={
            "groups": become_a_vendor.checkedGames, 
            "id_card": become_a_vendor.id_card, 
            "location": become_a_vendor.location, 
            "name_of_arena": become_a_vendor.name_of_arena
        }
        axios('post',api.become_a_vendor,params,true)
        .then(({data})=>{
            this.setState({isSubmitting:false,game_index:0})
            if(data.error){
                this.refs.toast.show(data.msg)
                return
            }
            this.props.dispatch({type:"SET_USER",data:data.user})
            this.props.dispatch({type:"RESET_FORMS"})
            this.props.navigation.navigate("become_a_vendor")
        })
        .catch(e=>{
            this.setState({isSubmitting:false})
            console.log(e)
        })
    }
    next=()=>{
        const {become_a_vendor} = this.props
        let game = become_a_vendor.checkedGames[this.state.game_index]
        if(!game.capacity){
            this.setState({error:true})
            this.refs.toast.show("Please add the capacity before moving to next step")
            return
        }
        // let games = become_a_vendor.checkedGames
        // this.props.dispatch({type:"SET_VALUE",screen:"become_a_vendor",key:"checkedGames",data:games})
        this.props.dispatch({type:"SET_VALUE",screen:"become_a_vendor",key:"game_index",data:this.state.game_index+1})
        this.props.navigation.push("arena_info")
        
    }
    render() {
        const place = ((this.props.become_a_vendor.checkedGames[this.state.game_index]??{}).place??"ground")
        const str = place[0].toUpperCase()+place.substring(1)+"s"
        return (
            <>
                <Toast 
                    ref="toast"
                    position='bottom'
                    positionValue={200}
                />
                <ScrollView keyboardShouldPersistTaps='always' listViewDisplayed={false} contentContainerStyle={[styles.root,global_styles.headerPadding]} refreshControl={<RefreshControl refreshing={this.state.isLoading}/>}>
                   
                    

                    {/* <Field 
                        refs={r=>this.location=r}
                        focusOn={this.submit}
                        value={this.props.become_a_vendor.arenas[this.props.become_a_vendor.arena_index].location}
                        handleInput={this.handleInput} 
                        name="location" 
                        placeholder="Location (Google Maps)" 
                        placeholderColor={colors.black}
                        fieldStyle={styles.fieldStyle}
                    /> */}

                    <Field 
                        error={this.state.error}
                        refs={r=>this.capacity=r}
                        onSubmitEditing={this.state.game_index+1 == this.props.become_a_vendor.checkedGames.length? this.submit : this.next}
                        value={(this.props.become_a_vendor.checkedGames[this.state.game_index]??{}).capacity}
                        handleInput={this.handleInput} 
                        name="capacity" 
                        placeholder={`Number Of ${str}`}
                        placeholderColor={colors.black}
                        fieldStyle={styles.fieldStyle}
                        keyboardType="numeric"
                    />
                   {this.state.game_index+1 == this.props.become_a_vendor.checkedGames.length?
                        
                        <Button isLoading={this.state.isSubmitting} onPress={this.submit} placeholder="Submit" style={[styles.button,{width:"100%"}]}/>
                        :
                        <Button isLoading={this.state.isSubmitting} onPress={this.next} iconRight="right" style={styles.button}/>
                    
                    }

                </ScrollView>
                
            </>
        )
    }
}



const styles=StyleSheet.create({
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