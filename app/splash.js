import React ,{ Component } from 'react';
import { View,Image,StyleSheet,ImageBackground ,AsyncStorage,Animated, Dimensions} from 'react-native';

class App extends Component {
    state = { position: new Animated.Value(100) }
    componentDidMount() {
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