/**
 * Created by qiangxinyu on 2017/2/28.
 */

'use strict';


import React from 'react'

import {
    StyleSheet,
    View,
    Text,
    Image,
} from 'react-native';
import TabNavigator from 'react-native-tab-navigator';

const home_key = 'home'
const satin_key = 'satin'
const setting_key = 'setting'


import Home from './Home/Home'
import Satin from './Satin/Satin'
import Setting from './Setting/Setting'


export default class App extends React.Component {
    // 构造
    constructor(props) {
        super(props);

        this.state = {
            selectedTab: home_key,

        };
    }
    render() {
        return (
            <View style={styles.view}>
                <TabNavigator>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === home_key}
                        title="首页"
                        titleStyle={styles.tabText}
                        selectedTitleStyle={styles.selectedTabText}
                        renderIcon={() => <Image style={styles.icon} source={require("./Images/root/home_unselect.png")} />}
                        renderSelectedIcon={() => <Image style={styles.icon} source={require("./Images/root/home_select.png")} />}
                        onPress={() => this.setState({ selectedTab: home_key })}>

                        <Home navigator={this.props.navigator}/>
                    </TabNavigator.Item>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === satin_key}
                        title="段子"
                        titleStyle={styles.tabText}
                        selectedTitleStyle={styles.selectedTabText}
                        renderIcon={() => <Image style={styles.icon} source={require("./Images/root/activity_unselect.png")} />}
                        renderSelectedIcon={() => <Image style={styles.icon} source={require("./Images/root/activity_select.png")} />}
                        onPress={() => this.setState({ selectedTab: satin_key })}>

                        <Satin navigator={this.props.navigator}/>
                    </TabNavigator.Item>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === setting_key}
                        title="我的"
                        titleStyle={styles.tabText}
                        selectedTitleStyle={styles.selectedTabText}
                        renderIcon={() => <Image style={styles.icon} source={require("./Images/root/my_unselect.png")} />}
                        renderSelectedIcon={() => <Image style={styles.icon} source={require("./Images/root/my_select.png")} />}
                        onPress={() => this.setState({ selectedTab: setting_key })}>

                        <Setting navigator={this.props.navigator}/>
                    </TabNavigator.Item>
                </TabNavigator>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
        backgroundColor: 'white',

    },
    selectedTabText: {
        color: "#000000",
        fontSize: 13
    },
    tabText: {
        color: "#999999",
        fontSize: 13,
        alignSelf: 'center'
    },
    icon: {
        width: 20,
        height: 20
    }
});

