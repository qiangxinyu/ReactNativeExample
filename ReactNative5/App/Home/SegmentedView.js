/**
 * Created by qiangxinyu on 2017/4/18.
 */


import React from 'react'

import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    Dimensions,
    ScrollView
} from 'react-native'

const {width, height} = Dimensions.get('window')


// 一 屏最大数量, 为了可以居中请设置为 奇数
const maxItem = 7

export default class SegmentedView extends React.Component {

    // 构造
      constructor(props) {
        super(props);


        // 初始状态
        this.state = {
            itemHeight: 50,
            selectItem: null,
        };

          if (props.style && props.style.height > 0) {
              this.state = {
                  ...this.state,
                  itemHeight: props.style.height,  //如果在使用的地方设置了高度,那么保存起来方便使用
              };
          }

          this._getItems = this._getItems.bind(this, true)
          this._moveTo = this._moveTo.bind(this)
      }

    _moveTo(index) {
        LOG('index -->', index)
        const { list } = this.props  //获取到 传入的数组

        this.state.selectItem && this.state.selectItem._unSelect()
        this.state.selectItem = this.refs[index]
        this.state.selectItem && this.state.selectItem._select()

        if (list.length > maxItem) {
            let meiosis = parseInt(maxItem / 2)
            this.refs.ScrollView.scrollTo({x: (index - meiosis < 0 ? 0 : index - meiosis > list.length - maxItem ? list.length - maxItem : index - meiosis ) * this.state.itemWidth, y: 0, animated: true})
        }
    }


    componentWillReceiveProps(props) {
        const { list } = props  //获取到 传入的数组
        if (!list || list.length == 0) return

        // 计算每个标签的宽度
        let itemWidth = width / list.length

        if (list.length > maxItem) {
            itemWidth = width / maxItem
        }

        this.setState({
            itemWidth
        })
    }

    _getItems() {
        const { list, selectItem } = this.props  //获取到 传入的数组

        if (!list || list.length == 0) return []

        let items = []
        for (let index in list) {
            index = index - 0
            let dic = list[index]
            items.push(
                <Item
                    ref={index}
                    key={index}
                    isSelect={index == 0}
                    itemHeight={this.state.itemHeight}
                    itemWidth={this.state.itemWidth}
                    dic={dic}
                    onPress={() => {
                        this._moveTo(index)
                        selectItem && selectItem(index)
                    }}
                />
            )
        }



        return items
    }

    render() {
        const { style } = this.props
        return (
            <View style={[styles.view, style]}>
                <ScrollView
                    ref="ScrollView"
                    style={styles.scrollView}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    
                >
                    {
                        this._getItems()
                    }

                </ScrollView>
            </View>
        )
    }
}


class Item extends React.Component {

    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            isSelect: props.isSelect
        };

          this.timer = setTimeout(
              () =>
                  props.isSelect && props.onPress && props.onPress()
              ,
              100
          );
      }



    _unSelect() {
        this.setState({
            isSelect: false
        })
    }

    _select() {
        this.setState({
            isSelect: true
        })
    }

    render() {

        const {itemHeight, itemWidth, dic, onPress} = this.props

        return (
            <TouchableOpacity
                style={{height: itemHeight, width: itemWidth, alignItems: 'center', justifyContent:'center',backgroundColor:'#EEEEEE'}}
                onPress={() => {
                    onPress && onPress()
                    this._select()
                }}
            >
                {/* justifyContent: 主轴居中, alignItems: 次轴居中 */}

                <Text style={{color: this.state.isSelect ? 'red' : 'black'}}>{dic.NameCN}</Text>
            </TouchableOpacity>
        )
    }
}


const styles = StyleSheet.create({
    view: {
        height: 50,
        width: width,
        backgroundColor: 'white',
    },

    scrollView: {
        flex:1,
        backgroundColor: '#EEEEEE',
    }
})