import React, { Component } from 'react'
import  { Text, RefreshControl,TouchableOpacity,FlatList , View, ScrollView,StyleSheet,Image,TextInput, ImageBackground, ActivityIndicator, Platform, Dimensions} from 'react-native'
import Button from '../../reuseableComponents/button'
import { colors, api,global_styles } from '../../constants'
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
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete'

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
        this.props.dispatch({type:"SET_VALUE", screen:"become_a_vendor",key:x.name,data:x.val})
        this.setState({error:{...this.state.error,[x.name]:false}})
    }
    
    next=()=>{
        const {become_a_vendor} = this.props
        console.log(become_a_vendor)
        if( (become_a_vendor.id_card?.length??0)<13 || !become_a_vendor.location || (become_a_vendor.name_of_arena?.length??0) <=0 ){
            var msg = "" 
            msg += (become_a_vendor.id_card?.length??0) < 13 ? "ID card number can not be less than 13 digits," :""
            msg += (become_a_vendor.name_of_arena?.length??0) <=0 ? "Name of arena is missing," : ""
            msg += !become_a_vendor.location ? "Please select a valid location" : ""
            this.state.error['id_card'] = (become_a_vendor.id_card?.length??0) < 13
            this.state.error['name_of_arena'] = (become_a_vendor.name_of_arena?.length??0)<=0
            this.state.error['location'] = !become_a_vendor.location
            this.forceUpdate()
            this.refs.toast.show(msg) 
            return
        }
        this.props.dispatch({type:"SET_VALUE", screen:"become_a_vendor",key:'game_index',data:0})
        this.props.navigation.navigate("select_sports")
    }
    render() {
        console.log(this.props.become_a_vendor)
        return (
            <>
                <Toast 
                    ref="toast"
                    position='bottom'
                    positionValue={350}
                    
                />
                <ScrollView keyboardShouldPersistTaps='always' listViewDisplayed={false} contentContainerStyle={[styles.root,global_styles.headerPadding]} refreshControl={<RefreshControl refreshing={this.state.isLoading}/>}>
                    
                    <Field 
                        error={this.state.error.id_card}
                        refs={r=>this.id_card=r}
                        focusOn={()=>this.name_of_arena}
                        value={this.props.become_a_vendor.id_card}
                        handleInput={this.handleInput} 
                        name="id_card" 
                        placeholder="ID Card Number" 
                        placeholderColor={colors.black}
                        fieldStyle={styles.fieldStyle}
                        keyboardType="numeric"
                        />
                    
                    <Field 
                        error={this.state.error.name_of_arena}
                        refs={r=>this.name_of_arena=r}
                        focusOn={this.next}
                        value={this.props.become_a_vendor.name_of_arena}
                        handleInput={this.handleInput} 
                        name="name_of_arena" 
                        placeholder="Name of Arenas" 
                        placeholderColor={colors.black}
                        fieldStyle={styles.fieldStyle}
                    />
                  <View style={{elevation:4,}}>
                        <GooglePlacesAutocomplete
                            enableHighAccuracyLocation={true}
                            isRowScrollable={true}
                            textInputProps={{
                                clearButtonMode:"never",
                                ref:x=>this.location=x,
                                autoCorrect:false,
                                onChangeText:()=>this.setState({error:{...this.state.error, location:false}}),
                                placeholderTextColor:this.state.error.location ? colors.red : colors.black,
                                style:{
                                    fontSize:14,
                                    flex:1,
                                    paddingVertical:10,
                                    borderBottomWidth:1,
                                    borderColor:this.state.error.location ? colors.red : colors.grey,
                                    color:this.state.error.location ? colors.red : colors.black
                                }
                            }}
                            styles={{
                                row:{
                                    width:300
                                },
                                listView:{
                                    backgroundColor:colors.white,
                                   
                                  
                                }
                            }}
                            placeholder={this.props.become_a_vendor.location?.address||'Location (Google Maps)'}
                            onPress={(data, details = null) => {
                                console.log(this.props)
                                this.handleInput({name:"location",val:{coordinates : details.geometry.location, address: details.formatted_address, name:details.name,url:details.url}})
                            }}
                            enablePoweredByContainer={false}
                            onFail={(e)=>console.log(e)}
                            fetchDetails={true}
                            query={{
                                key: 'AIzaSyBlb7z61wNtAdvz91KXrLDSEaaNo4jQx_8',
                                language: 'en',
                            }}
                        />
                    </View>
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
        paddingTop:140,
        // paddingHorizontal:30,
        alignItems:"stretch",
    },   
    
    arenaButton:{borderRadius:4,height:25,marginTop:5,width:70,backgroundColor:colors.blue,alignSelf:"center"}
})