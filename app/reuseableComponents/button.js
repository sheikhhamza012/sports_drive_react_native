import React, { Component } from 'react'
import { Text, View, TouchableOpacity , StyleSheet, Dimensions, ActivityIndicator} from 'react-native'
import {colors} from '../constants'
import Icon from 'react-native-vector-icons/Zocial'
import AIcon from 'react-native-vector-icons/AntDesign'
export default class button extends Component {
    render() {
        return (
            <TouchableOpacity disabled={(this.props.disabled??this.props.isLoading)} onPress={this.props.onPress} style={[styles.root,this.props.style]}>
                {this.props.isLoading?
                    <ActivityIndicator color={colors.white} size="small"/>
                :
                <>
                    {this.props.iconLeft&&<Icon name={this.props.iconLeft} color={this.props.iconLeftStyle?.color||colors.white} size={this.props.iconLeftStyle?.size||22}/>}
                    <Text style={[styles.text,this.props.placeholderStyle]}> {this.props.placeholder} </Text>
                    {this.props.iconRight&&<AIcon name={this.props.iconRight} color={this.props.iconLeftStyle?.color||colors.white} size={this.props.iconLeftStyle?.size||22}/>}
                </>
            }
            </TouchableOpacity>
        )
    }
}
const styles=StyleSheet.create({
    root:{
        elevation:2,
        shadowColor: colors.black,
        shadowOpacity: 0.3,
        shadowRadius: 3,
        shadowOffset: {
            height: 1,
            width: 1
        },
        width:"100%",
        height:40,
        alignItems:"center",
        justifyContent:"center",
        backgroundColor:"#333",
        borderRadius:100,
        flexDirection:"row"
    },
    background:{
        resizeMode:"cover",
        width:"100%",
        height:"100%",
        alignItems:"center",
        justifyContent:"center"
    },
    text:{
        color:colors.white,
        fontSize:18,
        fontWeight:"bold"
    }
})