import React ,{ Component } from 'react';
import { View,Image,StyleSheet,ImageBackground ,AsyncStorage,Animated, Dimensions} from 'react-native';
import {axios} from './reuseableComponents/externalFunctions'
import {colors,api} from './constants'
import {fetch_request_list} from './navigation'
class App extends Component {
    state = { position: new Animated.Value(100) }
    componentDidMount = async()=> {
        if(this.props.current_view == "vendor"){
            fetch_request_list(this.props)
        }
        Animated.spring(
            this.state.position,
            {
              toValue: 0,
              velocity: 2,
              tension: 2,
              friction: 8,
              useNativeDriver:false
            }
          ).start();




        const token = await AsyncStorage.getItem("token") 
        if(token){
            this.props.dispatch({type:"IS_LOGGING_IN",data:true})
            axios('get',api.get_user,null,true)
            .then(async({data})=>{
                console.log(data)
                this.props.dispatch({type:"IS_LOGGING_IN",data:false})
                if(data.error){
                    await AsyncStorage.clear()
                    this.props.dispatch({type:"LOGOUT",data:this.props.user.id})
                    return
                }
                this.props.dispatch({type:"SET_USER",data:data.user})
                
            })
            .catch(x=>{
                this.props.dispatch({type:"IS_LOGGING_IN",data:false})
                console.log(x)
            })
        }else{
            setTimeout(async()=>{
                this.props.dispatch({type:"IS_LOGGING_IN",data:false})
            },3000 )
        }
          
    }
    render() { 
        return ( 
            <ImageBackground style={styles.background} source={require('../assets/splash.png')}>
                <Animated.Image style={[styles.logo,{transform:[{translateY:this.state.position}]}]} source={require('./images/splash_logo.png')}/>
            </ImageBackground>
         );
    }
}
const styles=StyleSheet.create({
    logo:{
        aspectRatio:1532/1793,
        height:undefined,
        width:200
    },
    background:{
        resizeMode:"cover",
        width:"100%",
        height:"100%",
        alignItems:"center",
        justifyContent:"center"
    }
})
export default App;