import React, { Component } from 'react'
import { Text, View ,StyleSheet,ImageBackground,Image} from 'react-native'
import Button from '../reuseableComponents/button'
import {colors} from '../constants'
import button from '../reuseableComponents/button'
import { ScrollView } from 'react-native-gesture-handler'
export default class authentication extends Component {
    render() {
        return (
                <ImageBackground style={styles.background} source={require('../images/authentication_back.png')}>
                    <ScrollView contentContainerStyle={styles.root}>
                        <Image style={styles.logo} source={require('../images/authentication_logo.png')}/>
                        <Button onPress={()=>this.props.navigation.navigate("sign_up")} placeholder="Sign Up" style={{...styles.button,backgroundColor:colors.light_green}}/>
                        <Button 
                            placeholder="Log In" 
                            onPress={()=>this.props.navigation.navigate("sign_in")}
                            style={{
                                    backgroundColor:colors.transparent_light_grey,
                                    borderColor:colors.white,
                                    borderWidth:2,
                                    ...styles.button
                                }}/>
                        <Button 
                            placeholder="Sign up with Google" 
                            placeholderStyle={{
                                fontWeight:"normal"
                            }}
                            style={{
                                    backgroundColor:colors.google_blue,
                                    ...styles.button
                                }}
                            iconLeft="google"    
                            />
                        <Button 
                            placeholder="Sign up with Facebook" 
                            placeholderStyle={{
                                fontWeight:"normal"
                            }}
                            style={{
                                    backgroundColor:colors.fb_blue,
                                    ...styles.button
                                }}
                            iconLeft="facebook"    
                            />
                    </ScrollView>
                </ImageBackground>

        )
    }
}
const styles=StyleSheet.create({

    logo:{
        aspectRatio:1753/1224,
        height:undefined,
        width:300,
        marginBottom:70,
        marginTop:30

    },
    root:{
        flex:1,
        justifyContent:"center",
        margin:30,
        alignItems:"center"
    },
    button:{
        marginBottom:10,width:"85%"
    },
    background:{
        resizeMode:"cover",
        width:"100%",
        height:"100%",
        justifyContent:"center",
        alignItems:"stretch",
    }
})