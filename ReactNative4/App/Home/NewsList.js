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
    ScrollView
} from 'react-native'


const {width, height} = Dimensions.get('window')


import CarousePicture from './CarousePicture'


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
            rn: 1,
            dataSource: new ListView.DataSource({
                getRowData: getRowData,
                rowHasChanged: (r1, r2) => r1 !== r2,
            }),
        };

        this.renderRow = this.renderRow.bind(this)

    }

    componentDidMount() {
        if (!this.props.isRequest) return
        this._onRefresh()
    }

    _onRefresh(page) {
        if (this.props.dic) {
            let url = 'http://api.iapple123.com/newspush/list/index.html?clientid=1114283782&v=1.1&type='
                + this.props.dic.NameEN
                + '&startkey=&newkey=&index='
                + (page ? page : this.state.page)
                + '&size=20&ime=6271F554-7B2F-45DE-887E-4A336F64DEE6&apptypeid=ZJZYIOS1114283782&rn='
                + this.state.rn

            LOG('url=》', url)
            fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            })
                .then((res) => {

                    res.json()
                        .then((json) => {

                            let list = json.NewsList

                            let swipers = []
                            let news = []

                            for (let index in list) {
                                let dic = list[index]
                                dic.HotNews == 1 ? swipers.push(dic) : news.push(dic)
                            }

                            news.splice(0, 0, swipers)


                            this.setState({
                                dataSource: this.state.dataSource.cloneWithRows(news)
                            })
                        })
                        .catch((e) => {
                            LOG('GET ERROR then =>', url, e)

                        })
                })
                .catch((error) => {

                    LOG('GET ERROR=>', url, '==>', error)
                })
        }
    }


    _getSwiperItems(list) {

        let arr = []

        for (let index in list) {
            let dic = list[index]
            arr.push(
                <TouchableWithoutFeedback
                    key={index}
                    style={{flex:1, backgroundColor:'white'}}
                >
                    <Image
                        resizeMode="cover"
                        style={{width, height:200, backgroundColor:'white', justifyContent:'flex-end'}}
                        source={{uri:dic.LargeImagesList[0].ImgPath }}
                    >
                        <Text
                            style={{fontSize: 12, color: 'white', alignSelf:'center', backgroundColor: 'rgba(0,0,0,0)', marginBottom: 5}}>{dic.Title}</Text>
                    </Image>
                </TouchableWithoutFeedback>
            )
        }

        return arr
    }


    renderRow(rowData, rowID, highlightRow) {
        LOG('rowData ==>', rowID, Object.prototype.toString.call(rowData))

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