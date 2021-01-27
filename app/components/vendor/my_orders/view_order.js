import React, { Component } from 'react'
import { Text, View, RefreshControl,StyleSheet } from 'react-native'
import {api,colors,global_styles} from '../../../constants'
import {axios} from '../../../reuseableComponents/externalFunctions'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import moment from 'moment'
export default class view_order extends Component {
    state={
        request:{

        }
    }
    componentDidMount = ()=> {
        this.setState({isLoading:true})
        axios('get',api.order_detail(this.props.route.params.id),null,true)
        .then(({data})=>{
            this.setState({isLoading:false})
            if(data.error){
                this.refs.toast.show(data.msg)
                return
            }
            this.setState({request:data.request??{}})
            
        })  
        .catch(e=>{
            console.log(e)
            this.setState({isLoading:false})
        })
    }
    render() {
        return (
            <ScrollView refreshControl={<RefreshControl refreshing={this.state.isLoading} onRefresh={this.componentDidMount}/>}  style={global_styles.headerPadding}>
                <View style={styles.root}>
                    <Text style={styles.name}> {this.state.request?.user?.first_name} {this.state.request?.user?.last_name} </Text>
                    <View style={styles.detail}>
                        <View style={[styles.row,{borderBottomWidth:0.5,borderColor:colors.dark_grey}]}>
                            <Text style={styles.label}> Tracking ID </Text>
                            <Text > {this.state.request?.id} </Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}> Ground</Text>
                            <Text > {this.state.request?.field_name} </Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}> Time Slot</Text>
                            <Text > {moment(this.state.request?.from_time).format("hh:mm a")} to {moment(this.state.request?.to_time).format("hh:mm a")} </Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}> Date</Text>
                            <Text > {moment(this.state.request?.from_time).format("DD-MM-YYYY")} </Text>
                        </View>
                    </View>
                </View>
                <View style={[styles.row,styles.root,{backgroundColor:colors.light_grey3}]}>
                    <Text style={styles.label}> Total</Text>
                    <Text > Rs {this.state.request?.price} </Text>
                </View>
                   
            </ScrollView>
        )
    }
}
const styles=StyleSheet.create({
    root:{
        padding:20
    },
    label:{
        color:colors.dark_grey
    },
    row:{
        justifyContent:"space-between",
        flexDirection:"row",
        paddingVertical:10,
    },
    detail:{
        marginTop:30
    },
    name:{
        fontSize:18,
        color:colors.blue,
        fontWeight:"bold"
    }
})