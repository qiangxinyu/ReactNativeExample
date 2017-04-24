/**
 * Created by qiangxinyu on 2017/4/19.
 */


import React from 'react'
import {
    View,
    Text,
    ListView,
    Image,
    StyleSheet,
    Dimensions,
    RefreshControl,
    TouchableOpacity,
    TouchableWithoutFeedback,
    ScrollView,

} from 'react-native'


const {width, height} = Dimensions.get('window')


import CarousePicture from './CarousePicture'

const maxCount = 20


export default class NewsList extends React.Component {

    // 构造
    constructor(props) {
        super(props);

        var getRowData = (dataBlob, sectionID, rowID) => {

            return dataBlob[sectionID][rowID]
        };
        // 初始状态
        this.state = {

            page: 1,
            dataSource: new ListView.DataSource({
                getRowData: getRowData,
                rowHasChanged: (r1, r2) => r1 !== r2,
            }),
            data: [],


            isRefreshing: false,

            showFooter: false,

            hasMore: true
        };

        this.renderRow = this.renderRow.bind(this)
        this._toEnd = this._toEnd.bind(this)
        this._renderFooter = this._renderFooter.bind(this)

    }

    componentDidMount() {
        if (!this.props.isRequest) return
        this._onRefresh()
    }

    _begainRefresh() {
        this.setState({
            isRefreshing: true
        })
    }
    _endRefresh() {
        this.setState({
            isRefreshing: false
        })
    }


    _onRefresh(page) {
        if (this.props.dic) {

            this._begainRefresh()

            if (page == 1) {
                this.setState({
                    page
                })
            } else  {
                page = this.state.page
            }

            let url = 'http://api.iapple123.com/newspush/list/index.html?clientid=1114283782&v=1.1&type='
                + this.props.dic.NameEN
                + '&startkey=3001_9223370543834829200_537d522d125e32ae&newkey=&index='
                + page
                + '&size='
                + maxCount
                + '&ime=6271F554-7B2F-45DE-887E-4A336F64DEE6&apptypeid=ZJZYIOS1114283782'

            LOG('url=》', url)
            fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            })
                .then((res) => {

                    this._endRefresh()

                    res.json()
                        .then((json) => {

                            let list = json.NewsList

                            let swipers = []
                            let news = []

                            if (page == 1) {
                                for (let index in list) {
                                    let dic = list[index]
                                    index < 4 ? swipers.push(dic) : news.push(dic)
                                }
                                news.splice(0, 0, swipers)
                            } else {
                                news = list
                            }

                            let newData = this.state.data.concat(news)

                            let hasMore = list.length == maxCount ? true : false

                            this.setState({
                                dataSource: this.state.dataSource.cloneWithRows(newData),
                                data: newData,
                                page: this.state.page + (hasMore ? 1 : 0),
                                showFooter: this.state.showFooter ? true : (hasMore ? true : false),
                                hasMore,
                            })
                        })
                        .catch((e) => {
                            LOG('GET ERROR then =>', url, e)

                        })
                })
                .catch((error) => {
                    this._endRefresh()
                    LOG('GET ERROR=>', url, '==>', error)
                })
        }
    }


    _toEnd() {
        if (this.state.isRefreshing || this.state.hasMore) return
        this._onRefresh()
    }

    _renderFooter() {

        if (!this.state.showFooter) {
            return null
        }
        return (
            <View style={{width, height: 40, backgroundColor: '#FFFFFF', alignItems:'center', justifyContent:'center'}}>
                <Text>{this.state.hasMore ? '正在加载更多...' : '已加载全部'}</Text>
            </View>
        )
    }

    renderRow(rowData, rowID, highlightRow) {

        if (Object.prototype.toString.call(rowData) === '[object Array]') {
            return (
                <CarousePicture
                    index={5}
                    ref="ScrollView"
                    rowData={rowData}
                    style={{width, height: 200}}
                    touchIn={this.props.touchIn}
                >
                </CarousePicture>
            )
        }

        let imagesList = rowData.ImagesList

        if (imagesList && imagesList.length == 1) {
            return (
                <TouchableOpacity style={{width,  backgroundColor:'white'}}>
                    <View
                        style={{width, backgroundColor:'white', flexDirection:'row', justifyContent:'space-between', flex:1}}>
                        <Image
                            resizeMode="cover"
                            style={{marginTop: 10, marginBottom:10, marginLeft: 10, width: 80, height: 80, backgroundColor:'#EEEEEE'}}
                            source={{uri:imagesList[0].ImgPath}}
                        />

                        <View
                            style={{ marginRight: 10,backgroundColor:'white', marginTop: 10, height: 80, width: width - 110}}
                        >
                            <Text>{rowData.Title}</Text>
                            <View style={{flex:1, flexDirection: 'row', justifyContent: 'space-between'}}>
                                <Text style={{marginTop:10, fontSize: 13, color: '#999999'}}>{rowData.Source}</Text>
                                <Text style={{marginRight:0,marginTop:10,fontSize: 13, color: '#999999'}}>{rowData.PublishTime}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{width, height:1, backgroundColor: '#EEEEEE'}}></View>
                </TouchableOpacity>
            )
        }

        let images = []

        for (let index in imagesList) {
            let dic = imagesList[index]
            images.push(
                <Image
                    resizeMode="cover"
                    key={index}
                    style={{marginRight: 10, marginLeft: index == 0 ? 10 : 0, marginTop:10, marginBottom: 10,flex:1, height: 90}}
                    source={{uri:dic.ImgPath}}
                />
            )
        }

        return (
            <TouchableOpacity style={{width,  backgroundColor:'white'}}>

                <View style={{width,backgroundColor:'white'}}>
                    <Text style={{marginLeft: 10, marginTop: 10}}>{rowData.Title}</Text>
                </View>
                <View style={{flexDirection:'row'}}>
                    {images}
                </View>
                <View style={{flex:1, flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={{marginLeft: 10, marginBottom: 10,fontSize: 13, color: '#999999'}}>{rowData.Source}</Text>
                    <Text style={{marginRight:10,fontSize: 13, marginBottom: 10,color: '#999999'}}>{rowData.PublishTime}</Text>
                </View>
                <View style={{width, height:1, backgroundColor: '#EEEEEE'}}></View>
            </TouchableOpacity>
        )
    }

    render() {
        const {style} = this.props
        return (
            <View style={[styles.view,style]}>
                <ListView
                    style={{flex:1, backgroundColor:'white'}}
                    dataSource={this.state.dataSource} //设置数据源
                    renderRow={this.renderRow} //设置cell
                    removeClippedSubviews={false}

                    onEndReached={ this._toEnd }
                    onEndReachedThreshold={10}
                    renderFooter={ this._renderFooter }

                    refreshControl={
                          <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={() => this._onRefresh(1)}
                            tintColor="#999999"
                            title="加载中..."
                            titleColor="#999999"
                            colors={['#ff0000', '#00ff00', '#0000ff']}
                            progressBackgroundColor="#ffff00"
                          />
                    }
                />
            </View>
        )
    }
}


const styles = StyleSheet.create({
    view: {
        flex: 1,
        backgroundColor: 'white'
    }
})