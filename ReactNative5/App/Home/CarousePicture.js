/**
 * Created by qiangxinyu on 2017/4/20.
 */


import React from 'react'

import {
    View,
    Text,
    ListView,
    Image,
    Dimensions,
    TouchableWithoutFeedback,
    StyleSheet,
    Platform
} from 'react-native'

var PropTypes = React.PropTypes

const {width, height} = Dimensions.get('window')

export default class CarousePicture extends React.Component {
    static propTypes = {

        style: View.propTypes.style,
        showsHorizontalScrollIndicator: PropTypes.bool,


        loop: PropTypes.bool,
        autoplay: PropTypes.bool,
        autoplayTimeout: PropTypes.number,

        index: PropTypes.number,


        showsPagination: PropTypes.bool,
        renderPagination: PropTypes.func,

        dotStyle: PropTypes.object,
        activeDotStyle: PropTypes.object,

        dotColor: PropTypes.string,
        activeDotColor: PropTypes.string,

    }

    /**
     * Default props
     * @return {object} props
     * @see
     */

    static defaultProps = {
        showsHorizontalScrollIndicator: false,
        showsPagination: true,

        loop: true,
        autoplay: true,
        autoplayTimeout: 2500,

        index: 0,
    }

    autoplayTimer = null
    moveTimer = null

    // 构造
    constructor(props) {
        super(props);
        // 初始状态

        this.state = {
            dataSource: new ListView.DataSource({
                getRowData: (dataBlob, sectionID, rowID) => dataBlob[sectionID][rowID],
                rowHasChanged: (r1, r2) => r1 !== r2,
            }),

            index: props.index,
            isMove: false,

            newArr: [],

            selectDoc: null

        };

        this.renderRow = this.renderRow.bind(this)
    }

    shouldComponentUpdate(nextProps, nextState) {

        if (this.state.newArr !== nextState.newArr) {
            return true
        }

        return false
    }

    componentDidMount() {
        let arr = [].concat(this.props.rowData)

        if (arr) {
            let index = this.state.index

            if (this.props.loop && arr.length > 1) {

                if (this.state.index <= 1 || this.state.index > arr.length - 1) {
                    index = 1
                }

                let first = arr[0]
                let last = arr[arr.length - 1]

                arr.splice(0, 0, last)
                arr.splice(arr.length, 0, first)



            }

            if (index > arr.length - 1) {
                index = 0
            }

            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(arr),
                newArr: arr,
                index
            })

            this._moveDot(this.props.loop ? index - 1 : index)

