/**
 * Created by qiangxinyu on 2017/4/17.
 */


import React from 'react'

import {
    View,
    StyleSheet
} from 'react-native'

import NavigationBar from '../Custom/NavBarCommon'


export default class Home extends React.Component {
    render() {
        return (
            <View style={styles.view}>
                <NavigationBar
                    title="首页"
                    unLeftImage={true}
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