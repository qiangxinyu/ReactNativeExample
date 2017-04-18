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
                  itemHeight: props.style.height,
              };
          }

          this._getItems = this._getItems.bind(this)
      }

    _getItems() {
        const { list } = this.props

        if (!list || list.length == 0) return []

        let itemWidth = width / list.length

        if (list.length > maxItem) {
            itemWidth = width / maxItem
        }


        let items = []
        for (let index in list) {
            let dic = list[index]
            items.push(
                <Item
                    ref={index}
                    key={index}
                    isSelect={index == 0}
                    itemHeight={this.state.itemHeight}
                    itemWidth={itemWidth}
                    dic={dic}
                    onPress={() => {
                        this.state.selectItem && this.state.selectItem._unSelect()
                        this.state.selectItem = this.refs[index]

                        if (list.length > maxItem) {

                            let meiosis = parseInt(maxItem / 2)

                            this.refs.ScrollView.scrollTo({x: (index - meiosis < 0 ? 0 : index - meiosis > list.length - maxItem ? list.length - maxItem : index - meiosis) * itemWidth, y: 0, animated: true})

                        }

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
                    style={{flex:1, backgroundColor: '#EEEEEE',flexDirection: 'row'}}
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
              () => { props.onPress && props.isSelect && props.onPress() },
              100
          );
      }
    componentWillUnmount() {
        // 如果存在this.timer，则使用clearTimeout清空。
        // 如果你使用多个timer，那么用多个变量，或者用个数组来保存引用，然后逐个clear
        this.timer && clearTimeout(this.timer);
    }
    _unSelect() {
        this.setState({
            isSelect: false
        })
    }

    render() {
        const {itemWidth,itemHeight, index, dic,onPress} = this.props

        return (
            <TouchableOpacity
                key={index}
                style={{height: itemHeight, width: itemWidth, alignItems: 'center', justifyContent:'center',backgroundColor:'#EEEEEE'}}
                onPress={() => {
                    onPress && onPress()
                    this.setState({
                        isSelect: true
                    })
                }}
            >
                <Text  style={{color: this.state.isSelect ? 'red' : 'black'}}>{dic.NameCN}</Text>
            </TouchableOpacity>
        )
    }
}


const styles = StyleSheet.create({
    view: {
        height: 50,
        backgroundColor: 'white',
    }
})