            if (Platform.OS === 'ios') {
                this.refs.ListView.scrollTo({x: width * index, y: 0, animated: false})

            } else  {
                this.timer = setTimeout(() => {
                    this.refs.ListView.scrollTo({x: width * index, y: 0, animated: false})

                },50)
            }

        }

        this._createTimes(arr)
    }

    _createTimes(arr) {
        if (this.props.autoplay && arr.length > 1) {
            this.autoplayTimer = setInterval(() => {
                if (this.state.isMove) return
                let index = this.state.index
                index++

                this.refs.ListView.scrollTo({x: width * index, y: 0, animated: true})
                this.setState({index})


                Platform.OS !== 'ios' && this.__onMomentumScrollEnd(null, index)

            }, this.props.autoplayTimeout)
        } else {
            this._clearTimes()
        }
    }

    __onMomentumScrollEnd(e, i) {

        this.state.isMove && this._createTimes(this.state.newArr)


        if (this.state.newArr.length > 1) {
            let index = e ? parseInt(e.nativeEvent.contentOffset.x / width) : i

            let docIndex = index

            if (this.props.loop) {
                if (index == this.state.newArr.length - 1) {
                    index = 1
                }

                if (index == 0) {
                    index = this.state.newArr.length - 2
                }
                docIndex = index - 1


            } else {

                docIndex = index
                this._moveDot(docIndex)

                if (this.props.autoplay
                    && index >= this.state.newArr.length - 1
                ) {
                    index = -1
                    this.setState({index})
                    return
                }
            }

            this._moveDot(docIndex)
            this.moveTimer = setTimeout(() => {
                this.refs.ListView.scrollTo({x: width * index, y: 0, animated: Platform.OS !== 'ios'})
                this.setState({index})
            }, 100)
        }
    }

    _clearTimes() {
        this.autoplayTimer && clearInterval(this.autoplayTimer);
        this.moveTimer && clearTimeout(this.moveTimer);
        this.timer && clearTimeout(this.timer)
    }

    componentWillUnmount() {
        // 如果存在this.timer，则使用clearTimeout清空。
        // 如果你使用多个timer，那么用多个变量，或者用个数组来保存引用，然后逐个clear
        this._clearTimes()


        LOG('componentWillUnmount --->')
    }


    renderPagination() {
        if (this.state.total <= 1) return null

        let dots = []
        const ActiveDot = this.props.activeDot || <View style={[
                styles.doc,
                {backgroundColor: this.props.activeDotColor || 'white'},
                this.props.activeDotStyle]}/>

        const Dot = this.props.dot || <View style={[
                styles.doc,
                {backgroundColor: this.props.dotColor || 'black',},
                this.props.dotStyle ]}/>

        if (!this.props.rowData) return <View/>
        for (let i = 0; i < this.props.rowData.length; i++) {
            dots.push(i == (this.props.loop ? this.state.index - 1 : this.state.index)
                ? React.cloneElement(ActiveDot, {key: i, ref: 'doc' + i})
                : React.cloneElement(Dot, {key: i,ref: 'doc' + i})
            )
        }

        return (
            <View pointerEvents='none' style={[styles.pagination]}>
                {dots}
            </View>
        )
    }


    _moveDot(index) {


        this.state.selectDoc && this.state.selectDoc.setNativeProps({style:[styles.doc,{backgroundColor:'black'},this.props.dotStyle]})
        let ref = 'doc' + index

        let doc = this.refs[ref]

        this.state.selectDoc = doc

        this.state.selectDoc.setNativeProps({style:[styles.doc,{backgroundColor:'white'},this.props.dotStyle]})
    }


    renderRow(rowData, rowID, highlightRow) {

        return (
            <TouchableWithoutFeedback
                style={{flex:1,width, height:200, backgroundColor:'white'}}

                onProgress={() => {
                    LOG('onProgress')
                }}
                onPressIn={() => {
                    this.props.touchIn && this.props.touchIn(true)


                }}

                onPressOut={() => {
                    this.props.touchIn && this.props.touchIn(false)
                }}
            >
                <Image
                    resizeMode="cover"
                    style={{flex:1,width, height:200, backgroundColor:'white', justifyContent:'flex-end'}}
                    source={{uri:rowData.ImagesList[0].ImgPath }}
                >
                    <Text
                        style={{fontSize: 12, color: 'white', alignSelf:'center', backgroundColor: 'rgba(0,0,0,0)', marginBottom: 5}}>{rowData.Title}</Text>
                </Image>
            </TouchableWithoutFeedback>
        )
    };


    render() {
        return (
            <View style={[{flex:1, backgroundColor: 'white'},this.props.style]}>
                <ListView
                    ref="ListView"
                    style={[{flex:1, backgroundColor: 'white'}]}
                    dataSource={this.state.dataSource} //设置数据源
                    renderRow={this.renderRow} //设置cell
                    horizontal={true}
                    showsHorizontalScrollIndicator={this.props.showsHorizontalScrollIndicator}
                    pagingEnabled={true}

                    onScrollBeginDrag={e => {
                    this._clearTimes()
                    this.setState({isMove: true})
                }}

                    onMomentumScrollEnd={e => {
                   this.setState({isMove: false})
                   this.__onMomentumScrollEnd(e)
                }}

                >

                </ListView>
                {this.props.showsPagination && (this.props.renderPagination
                    ? this.props.renderPagination(this.state.index, this.state.newArr.length, this)
                    : this.renderPagination())}
            </View>
        )
    }
}


const styles = StyleSheet.create({
    pagination: {
        position: 'absolute',
        bottom: 25,
        left: 0,
        right: 0,

        flexDirection: 'row',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent'
    },


    doc: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginLeft: 3,
        marginRight: 3,
        marginTop: 3,
        marginBottom: 3,
    }
})

