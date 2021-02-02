import React, { Component } from 'react'
import { Text, View,Image,ActivityIndicator ,ScrollView,StyleSheet,RefreshControl,TouchableOpacity, Dimensions, ImageBackground} from 'react-native'
import { colors,api, global_styles } from '../../constants'
import Icon from 'react-native-vector-icons/AntDesign'
import Rating from 'react-native-star-rating'
import {axios,trim} from '../../reuseableComponents/externalFunctions'
import { Switch,  } from 'react-native-paper';
import ImagePicker from 'react-native-image-crop-picker';

export default class my_arenas extends Component {
    state={isLoading:true}
    componentDidMount = async()=> {
        this.setState({isLoading:true})
        const res = await axios('get',api.my_arenas,null,true)
        this.setState({isLoading:false})
        this.props.dispatch({type:"SET_SCREEN",key:"my_arena",data:res.data.arena??{}})
    }
    update_group=(id,params)=>{
        params={group:params}
        this.setState({is_updating_instant_booking: true})
        axios('patch',api.update_group(id),params,true)
        .then(({data})=>{
            this.setState({is_updating_instant_booking:false})
            if(data.error){
                this.refs.toast.show(data.msg)
            }            
        })
        .catch(e=>{
            this.setState({is_updating_instant_booking:false})
        })
    }
    render() {
        return (
            <ScrollView refreshControl={<RefreshControl onRefresh={this.componentDidMount} refreshing={this.state.isLoading}/>} style={global_styles.headerPadding} contentContainerStyle={{flexGrow:1,paddingBottom:100}}>

                <ScrollView 
                    nestedScrollEnabled={true}
                    horizontal
                    pagingEnabled
                    // ref={r=>this.carousel=r}
                    showsHorizontalScrollIndicator={false} 
                    contentContainerStyle={styles.root} 
                    style={{marginTop:40}} 
                    refreshControl={<RefreshControl onRefresh={this.componentDidMount} refreshing={this.state.isLoading}/>}
                >
                    {(this.props.my_arena.groups??[]).map((x,i)=>
                    <View >
                       <View style={{width:Dimensions.get("window").width,alignItems:"flex-start"}}>
                            <Text style={{fontSize:14,marginLeft:20,fontWeight:"bold"}}>{x.name}</Text>  
                            <Text style={{fontSize:12,marginLeft:20,fontWeight:"bold",marginVertical:10}}>{"Pricing"}</Text> 
                            <View style={{width:345,flexDirection:"row", padding:10,alignSelf:"center"}}>
                                <Card onPress={()=>this.props.navigation.navigate("group_pricing",{id:x.id,title:x.field_type[0].toUpperCase()+x.field_type.substring(1)+"s"})} style={{margin:0}} data= {{image:this.props.my_arena.image,location:this.props.my_arena.location,name:this.props.my_arena.name,rating:this.props.my_arena.rating}}/>   
                            </View>
                            <Text style={{fontSize:12,marginLeft:20,fontWeight:"bold",marginVertical:10}}>{x.field_type[0].toUpperCase()+x.field_type.substring(1)+"s"}</Text>
                        </View>
                        <View style={{flexWrap:"wrap", flexDirection:"row",width:345,alignSelf:"center"}}>
                            {(x.fields??[]).map((f,k)=>
                            <Card 
                                key={k}
                                update_image={img=>{
                                    f.image=img
                                    this.forceUpdate()
                                }}
                                onPress={()=>{
                                    this.props.dispatch({type:"SET_VALUE",screen:"booking_calendar",key:'field_id',data:f.id})
                                    this.props.navigation.navigate("booking_calendar",{subtitle:f.name})
                                }} 
                                data = {{id:f.id,image:f.image,location:this.props.my_arena.location,name:f.name,rating:this.props.my_arena.ratinag}}/>   
                            )}
                            <View style={{flexDirection:"row",justifyContent:"space-between",width:"100%"}}>
                                <Text style={{fontSize:14,fontWeight:"bold"}}>Allow Instant Booking</Text>
                                {this.state.is_updating_instant_booking?
                                    <ActivityIndicator style={{marginRight:10}}/>
                                :
                                    <Switch value={x.allow_instant_booking} onValueChange={(val)=>{
                                        x.allow_instant_booking=val
                                        this.update_group(x.id,{allow_instant_booking:val})
                                    }} color={colors.blue} style={{transform: [{ scaleX: .6 }, { scaleY: .6 }]}}/>
                            
                                }
                            </View>

                        </View>
                    </View>
                    )}
                </ScrollView>
            </ScrollView>
        )
    }
}

