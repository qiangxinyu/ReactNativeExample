/**
 * Created by qiangxinyu on 2017/4/25.
 */


import React from 'react'

import {
    View,
    Text,
    StyleSheet,
    WebView
} from 'react-native'

import NavigationBar from '../Custom/NavBarCommon'

export default class NewsDetail extends React.Component {
    render() {
        return (
            <View style={styles.view}>
                <NavigationBar
                    title="详情页"
                    navigator={this.props.navigator}
                />
                <WebView
                    style={{flex:1}}
                    source={{uri: 'http://zjzywap.eastday.com/m/170425001829725.html?fr=toutiao&qid=zjxw&apptypeid=ZJZYIOS1114283782&ime=6271F554-7B2F-45DE-887E-4A336F64DEE6'}}
                />

            </View>
        )
    }
}


const styles = StyleSheet.create({
    view: {
        flex:1,
        backgroundColor: 'white'
    }
})