/**
 * Created by qiangxinyu on 2017/4/17.
 */


import React from 'react'

import {
    View,
    StyleSheet
} from 'react-native'

import NavigationBar from '../Custom/NavBarCommon'

import SegmentedView from './SegmentedView'


export default class Home extends React.Component {

    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            list: null
        };
      }

    componentDidMount() {
        let url = 'http://api.iapple123.com/newscategory/list/index.html?clientid=1114283782&v=1.1'
        fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        })
            .then((res) => {
                res.json()
                    .then((json) =>{
                        LOG('GET SUCCESS =>',url, json)

                        this.setState({
                            list: json.CategoryList
                        })

                    })
                    .catch((e) => {
                        LOG('GET ERROR then =>',url,e)

                    })
            })
            .catch((error) => {
                LOG('GET ERROR=>',url, '==>',error)
            })
    }

    render() {
        return (
            <View style={styles.view}>
                <NavigationBar
                    title="首页"
                    unLeftImage={true}
                />

                <SegmentedView
                    list={this.state.list}
                    style={{height: 30}}
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