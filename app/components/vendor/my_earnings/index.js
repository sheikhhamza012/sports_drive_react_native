import React, { Component } from 'react'
import { Text, View, StyleSheet,ScrollView,Dimensions, RefreshControl } from 'react-native'
import {global_styles,colors, api} from '../../../constants'
import {axios} from '../../../reuseableComponents/externalFunctions'
import {BarChart } from "react-native-chart-kit";
import moment from 'moment'
export default class index extends Component {
    state={
        data:[]
    }
    componentDidMount = ()=> {
        this.setState({isLoading:true})
        axios('get',api.my_earning,null,true)
        .then(({data})=>{
            this.setState({isLoading:false})
            if(data.error){
                this.refs.toast.show(data.msg)
                return
            }
            
            this.setState({data:data.data??[], selectedMonth:data.data.length-1})
            
        })  
        .catch(e=>{
            console.log(e)
            this.setState({isLoading:false})
        })
    }
    calc_earning=(x)=>{
        var percent = (x?.commission??0) / 100
        var commission = (x?.total??0) * percent
        return (x?.total??0)- commission 
    }
    render() {
        let obj = this.state.data[this.state.selectedMonth]
        return (
            <ScrollView refreshControl={<RefreshControl refreshing={this.state.isLoading} onRefresh={this.componentDidMount}/>} contentContainerStyle={styles.root} style={global_styles.headerPadding}>
                <Text style={styles.title}> Rs. {this.calc_earning(this.state.data[this.state.selectedMonth])}/- </Text>
                <Text style={styles.subtitle}> Booked earnings for {this.state.data[this.state.selectedMonth]?.year}</Text>
                <View style={{marginTop:20}}>
                    <BarChart
                        style={styles.graphStyle}
                        fromZero={true}
                        verticalLabelRotation={180}
                        chartConfig={{
                            fillShadowGradient:colors.blue,
                            fillShadowGradientOpacity:1,
                            backgroundGradientFromOpacity: 0,
                            backgroundGradientToOpacity: 0,
                            // backgroundColor: "#fff",
                            decimalPlaces: 0, // optional, defaults to 2dp
                        
                            color: (opacity)=>colors.dark_grey,
                            labelColor: (opacity = 1) => colors.dark_grey,
                            // style: {
                            //   borderRadius: 16
                            // },
                        }}
                        data={{
                            datasets: [
                            {
                                data: this.state.data.map(x=>x.total)
                            }
                            ]
                        }}
                        width={Dimensions.get('window').width-40}
                        height={220}
                        yAxisLabel="Rs."
                        withVerticalLabels={false}
                        verticalLabelRotation={30}
                        />
                        <View style={{width:"100%",flexDirection:"row",marginTop:-30}}>
                            <View style={{flex:0.23}}/>
                            <View style={{flexDirection:"row",justifyContent:"space-between",flex:0.77}}>
                                {this.state.data.map(x=>x.month).map((x,i)=>
                                    <Text onPress={()=>this.setState({selectedMonth:i})} style={[{width:30,textAlign:"center",color:colors.dark_grey},obj.month==x&&{color:colors.blue, fontWeight:"bold"}]}>{moment(x, 'MM').format('MMM')}</Text>
                                )}
                            </View>
                        </View>
                </View>
                <Text style={[styles.title,{marginTop:20}]}> {moment(obj?.month , 'MM').format('MMMM')} </Text>
                <Text style={styles.subtitle}> Total Revenue {obj?.total} </Text>
                <Text style={styles.subtitle}> Commission {obj?.commission}</Text>
                <Text style={styles.subtitle}> Total Earnings {this.calc_earning(obj)}</Text>
                
            </ScrollView>
        )
    }
}
const styles = StyleSheet.create({
    root:{
        padding:20
    },
    title:{
        fontWeight:"bold",
        fontSize:20
    },
    subtitle:{
        color:colors.dark_grey,
        marginTop:10
    },
    graphStyle:{
        // backgroundColor:colors.white
    }
})