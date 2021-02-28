import React, { Component } from 'react'
import  { Text , View, ScrollView,StyleSheet,Image, ImageBackground} from 'react-native'
import Button from '../../reuseableComponents/button'
import { colors } from '../../constants'
import { TouchableOpacity } from 'react-native-gesture-handler'
export default class SportsMenu extends Component {
    render() {
        return (
            <ImageBackground style={styles.background} source={require('../../images/app_background.png')}>
                <ScrollView style={{marginTop:130}} contentContainerStyle={styles.root}>
                    <Image style={styles.sports_logo} source={require('../../images/Sports-01.png')}/>
                    <Text style={[styles.button_placeholder,{marginBottom:30,marginTop:-10}]}>Cricket</Text>
                    <Button 
                        onPress={()=>this.props.navigation.navigate("booking_search")}
                        placeholder="Book Now" 
                        placeholderStyle={styles.button_placeholder}
                        style={styles.button}
                    />
                    <Button 
                        placeholder="Challenge On Opponent" 
                        placeholderStyle={styles.button_placeholder}
                        style={styles.button}
                    />
                    <Button 
                        placeholder="Join A Friend's Team" 
                        placeholderStyle={styles.button_placeholder}
                        style={styles.button}
                        onPress={()=>this.props.navigation.navigate("join_friends_team")}
                    />
                    <Button 
                        placeholder="Make Your Own Team" 
                        onPress={()=>this.props.navigation.navigate("create_team")}
                        placeholderStyle={styles.button_placeholder}
                        style={styles.button}
                    />
                    <Button 
                        placeholder="Play As An Individual Player" 
                        placeholderStyle={styles.button_placeholder}
                        style={styles.button}
                    />
                   
                </ScrollView>
            </ImageBackground>
        )
    }
}


const styles=StyleSheet.create({
   
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
        paddingVertical:5,
        paddingHorizontal:50,
        alignItems:"center"
    },
   
    background:{
        resizeMode:"cover",
        width:"100%",
        height:"100%",
        justifyContent:"center",
        alignItems:"stretch",
    }
})