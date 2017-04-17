/**
 * Created by qiangxinyu on 2017/2/28.
 */

'use strict';


import React from 'react'

import {
    StyleSheet,
    View,
    Text,

} from 'react-native';

export default class App extends React.Component {

    render() {
        return (
            <View style={styles.view}>
                <Text>main</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center'

    },
});

