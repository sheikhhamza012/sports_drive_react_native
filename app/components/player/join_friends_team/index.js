import React, { Component } from 'react'
import  { Text,Share,TextInput,KeyboardAvoidingView ,TouchableOpacity, View, ScrollView,StyleSheet,Image, ImageBackground, AsyncStorage, RefreshControl} from 'react-native'
import Button from '../../../reuseableComponents/button'
import { colors,api } from '../../../constants'
import {axios} from '../../../reuseableComponents/externalFunctions'
import Toast from 'react-native-easy-toast'
import {Field} from '../../signup'
import DropDownPicker from 'react-native-dropdown-picker';
import {Menu, Button as B , Provider, ActivityIndicator} from 'react-native-paper'
import ImagePicker from 'react-native-image-crop-picker';
import Rating from 'react-native-star-rating'

export default class home extends Component {
    state={
        
    }
    componentDidMount() {
     
    }
    
    handleInput=x=>{
        this.setState({create_team:{...this.state.create_team,[x.name]:x.val},errors:{...this.state.errors, [x.name]:false}})
    }
    
    render() {
        const team = this.props.teams[0]
        return (
            <ImageBackground style={styles.background} source={require('../../../images/app_background.png')}>
                <Toast 
                    ref="toast"
                    position='bottom'
                    positionValue={200}
                />
                <ScrollView refreshControl={<RefreshControl refreshing={this.state.isFetching} onRefresh={this.componentDidMount}/>} style={{marginTop:130}} contentContainerStyle={styles.root}>
                        <View style={{backgroundColor:colors.white,borderRadius:10,padding:20, marginVertical:10, alignItems:"stretch"}}>
                            <Text style={{fontSize:18, fontWeight:"bold", alignSelf:"center"}}>{this.props.user.first_name} {this.props.user.last_name}</Text>
                            <View style={{flexDirection:"row",justifyContent:"space-between"}}>
                                <Text style={{color:colors.blue,fontSize:18}}>Age: <Text style={{color:colors.black}}>{"N/A"}</Text></Text>
                                <Text style={{color:colors.blue,fontSize:18}}>Date: <Text style={{color:colors.black}}>{}</Text></Text>
                            </View>
                            
                            <View style={{flexDirection:"row",justifyContent:"space-between"}}>
                                <Text style={{color:colors.blue,fontSize:18}}>Category: <Text style={{color:colors.black}}>{this.props.user.player_of}</Text></Text>
                                <Text style={{color:colors.blue,fontSize:18}}>Time: <Text style={{color:colors.black}}>{}</Text></Text>
                            </View>
                            
                            <View style={{flexDirection:"row",justifyContent:"space-between"}}>
                                <Text style={{color:colors.blue,fontSize:18}}>Venue: <Text style={{color:colors.black}}>{}</Text></Text>
                                <Rating
                                    disabled={true}
                                    emptyStar={'star-o'}
                                    fullStar={'star'}
                                    halfStar={'star-half'}
                                    iconSet={'FontAwesome'}
                                    maxStars={5}
                                    rating={this.props.user.rating}
                                    // selectedStar={(rating) => this.onStarRatingPress(rating)}
                                    starSize={22}
                                    fullStarColor={colors.yellow}
                                    emptyStarColor={colors.yellow}
                                    containerStyle={{}}
                                />
                            </View>
                            
                        </View>
                        
                </ScrollView>
            </ImageBackground>
        )
    }
}

const styles=StyleSheet.create({
    
    title:{
        fontSize:30,
        color:colors.white
    },  
    
    root:{
        flexGrow:1,
        padding:30
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