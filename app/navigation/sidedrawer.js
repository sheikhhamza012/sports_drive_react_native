import React, { Component } from 'react'
import { Text,TouchableOpacity, View ,SafeAreaView,ScrollView,StyleSheet,AsyncStorage} from 'react-native'
import { colors } from '../constants'

export default class sidedrawer extends Component {
    routes=[
        {route:"home",title:"Home"},
        {route:"profile",title:"My Profile"},
        {route:"booking_history",title:"My Bookings"},
        {route:"become_a_vendor",title:"Become a Vendor"},
        {route:"home",title:"Add a Payment Method"},
        {route: ()=>this.logout() ,title:"Log Out"},
        {route:"home",title:"Help"},
    ]
    logout=async(props)=>{
        await AsyncStorage.clear();
        this.props.dispatch({type:"LOGOUT"})
    }
    render() {
        return (
            <SafeAreaView style={{flex:1,marginHorizontal:35}}>
                <ScrollView style={{flex:1}} contentContainerStyle={styles.container}>
                    {
                        this.routes.map((x,i)=>                            
                            <TouchableOpacity key={i} style={styles.item} onPress={()=>{
                                    if (typeof x.route=="string"){
                                        this.props.navigation.navigate(x.route)
                                    }else{
                                        x.route()
                                    }
                                    this.props.navigation.closeDrawer()
                                }} >
                                <Text style={styles.item_text}>{x.title}</Text>
                            </TouchableOpacity>
                        )
                    }

                </ScrollView>
                <View style={styles.footer}>
                    <Text style={styles.terms}>Terms & Conditions</Text>
                    <Text style={styles.terms}>FAQs</Text>
                </View>
            </SafeAreaView>
        )
    }
}
const styles = StyleSheet.create({
    terms:{fontSize:11,color:colors.dark_grey},
    item_text:{color:colors.dark_grey,fontSize:12},
    footer:{paddingVertical:30,flexDirection:"row",justifyContent:"space-between"},
    container:{
        flexGrow:1,
        paddingTop:40,
    },
    item:{
        paddingVertical:10,
        borderBottomWidth:0.5,
        borderColor:colors.light_grey2,
        marginBottom:10
    }
})