import React, { Component } from 'react';
import {Provider} from 'react-redux'
import {store} from './app/redux'
import Navigator from './app/navigation'
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import SideDrawer from './app/navigation/sidedrawer'
import imports from './app/imports'

const Drawer = createDrawerNavigator();

export default class App extends React.Component {
  
  render() {
    return ( 
      <Provider store={store}>
        <NavigationContainer ref={r=>this.navigationRef=r}>
          <Navigator navigationRef={()=>this.navigationRef}/>
        </NavigationContainer>
      </Provider>
    );
  }
}
