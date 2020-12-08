import React, { Component } from 'react'
import  { Text, RefreshControl,TouchableOpacity,FlatList , View, ScrollView,StyleSheet,Image,TextInput, ImageBackground, ActivityIndicator, Platform, Dimensions} from 'react-native'
import Button from '../../reuseableComponents/button'
import { colors, api } from '../../constants'
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
export default class SportsMenu extends Component {
    state={
        isLoading:false,
        error:{

        }
    }

    componentDidMount = ()=> {
        
    }
    handleInput=x=>{
        this.setState({error:{...this.state.error, [x.name]:false}})
        this.props.dispatch({type:"SET_VALUE", screen:"become_a_vendor",key:x.name,data:x.val})
    }
    
    next=()=>{
        const {become_a_vendor} = this.props
        if( become_a_vendor.id_card?.length < 13  || become_a_vendor.no_of_arenas <=0 ){
            var msg = "" 
            msg += become_a_vendor.id_card?.length < 13 && "ID card number can not be less than 13 digits,"
            msg += become_a_vendor.no_of_arenas <=0 && "Number of arenas are invalid"
            this.state.error['id_card'] = become_a_vendor.id_card?.length < 13
            this.state.error['no_of_arenas'] = become_a_vendor.no_of_arenas <=0
            this.forceUpdate()
            this.refs.toast.show(msg) 
            return
        }
        this.props.navigation.navigate("arena_info")
    }
    render() {
        
        return (
            <>
                <Toast 
                    ref="toast"
                    position='bottom'
                    positionValue={200}
                />
                <ScrollView contentContainerStyle={styles.root} refreshControl={<RefreshControl refreshing={this.state.isLoading}/>}>
                    <Field 
                        error={this.state.error.id_card}
                        refs={r=>this.id_card=r}
                        focusOn={()=>this.no_of_arenas}
                        value={this.props.become_a_vendor.id_card}
                        handleInput={this.handleInput} 
                        name="id_card" 
                        placeholder="ID Card Number" 
                        placeholderColor={colors.black}
                        fieldStyle={styles.fieldStyle}
                        keyboardType="numeric"
                        />
                    
                    <Field 
                        error={this.state.error.no_of_arenas}
                        refs={r=>this.no_of_arenas=r}
                        focusOn={this.submit}
                        value={this.props.become_a_vendor.no_of_arenas}
                        handleInput={this.handleInput} 
                        name="no_of_arenas" 
                        placeholder="Number of Arenas" 
                        placeholderColor={colors.black}
                        fieldStyle={styles.fieldStyle}
                        keyboardType="numeric"
                    />
                  
                    <Button isLoading={this.state.isSubmitting} onPress={this.next} iconRight="right" style={styles.button}/>

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