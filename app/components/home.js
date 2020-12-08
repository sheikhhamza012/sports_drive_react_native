import React, { Component } from 'react'
import  { Text ,TouchableOpacity, View, ScrollView,StyleSheet,Image, ImageBackground} from 'react-native'
import Button from '../reuseableComponents/button'
import { colors } from '../constants'
export default class home extends Component {
    open_sports_menu=(sports)=>{
        this.props.dispatch({type:"SELECT_SPORTS",data:sports})
        this.props.navigation.navigate("sports_menu")
    }
    render() {
        return (
            <ImageBackground style={styles.background} source={require('../images/app_background.png')}>
                <ScrollView style={{marginTop:130}} contentContainerStyle={styles.root}>
                    <Image style={styles.cover} source={require('../images/home_cover.png')}/>
                    <Button 
                        placeholder="MAIN FEATURES" 
                        placeholderStyle={{
                            fontSize:12,
                            fontWeight:"bold"
                        }}
                        style={{
                            width:140,
                            height:35,
                            margin:20,
                            alignSelf:"center",
                            borderColor:colors.white,
                            borderWidth:2,
                            backgroundColor:'rgba(5,54,122,255)'
                        }}
                    />
                    <View style={styles.row}>
                        <MenuButton onPress={()=>this.open_sports_menu("Cricket")} placeholder="Cricket" imageStyle={{marginLeft:10,marginBottom:7}} source={require('../images/Sports-01.png')}/>
                        <MenuButton onPress={()=>this.props.navigation.navigate("sports_menu")} placeholder="Football" imageStyle={{marginLeft:3,marginBottom:7}} source={require('../images/Sports-02.png')}/>
                        <MenuButton onPress={()=>this.props.navigation.navigate("sports_menu")} placeholder="Basketball" imageStyle={{marginLeft:2,marginBottom:7}} source={require('../images/Sports-03.png')}/>
                        <MenuButton onPress={()=>this.props.navigation.navigate("sports_menu")} placeholder="Badminton" imageStyle={{marginLeft:6,marginBottom:7}} source={require('../images/Sports-04.png')}/>
                    </View>
                    <View style={styles.row}>
                        <MenuButton onPress={()=>this.props.navigation.navigate("sports_menu")} placeholder="Squash" imageStyle={{marginLeft:0,marginBottom:7}} source={require('../images/Sports-05.png')}/>
                        <MenuButton onPress={()=>this.props.navigation.navigate("sports_menu")} placeholder="Swimming" imageStyle={{marginLeft:0,marginBottom:7}} source={require('../images/Sports-06.png')}/>
                        <MenuButton onPress={()=>this.props.navigation.navigate("sports_menu")} placeholder="Table Tennis" imageStyle={{marginLeft:2,marginBottom:7}} source={require('../images/Sports-07.png')}/>
                        <MenuButton onPress={()=>this.props.navigation.navigate("sports_menu")} placeholder="Tennis" imageStyle={{marginLeft:3,marginBottom:7}} source={require('../images/Sports-08.png')}/>
                    </View>
                </ScrollView>
            </ImageBackground>
        )
    }
}

class MenuButton extends Component {
    render() {
        return (
            <TouchableOpacity onPress={this.props.onPress} style={{alignItems:"center"}}>
                <ImageBackground style={[styles.badge_background,this.props.style]} source={require('../images/home_button_back_badge.png')}>
                    <Image source={this.props.source} style={[styles.badge_image,this.props.imageStyle]}/>
                </ImageBackground>
                <Text style={styles.badge_placeholder} >{this.props.placeholder}</Text>
            </TouchableOpacity>
        )
    }
}


const styles=StyleSheet.create({
    badge_background:{
        // aspectRatio:1200/1201,
        height:80,
        width:100,
        alignItems:"center",
        justifyContent:"center",
        resizeMode:"cover"
    },
    badge_placeholder:{
        color:colors.white,
        fontWeight:"bold",
        fontSize:10
    },  
    badge_image:{
        aspectRatio:1200/1201,
        height:undefined,
        width:50,
        
    },
    logo:{
        aspectRatio:1753/1224,
        height:undefined,
        width:300,
        marginBottom:70,
        marginTop:30

    },
    cover:{
        // aspectRatio:2251/1403,
        height:200,
        width:"100%",
        resizeMode:"cover"
    },
    root:{
        flexGrow:1,
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