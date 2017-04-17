import React from 'react'

import {
    View,
    StyleSheet
} from 'react-native'
import NavigationBar from '../Custom/NavBarCommon'


export default class Satin extends React.Component {
    render() {
        return (
            <View style={styles.view}>
                <NavigationBar
                    title="段子"
                    unLeftImage={true}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    view: {
        flex:1,
        backgroundColor: 'orange'
    }
})