title: StatusBar 、 NavigationBar 与 TabBar
---



## 1.React Native App 的视图结构

首先把 `setup.js` 的 `Root` 以及 布局 的代码改一下：


```javascript
class Root extends React.Component {
    render() {
        return (
            <View style={styles.container}>
					
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },

});
```




`React Native` 的所有界面都是在一个主视图上，这里的这个 `<View>` 跟 `iOS` 中的 `Window` 是同样的，这里跟 `Android` 不太一样。

当然运行在 `iOS` 和 `Android` 中还是以 `ViewController` 和 `Activity` 展示的。

## 2.StatusBar

`iOS` 和 `Android` 的 `StatusBar` 是差不多的，都是顶部那高度 20 的部分，用来显示信号、电量等系统的信息。

在 `setup.js` 中加入 `StatusBar`：

```javascript
import {
    StyleSheet,
    Text,
    View,
    StatusBar
} from 'react-native';

class Root extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <StatusBar 
                    barStyle={'light-content'}
                    backgroundColor={'#000000'}
                />
            </View>
        );
    }
}

```

`StatusBar` 的配置可以看[这里](http://reactnative.cn/docs/0.43/statusbar.html#content)，注意有些属性只针对特定平台。

这样可以设置整个 `App` 中 `StatusBar` 的样式，如果有某个页面 `A` 的 `StatusBar` 需要特殊处理，那么就在 `A` 页面加入 `StatusBar` 进行设置。


## Navigator

我们需要用 `Navigator` 来让整个 `App` 可以在页面之间跳转。

`Navigator` 和 `iOS` 的一样，都是对页面进行 `push` 和 `pop` ，跟 `Android` 的 `NavigationView` 不是一个东西。

官方文档在[这里](http://reactnative.cn/docs/0.43/navigator.html#content)


现在在 `App` 文件夹内创建一个新的文件 `App.js` ：

```javascript
'use strict';


import React from 'react'

import {
    StyleSheet,
    View,
    Text

} from 'react-native';

export default class App extends React.Component {

    render() {
        return (
            <View style={styles.view}>
		<Text>main</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center'

    },
});


```



然后在 `setup` 内 `StatusBar` 下面加入 `Navigator` :
 

```javascript
import App from './App'


<Navigator
    initialRoute={{ component: App }}

    style={{flex:1}}
    renderScene={(route, navigator) => {
        BackAndroid.addEventListener('hardwareBackPress', function() {
            if(navigator == null){
                return false;
            }
            if(navigator.getCurrentRoutes().length === 1){
                return false;
            }
            navigator.pop();
            return true;
        });

        let Component = route.component;
        return <Component {...route.params} navigator={navigator}/>
        //  上面的route.params 是为了方便后续界面间传递参数用的
    }}
/>

```

其中 `initialRoute` 设置了 `component` ，是最底层的第一个页面。

然后 `renderScene` 控制 `push` 的时候做哪些操作，这里的 `BackAndroid.addEventListener` 是监听了 `Android` 的物理返回按键。

现在运行可以看见页面中间有个 `main` ：

<img src="https://github.com/qiangxinyu/ReactNativeExample/blob/master/ReactNative2/main.png?raw=true" width=300 />


你可能会发现为什么没 `NavigationBar` 呢，我们后面再加。

## 3.tab-navigator

官方并没有 `TabBar` ，我们使用一个第三方 [react-native-tab-navigator](https://github.com/expo/react-native-tab-navigator)

在项目根目录执行命令

```
npm install react-native-tab-navigator --save
```

安装完成后在 `App.js` 加入 `TabNavigator`:


```

const home_key = 'home'
const satin_key = 'satin'
const setting_key = 'setting'


import Home from './Home/Home'
import Satin from './Satin/Satin'
import Setting from './Setting/Setting'


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

```

配置也比较易懂。

另外创建 3 个文件 `Home.js` 、 `Satin.js` 和 `Setting.js` 

```javascript
import React from 'react'

import {
    View,
    StyleSheet
} from 'react-native'


export default class Satin extends React.Component {
    render() {
        return (
            <View style={styles.view}>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    view: {
        flex:1,
        backgroundColor: 'orange'
    }
})

```

可以给每个设置不同的颜色，这样点击界面切换也很明显。





<img src="https://github.com/qiangxinyu/ReactNativeExample/blob/master/ReactNative2/tab.png?raw=true" width=300 />





## 4.NavigationBar

同意官方也没有提供 `NavigationBar`，我们需要自定义一个。

然后在 `Home.js` 、  `Satin.js` 和 `Setting.js` 加入


```javascript


import React from 'react'

import {
    View,
    StyleSheet
} from 'react-native'

import NavigationBar from '../Custom/NavBarCommon'


export default class Home extends React.Component {
    render() {
        return (
            <View style={styles.view}>
                <NavigationBar
                    title="首页"
                    unLeftImage={true}
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

![navibar](https://github.com/qiangxinyu/ReactNativeExample/blob/master/ReactNative2/navibar.png?raw=true)


