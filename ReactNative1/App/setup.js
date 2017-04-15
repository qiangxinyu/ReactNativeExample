/**
 * Created by qiangxinyu on 2017/4/14.
 */


import React from 'react'
import {
    StyleSheet,
    Text,
    View
} from 'react-native';


function setup(): ReactClass<{}> {

    //这里做一些注册第三方等App初始化需要的操作

    return Root
}

class Root extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>
                    Hello World!
                </Text>
                <Text style={styles.instructions}>
                    edit setup.js
                </Text>
                <Text style={styles.instructions}>
                    Android: Double tap R on your keyboard to reload,{'\n'}
                    iOS: Tap Command + R on your keyboard to reload

                </Text>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});


module.exports = setup