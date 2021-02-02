import React, { Component } from 'react'
import { Text, View , StyleSheet, ImageBackground, ScrollView} from 'react-native'
import {colors} from '../../../constants'
import {Field} from '../../signup'


export default class index extends Component {
    state={errors:{},profile:{}}
    
    render() {
        return (
            <ImageBackground style={styles.background} source={require('../../../images/app_background.png')}>
                <ScrollView style={{marginTop:130}} contentContainerStyle={styles.root}>
                    <Text style={styles.title}>Make Your Own Team</Text>
                    <Field refs={r=>this.first_name=r} focusOn={()=>this.last_name} error={this.state.errors.first_name} value={this.state.profile.first_name} handleInput={this.handleInput} name="first_name" placeholder="First Name" />
                    <Field refs={r=>this.first_name=r} focusOn={()=>this.last_name} error={this.state.errors.first_name} value={this.state.profile.first_name} handleInput={this.handleInput} name="first_name" placeholder="First Name" />
                </ScrollView>

            </ImageBackground>
        )
    }
}
const styles=StyleSheet.create({
    title:{
        fontSize:24,
        color: colors.white
    },
    button_placeholder:{
        fontSize:14,
        fontWeight:"bold",
        color:colors.white
    },
    button:{
        marginBottom:20,
        borderColor:colors.white,
        borderWidth:2,
        backgroundColor:colors.blue
    },
    sports_logo:{
        height:100,
        width:100,
        resizeMode:"cover",
        
    },
    root:{
        flexGrow:1,
        paddingVertical:0,
        paddingHorizontal:20,
        alignItems:"stretch"
    },
   
    background:{
        resizeMode:"cover",
        width:"100%",
        height:"100%",
        justifyContent:"center",
        alignItems:"stretch",
    }
})