export class Card extends Component {
    state={}
    changeImage = async () => {
        ImagePicker.openPicker({
            multiple: false,
            width: 500,
            height: 500,
          }).then(async(image) => {
              console.log(image)
            if (image.path) {
                    this.setState({isUploading:true})
                    var filename = image.path.split('/')
                    filename=filename[filename.length-1]
                    var blob = {
                        uri: image.path,
                        type: "image/*",
                        name: filename
                    }
                    let body= new FormData()
                    body.append("field[image]",blob)
                axios('patch',api.update_field(this.props.data.id),body,true)
                    .then(async({data})=>{
                        this.setState({isUploading:false})
                        if(data.error){
                            alert(data.msg)
                            return
                        }
                        this.props.update_image(image.path)
                    })
                    .catch(x=>{
                        this.setState({isUploading:false})
                        console.log(x)
                    })
                }
          })
        
    }
    render() {
        const {data}=this.props
        if (data.id==278){
            console.log("data===>",data.image)
        }
        
        return (
            
            <TouchableOpacity disabled={this.props.disabled} onPress={this.props.onPress} style={[styles.cardContainer,this.props.style,this.props.disabled&&{opacity:0.3}]}>
                <ImageBackground onLoadStart={(e) => this.setState({isUploading: true})}  onLoadEnd={(e) => this.setState({isUploading: false})}  source={{uri:data.image}} style={{width:65,height:60,backgroundColor:colors.grey}}>
                    {(this.props.update_image||this.state.isUploading)&&
                    <TouchableOpacity onPress={this.state.isUploading?null :this.changeImage} style={{position:"absolute",width:"100%",height:"100%",backgroundColor:colors.overlay,alignItems:"center",justifyContent:"center"}}>
                       {this.state.isUploading?
                            <ActivityIndicator color={colors.white}/>
                            :
                            <Icon name="edit" color={colors.white} size={20} />
                       } 
                    </TouchableOpacity>
                    }
                </ImageBackground>
                <View style={styles.detail}>
                    <Text style={[{fontWeight:"bold",fontSize:12},this.props.textStyle]}>{trim(data.name,4)}</Text>
                    <Text style={[{fontSize:10},this.props.textStyle]}>{trim(data.location.address,10)}</Text>
                    <Rating
                        disabled={true}
                        emptyStar={'star-o'}
                        fullStar={'star'}
                        halfStar={'star-half'}
                        iconSet={'FontAwesome'}
                        maxStars={5}
                        rating={this.props.rating??5}
                        // selectedStar={(rating) => this.onStarRatingPress(rating)}
                        starSize={10}
                        fullStarColor={colors.grey}
                        emptyStarColor={colors.white}
                        containerStyle={{width:40,marginTop:5}}
                    />
                </View>
                <TouchableOpacity style={styles.heart}>
                    <Icon name="heart" color={colors.blue} size={12}/>
                </TouchableOpacity>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    root:{
        flexGrow:1,
        // paddingLeft:20,
        paddingBottom:20,
    },
    detail:{
        paddingHorizontal:8,
        width:50
    },
    cardContainer:{
        flexDirection:"row",
        elevation:4,
        shadowColor: colors.grey,
        shadowOpacity: 0.8,
        shadowRadius: 4,
        shadowOffset: {
            height: 1,
            width: 1
        },
        backgroundColor:colors.white,
        padding:10,
        margin:10,
    },
    
})