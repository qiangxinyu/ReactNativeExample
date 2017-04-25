# 加载所有分类与详情页


## 1.加载全部分类新闻

我们需要做的效果是打开 `App` ，首先只加载第一页的数据，其他页面在第一次显示的时候加载数据。

我们需要一个状态来标明是不是第一次显示，给 `state` 加入 `isFirstShow: true`，我们在网络请求里给他赋值为 `false`。

在做的过程中发现一个问题，我们需要取到它的 `EndKey` 来作为下次请求的 `StartKey` ，否则可能会请求失败，给 `state` 加入 `startKey: ''` ，然后在请求到数据后赋值：

```javascript
 _onRefresh(page) {
    this.setState({
        isFirstShow: false
    })

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
            + '&startkey='
            + this.state.startKey
            +'&newkey=&index='
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
                            startKey: json.EndKey ? json.EndKey : this.state.startKey
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
```

然后返回我们的 `Home.js` ，在这里处理是否请求数据：

首先给 `NewsList` 加上 `ref`

```javascript
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
    />
)
```

然后在点击 `SegmentedView` 和滑动 `ScrollView` 的时候来进行处理：

```javascript
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
```

如果是第一次显示，那么请求数据：

```javascript
_scrollTo(index) {
    let newsList = this.refs['NewsList' + index]
    newsList.state.isFirstShow && newsList._onRefresh()
}
```


## 2.详情页

详情页进去是一个网页，我们直接写死一个网页。

创建 `NewsDetail.js`

```javascript
import React from 'react'

import {
    View,
    Text,
    StyleSheet,
    WebView
} from 'react-native'

import NavigationBar from '../Custom/NavBarCommon'

export default class NewsDetail extends React.Component {
    render() {
        return (
            <View style={styles.view}>
                <NavigationBar
                    title="详情页"
                    navigator={this.props.navigator}
                />
                <WebView
                    style={{flex:1}}
                    source={{uri: 'http://zjzywap.eastday.com/m/170425001829725.html?fr=toutiao&qid=zjxw&apptypeid=ZJZYIOS1114283782&ime=6271F554-7B2F-45DE-887E-4A336F64DEE6'}}
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
```


然后我们去 `NewsList.js` 引入：

```javascript
import NewsDetail from './NewsDetail'
```


然后我们需要进行 `push` :

```javascript
_onPress() {
    this.props.navigator && this.props.navigator.push({
        component: NewsDetail,
        params: {
            navigator: this.props.navigator, //这个并不用传入, 这里只是为了演示参数的传入
        }
    })
}
```

我们 `push` 需要用到 `navigator`， 但是的 `NewsList` 我们并没有给它传入 `navigator` ，我们需要去 `Home.js` ：

```javascript
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
```

然后进行调用


在 `renderRow` 方法内的 `CarousePicture` 以及下面的 2 个 `TouchableOpacity` 加入属性 `onPress={this._onPress}`

例如这样:

```javascript
<CarousePicture
    index={5}
    ref="ScrollView"
    rowData={rowData}
    style={{width, height: 200}}
    touchIn={this.props.touchIn}
    onPress={this._onPress}
/>
```

最后我们需要进入 `CarousePicture.js` 内的 `TouchableWithoutFeedback` 来调用回调函数:

```javascript
 <TouchableWithoutFeedback
    style={{flex:1,width, height:200, backgroundColor:'white'}}

    onPress={() => {
        this.props.onPress && this.props.onPress()
    }}
    onPressIn={() => {
        this.props.touchIn && this.props.touchIn(true)
    }}

    onPressOut={() => {
        this.props.touchIn && this.props.touchIn(false)
    }}
>
```

现在就可以 `push` 到详情页了

[项目地址](https://github.com/qiangxinyu/ReactNativeExample/tree/master/ReactNative6)
