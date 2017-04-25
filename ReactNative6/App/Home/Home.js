/**
 * Created by qiangxinyu on 2017/4/17.
 */


import React from 'react'

import {
    View,
    StyleSheet,
    ScrollView,
    Dimensions,
    Platform
} from 'react-native'
const {width, height} = Dimensions.get('window')

import NavigationBar from '../Custom/NavBarCommon'

import SegmentedView from './SegmentedView'

import NewsList from './NewsList'
export default class Home extends React.Component {

    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            list: null,

        };

          this._getNewsLists = this._getNewsLists.bind(this)
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


        let str = 'uDgFKk1WHYBjSoIklv04aUk3q2plrVmyPq2gvwCKufRjS6FuJKMiOL1R8l/EQ/JEkza4TjQ11ZSav0opTkso73RikuQg6i7b+uUUcXUI0GDnfCXT13B+npyQ9xELxNCL3HqIUjfK+YOFfijLsuUjELipV/Jo22hXWiCF1gC1Lv7ZVT3vgYOCcYpimIj2dY7v'



    }

    _getColor(color, index) {

        index ++

        if (index == 7) {
            return color
        }

        color = color + '0123456789abcdef'[Math.floor(Math.random()*16)]
        return  this._getColor(color, index)
    }

    _getNewsLists() {
        let lists = []
        if (this.state.list) {
            for (let index in this.state.list) {
                let dic = this.state.list[index]
                lists.push(
                    <NewsList
                        ref={'NewsList' + index}
                        key={index}
                        style={{backgroundColor:'white', width: width, height: height - 64 - 49 - 30}}
                        dic={dic}
                        isRequest={index == 0}
                        touchIn={(scrollEnabled) => {
                            this.refs.ScrollView.setNativeProps({scrollEnabled: !scrollEnabled})
                        }}
                        navigator={this.props.navigator}
                    />
                )
            }
        }

        return lists
    }


    _scrollTo(index) {
        let newsList = this.refs['NewsList' + index]
        newsList.state.isFirstShow && newsList._onRefresh()
    }

    render() {
        return (
            <View style={styles.view}>
                <NavigationBar
                    title="首页"
                    unLeftImage={true}
                />

                <SegmentedView
                    ref="SegmentedView"
                    list={this.state.list}
                    style={{height: 30}}
                    selectItem={(index) => {
                        this.refs.ScrollView.scrollTo({x: width * index, y: 0, animated: true})
                        this._scrollTo(index)
                    }}
                />

                <ScrollView
                    removeClippedSubviews={Platform.OS === 'ios'}
                    style={styles.view}
                    ref="ScrollView"
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled={true}
                    onMomentumScrollEnd={(s) => {
                        let index = s.nativeEvent.contentOffset.x / width
                        this.refs.SegmentedView._moveTo(index)
                        this._scrollTo(index)
                    }}
                >

                    { this._getNewsLists()}

                </ScrollView>

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