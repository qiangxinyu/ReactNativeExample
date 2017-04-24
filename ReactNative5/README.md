#上下拉刷新

## 1.下拉刷新 

下拉刷新我们使用 `React Native` 提供的组件 `RefreshControl`，去 `NewsList.js` 的 `ListView` 添加：

```javascript
<ListView
    style={{flex:1, backgroundColor:'white'}}
    dataSource={this.state.dataSource} //设置数据源
    renderRow={this.renderRow} //设置cell
    removeClippedSubviews={false}
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
```

`ListView` 新加了一个属性 `removeClippedSubviews`。

[原因](https://github.com/facebook/react-native/issues/1831)

我们需要给 `state` 添加一个 `key` ： `isRefreshing: false` ，然后在网络请求时对它进行处理，（我这里省略了一些代码，要不然太长）

```javascript
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
        }
        let url = ''

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
                    ..... 数据的处理
                    })
                    .catch((e) => {
                    })
            })
            .catch((error) => {
                this._endRefresh()
            })
    }
}
```

现在运行程序就可以尽情地下拉刷新了。


## 2.上拉加载

上拉加载我们利用 `ListView` 的 [onEndReached](http://reactnative.cn/docs/0.43/listview.html#onendreached) 方法来进行加载新数据，使用 [renderFooter](http://reactnative.cn/docs/0.43/listview.html#renderfooter) 来进行显示状态。


这样严格的来说并不算上拉加载，只是滑动到底部自动进行加载。



首先在 `ListView` 加入：

```javascript
onEndReached={ this._toEnd }
onEndReachedThreshold={10}
renderFooter={ this._renderFooter }
```

记得进行绑定

```javascript
this._toEnd = this._toEnd.bind(this)
this._renderFooter = this._renderFooter.bind(this)

```

实现

```javascript
_toEnd() {
    if (this.state.isRefreshing) return  
    this._onRefresh()
}

_renderFooter() {
    return (
        <View style={{width, height: 40, backgroundColor: '#FFFFFF', alignItems:'center', justifyContent:'center'}}>
            <Text>正在加载更多...</Text>
        </View>
    )
}
```

现在我们需要对数据进行处理，保存请求到的数据，再下一页数据请求到后加入数组，我们给 `state` 加入一个 `data: []`，然后对请求到的数据进行处理：

```javascript
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

this.setState({
    dataSource: this.state.dataSource.cloneWithRows(newData),
    data: newData,
    page: this.state.page + (list.length == maxCount ? 1 : 0)
})

```

这里的 `maxCount` 是为了方便管理的，定义为：

```javascript
const maxCount = 20
```

请求的 `url` 改为 :

```javascript
let url = 'http://api.iapple123.com/newspush/list/index.html?clientid=1114283782&v=1.1&type='
        + this.props.dic.NameEN
        + '&startkey=3001_9223370543834829200_537d522d125e32ae&newkey=&index='
        + page
        + '&size='
        + maxCount
        + '&ime=6271F554-7B2F-45DE-887E-4A336F64DEE6&apptypeid=ZJZYIOS1114283782'
```

现在可以运行看看效果了。

我们会发现一开始在加载第一页数据的时候 `Footer` 也显示了出来，我们需要控制它的显示与隐藏，给 `state` 加入 `showFooter: false` ，在第一页数据加载完成并且返回的数组元素个数等于 `maxCount` 则赋值为 `true`

```javascript
this.setState({
    dataSource: this.state.dataSource.cloneWithRows(newData),
    data: newData,
    page: this.state.page + (list.length == maxCount ? 1 : 0),
    showFooter: this.state.showFooter ? true :  (list.length == maxCount ? true : false)
})

```

```javascript
_renderFooter() {

    if (!this.state.showFooter) {
        return null
    }
    return (
        <View style={{width, height: 40, backgroundColor: '#FFFFFF', alignItems:'center', justifyContent:'center'}}>
            <Text>正在加载更多</Text>
        </View>
    )
}
```

现在 `Footer` 可以正确的显示隐藏了，但是我们还需要状态来改变 `Footer` 显示的文字，如果还有更多数据，那我们看见 `Footer` 的时候它的状态显然是正在加载更多，如果没有更多数据了，那我们就显示 已加载全部 。

给 `state` 加入 `hasMore: true` ，我们先假设它还有更多

然后在请求到数据进行处理:

```javascript
let hasMore = list.length == maxCount ? true : false

this.setState({
    dataSource: this.state.dataSource.cloneWithRows(newData),
    data: newData,
    page: this.state.page + (hasMore ? 1 : 0),
    showFooter: this.state.showFooter ? true :  (hasMore ? true : false),
    hasMore,
})
```

然后处理 `renderFooter`:

```javascript
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
```

我们还需要再 `toEnd` 的判断条件加入 `hasMore` 来避免显示没有更多数据的时候拉倒底部还会进行请求数据：

```javascript
_toEnd() {
    if (this.state.isRefreshing || this.state.hasMore) return
    this._onRefresh()
}
```

到现在上下拉刷新已经完成

这个上拉刷新比较简陋，你也可以放 `gif图` 或者使用 [动画](http://reactnative.cn/docs/0.43/animations.html#content) 来让界面变好看点。

