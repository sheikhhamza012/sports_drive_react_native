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
       vendor:{

       }
    }

    componentDidMount = ()=> {
        
    }
    handleInput=x=>{
        const field = x.name.split('-')
        if(field[0]=="arena_name"){
            if(!this.state.vendor['arena_name']){
                this.state.vendor['arena_name'] = []
            }
            this.state.vendor['arena_name'][field[1]] = x.val
            this.forceUpdate()
            return
        }
        this.setState({vendor:{...this.state.vendor,[x.name]:x.val},errors:{...this.state.errors, [x.name]:false}})
    }
    
    submit=()=>{
        // const {booking} = this.props
        // this.setState({isSubmitting:true})
        // const params={
        //     arena_booking_request:{
        //         from_time: moment(booking.date).format("YYYY-MM-DD ")+moment(booking.from_time).format("HH:mm"),
        //         to_time: moment(booking.date).format("YYYY-MM-DD ")+moment(booking.to_time).format("HH:mm")
        //     }
        // }
        // axios('post',api.book_arena(this.props.booking.arena_id),params,true)
        // .then(({data})=>{
        //     this.setState({isSubmitting:false})
        //     if(data.error){
        //         alert(data.msg)
        //         this.setState({showModal:true})
        //         return
        //     }
        //     this.props.navigation.navigate("booking_request_recieved")
        // })
        // .catch(e=>{
        //     this.setState({isSubmitting:false})
        //     console.log(e)
        // })
    }
    render() {
        console.log('')
        var arenas_fields = []
        for(var i=0;i<(this.state.vendor.no_of_arenas??0);i++){
            arenas_fields.push(
                <Field 
                    refs={r=>this.id_card=r}
                    focusOn={()=>this.no_of_arenas}
                    value={(this.state.vendor.arena_name?this.state.vendor.arena_name[i] : undefined)}
                    handleInput={this.handleInput} 
                    name={`arena_name-${i}`}
                    placeholder={`Name of Arena ${i+1}`}
                    placeholderColor={colors.grey}
                    fieldStyle={styles.fieldStyle}
                />
            )
        }
        return (
            <>
                <Toast 
                    ref="toast"
                    position='bottom'
                    positionValue={200}
                />
                <ScrollView contentContainerStyle={styles.root} refreshControl={<RefreshControl refreshing={this.state.isLoading}/>}>
                    <Field 
                        refs={r=>this.id_card=r}
                        focusOn={()=>this.no_of_arenas}
                        value={this.state.vendor.id_card}
                        handleInput={this.handleInput} 
                        name="id_card" 
                        placeholder="ID Card Number" 
                        placeholderColor={colors.black}
                        fieldStyle={styles.fieldStyle}
                        keyboardType="numeric"
                        />
                    
                    <Field 
                        refs={r=>this.no_of_arenas=r}
                        focusOn={this.submit}
                        value={this.state.vendor.no_of_arenas}
                        handleInput={this.handleInput} 
                        name="no_of_arenas" 
                        placeholder="Number of Arenas" 
                        placeholderColor={colors.black}
                        fieldStyle={styles.fieldStyle}
                        keyboardType="numeric"
                    />
                   {arenas_fields.length>0&&
                       <>
                        <View style={styles.header}>
                            <Text style={{fontSize:12}}>Name of Arenas</Text>
                        </View>
                       {arenas_fields}
                        </>}
                    <Button isLoading={this.state.isSubmitting} onPress={this.submit} iconRight="right" style={styles.button}/>

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