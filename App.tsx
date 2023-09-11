import React from 'react';
import { View } from 'react-native'
import Header from './src/components/Header';
import Post from './src/components/Post';

export default props => 
  <View style={{flex: 1}}>
    <Header/>
    <Post image={require('./assets/imgs/fence.jpg')}/>
  </View>