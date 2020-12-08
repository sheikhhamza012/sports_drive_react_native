import React, { Component } from 'react'
import  { Text, RefreshControl , View, ScrollView,StyleSheet,Image,TextInput, ImageBackground, ActivityIndicator, KeyboardAvoidingView} from 'react-native'
import Button from '../../reuseableComponents/button'
import { colors, api } from '../../constants'
import { TouchableOpacity } from 'react-native-gesture-handler'
// import MapView from 'react-native-maps'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {axios,trim} from '../../reuseableComponents/externalFunctions'
import { color } from 'react-native-reanimated'
export default class SportsMenu extends Component {
    state={
        keyword:'',
        arenas:[]
    }

    componentDidMount = async()=> {
        this.setState({isLoading:true})
        const params = {
                keyword: this.state.keyword
        }
        const res = await axios('post',api.search,params,true)
        this.setState({arenas:res.data.arenas??[], isLoading:false})
    }
    search=x=>{
        this.setState({keyword:x.val})
        if (this.typingTimeout) {
            clearTimeout(this.typingTimeout);
         }
        this.typingTimeout=setTimeout(() =>{
            this.componentDidMount()
        }, 1000)
    }
    selectArena=id=>{
        this.props.dispatch({type:"SET_BOOKING_PARAMS", data:id,key:"arena_id"})
        this.props.navigation.navigate("booking_details")
    }
    render() {
        return (
            <ImageBackground style={styles.background} source={require('../../images/app_background.png')}>
                <ScrollView style={{marginTop:130}} contentContainerStyle={styles.root}>
                   
                    {/* <Text style={styles.title_text}>Book Now</Text> */}
                    <View style={{paddingHorizontal:20}}>

                        <SearchField name="search" handleInput={this.search} onSubmitEditing={this.componentDidMount} placeholder="SEARCH" />
                    </View>
                    <View style={styles.map_container}>
                    
                        <ScrollView refreshControl={<RefreshControl refreshing={this.state.isLoading}/>}>
                            {this.state.isLoading&&<ActivityIndicator style={{marginVertical:10}} />}
                            {this.state.arenas.length==0&&<Text style={{margin:10,textAlign:"center"}} >No records found</Text>}
                           {this.state.arenas.map(x=>
                                <Arena id={x.id} key={x.id} onPress={this.selectArena} name={x.name} location={x.location} image = {x.image}/>
                           )}
                        </ScrollView>
                    </View>
                </ScrollView>
            </ImageBackground>
        )
    }
}

export class Arena extends Component {
    state={}
    componentDidMount=async()=> {
        
    }

    render() {
        
        return (
            <TouchableOpacity onPress={()=>this.props.onPress(this.props.id)} style={styles.arenaContainer}>
                
                <View style={{flexDirection:"row"}}>
                    <Image source={{uri:this.props.image}} style={styles.arenaPic}/>
                    <View style={styles.arenaDetail}>
                        <Text style={{fontWeight:"bold"}}>{this.props.name}</Text>
                        <View style={{flexDirection:"row"}}>
                            <Icon name="location-on" size={16}/><Text >{trim(this.props.location,28)}</Text>
                        </View>
                        {this.props.children}
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

class Map extends Component {
    state={}
    componentDidMount=async()=> {
        let { status } = await Location.requestPermissionsAsync();
        if (status !== 'granted') {
          alert('Permission to access location was denied');
        }
  
        let location = await Location.getCurrentPositionAsync({});
        this.setState({location:location.coords}); 
    }

    render() {
        
        return (
            <View style={{flex:1}}>
                    <MapView
                    style={[{flex:1},this.props.style]}
                    region={{
                        latitude: this.props.location?.latitude??this.state.location?.latitude,
                        longitude: this.props.location?.longitude??this.state.location?.longitude,
                        latitudeDelta: 0.02,
                        longitudeDelta: 0.02
                    }}/>
            </View>
        )
    }
}


class SearchField extends Component {
    render() {
        return (
            <View style={styles.search_field_containter}>
                <TextInput 
                    style={styles.search_field}
                    placeholder={this.props.placeholder}
                    placeholderTextColor={styles.search_field.color}
                    onSubmitEditing={this.props.onSubmitEditing}
                    onChangeText={t=>this.props.handleInput({name:this.props.name,val:t})}
                /> 

               
            </View>
        )
    }
}

const styles=StyleSheet.create({
    arenaDetail:{justifyContent:"center",paddingHorizontal:15,flex:1},
    arenaPic:{width:80,height:80,resizeMode:"cover"},
    arenaContainer:{flex:1,borderWidth:1,borderColor:colors.grey,marginBottom:20 ,backgroundColor:colors.white},
    search_field_containter:{
        width:"100%",
        backgroundColor:colors.blue,
        borderColor:colors.white,
        borderWidth:2,
        borderRadius:100,
        height:50,
        justifyContent:"center",
    },
    search_field:{
        padding:10,
        paddingHorizontal:20,
        color:colors.white,
        fontWeight:"bold"
    },

    title_text:{
        fontSize:14,
        fontWeight:"bold",
        color:colors.white,
        marginBottom:30,
        fontSize:16
    },
    map_container:{
        backgroundColor:colors.white,
        flex:1,
        marginTop:30,
        borderTopLeftRadius:20,
        borderTopRightRadius:20,
        padding:20,
    },
    
    root:{
        flexGrow:1,
        paddingTop:5,
        // paddingHorizontal:30,
        alignItems:"stretch",
        justifyContent:"space-between"

    },
   
    background:{
        resizeMode:"cover",
        width:"100%",
        height:"100%",
        justifyContent:"center",
        alignItems:"stretch",
    }
})