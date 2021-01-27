import React, { Component } from 'react'
import { Text, View,ScrollView,StyleSheet } from 'react-native'
import DatepickerRange,{SingleDatepicker} from 'react-native-range-datepicker';
import moment from 'moment'
import {colors,api, global_styles} from '../../../constants'
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import Button from '../../../reuseableComponents/button'

export default class calendar extends Component {
    render() {
        return (
            <ScrollView style={[{backgroundColor:colors.white},global_styles.headerPadding]} contentContainerStyle={styles.root}>
               <Calendar
                    current={moment().toDate()}
                    onDayPress={(day) => this.props.dispatch({type:"SET_VALUE",screen:"booking_calendar",key:'selectedDate',data:day.dateString})}
                    enableSwipeMonths={true}
                    markedDates={{
                        [this.props.booking_calendar.selectedDate]: {selected: true, selectedColor: colors.blue},
                    }}
                />
                <View style={{flex:0.9}}/>
                <Button onPress={()=>{
                        if(!this.props.booking_calendar.selectedDate){
                            return this.refs.toast.show("Please Select a date first")
                        }
                        this.props.navigation.navigate("booking_slots",{title:this.props.route.params.subtitle})
                    }}
                    placeholder="Confirm"
                    style={styles.arenaButton}
                />

            </ScrollView>
        )
    }
}
const styles=StyleSheet.create({
    root:{
        padding:20,
        flexDirection:"column",
        flex:1,
    },
    arenaButton:{
        width:"100%",
        borderRadius:10,
        height:45,
        marginTop:5,
        backgroundColor:colors.blue,
        alignSelf:"center",
        
    }

})