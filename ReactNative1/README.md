
最近刚完成一个 `React Native` 的项目，踩了无数坑，去年折腾过几周，后来因为有两个 `iOS` 项目就没有再折腾，当时想要写一个主文件，分别给 `Android` 和 `iOS` 引用，但是弄了好久也不会弄，也下载了 [`f8app`](https://github.com/fbsamples/f8app) 看了，不过完全看不懂，就这样放弃了。

今年 3 月中旬正好公司有个项目只需要前端，而且公司没有 `Android` 开发，也想弄混合开发，于是正好我拿这个项目去练手。

从上面的描述也看出来我是一个 `iOS` 开发，对于有移动开发基础的人来说做 `React Native` 开发还是比较好上手的，前端的话更容易，只是刚开始入门比较费劲，也找不到个能问的人。总的下来我的建议还是如果卡在某个地方很久很烦躁不想继续学了，那么放一放，放几天或者一两周，再继续学，不要轻易放弃，入门后就轻松多了。


## 1.说明

这系列文章主要还是针对有编程经验的开发者，起码掌握一门主流的编程语言。


开发平台： Mac OS

IDE: WebStorm

这里我并不会很详细的一步一步的讲解，详细的教程可以看[官方教程](http://reactnative.cn/docs/0.43/getting-started.html)，这里主要是记录一些我在学习过程中遇到的疑难杂症，如果你碰到了或许可以帮你一把。



## 2.基础

首先既然看这个文章，那么默认你已经知道什么是 [React Native](http://reactnative.cn/) 以及是干什么的，还有你需要会一些 `JavaScript` ，如果你还不会 `JavaScript `，那么推荐 `廖雪峰老师` 的 [JavaScript教程](http://www.liaoxuefeng.com/wiki/001434446689867b27157e896e74d51a89c25cc8b43bdb3000) 和 `阮一峰老师` 的 [ECMAScript 6 入门](http://es6.ruanyifeng.com/#README)。

官方文档永远是必看的，对于初学者来说不会的先去官方文档找。[React Native中文网](http://reactnative.cn/) 对于英文不好的同学来说是首选，比如我自己。




有问题也可以去 `React Native` 的 [GitHub地址](https://github.com/facebook/react-native) 的 `issues` 找。

## 3.搭建开发环境

这部分比较简单，按着 [官方教程](http://reactnative.cn/docs/0.43/getting-started.html) 搭建即可，但是在运行命令的时候可能会出各种问题，这个时候只能靠 `Baidu` 和 `Google` 了，我是一次成功的，所以也不知道会有什么问题，这里也不做过多说明了。

希望没人在这一步就放弃了。



## 4.iOS 和 Android 调用统一资源

新创建的项目 `iOS` 和 `Android` 代码是分开的，分别在 `index.ios.js` 和 `index.android.js` 中，这是两个平台的入口。

顶部的各种 `import` 是引入的各种资源：

```javascript
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
```

接下来是 `React` 的语法，创建了一些视图:

```javascript
export default class ReactNative1 extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit index.ios.js
        </Text>
        <Text style={styles.instructions}>
          Press Cmd+R to reload,{'\n'}
          Cmd+D or shake for dev menu
        </Text>
      </View>
    );
  }
}
```

然后是布局的代码：

```javascript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
```

最后是注册，每个平台只需要注册一次：

```javascript
AppRegistry.registerComponent('ReactNative1', () => ReactNative1);
```

上面的那一大堆不用去管，我们就从这个方法入手，这个方法传入了 2 个参数，第一个是 `App` 的标志，这个你们应该也明白不能随便改，第二个参数是一个匿名方法，调用这个方法会返回 `ReactNative1` ，就是上面的 `React` 创建的类，那么要让 `iOS` 和 `Android` 引用同一个资源，只需要这里返回给同一个类即可。


新创建一个文件夹 `App` 或者随便啥，我们写的所有 `JS` 文件都放这里，方便管理。

然后在 `App` 内创建一个 `setup.js`，这时候目录看起来是这样子:

![目录](https://github.com/qiangxinyu/ReactNativeExample/blob/master/ReactNative1/directory.jpeg?raw=true)

然后在把 `index.ios.js` 的 `import` 、 `React` 和 `布局` 部分的内容复制过来，然后加入两句代码，现在 `setup.js` 文件是这样的：

```javascript
import React from 'react'
import {
    StyleSheet,
    Text,
    View
} from 'react-native';


function setup(): ReactClass<{}> {

    //这里做一些注册第三方等App初始化需要的操作

    return Root
}

class Root extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>
                    Welcome to React Native!
                </Text>
                <Text style={styles.instructions}>
                    To get started, edit index.android.js
                </Text>
                <Text style={styles.instructions}>
                    Double tap R on your keyboard to reload,{'\n'}
                    Shake or press menu button for dev menu
                </Text>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});


module.exports = setup
```

我这里是直接导入了 `import React from 'react'` ，那么在创建 `React类` 的时候就需要 `extends React.Component` ，我是习惯这种写法，如果你觉得官方的写法比较好，那么就按着官方的写就行。

然后修改 `index.ios.js` 和 `index.android.js` ,修改成一模一样：

```javascript
import {
    AppRegistry,
} from 'react-native';

import setup from './App/setup'

AppRegistry.registerComponent('ReactNative1', setup);

```

如果已经在运行，那么 `iOS模拟器` 按 `command + R` 刷新，`Android模拟器` 双击 `R` 刷新。

如果没有在运行那么运行 `react-native run-ios` 和 `react-native run-android` 查看效果。

如果运行的时候遇见这个错误：

![firstError](https://github.com/qiangxinyu/ReactNativeExample/blob/master/ReactNative1/firstError.png?raw=true)

那么需要关闭 `react-native` 启动的服务，重新启动。

![iterm](https://github.com/qiangxinyu/ReactNativeExample/blob/master/ReactNative1/iterm.jpeg?raw=true)


如果一切正常，那么尝试修改 `setup.js` 中 `Text` 标签中的文字，刷新 `iOS` 和 `Android` 看看效果。


<img src="https://github.com/qiangxinyu/ReactNativeExample/blob/master/ReactNative1/ios.png?raw=true" width=300/><img src="https://github.com/qiangxinyu/ReactNativeExample/blob/master/ReactNative1/android.png?raw=true" width=300/>

如果你坚持到了这里，那么恭喜你已经初步掌握了 `react native` 。

[示例项目地址](https://github.com/qiangxinyu/ReactNativeExample/tree/master/ReactNative1)

## 参考链接

[f8app](https://github.com/fbsamples/f8app)

[React Native中文网](http://reactnative.cn/docs/0.43/getting-started.html)

[https://github.com/facebook/react-native/issues/6613](https://github.com/facebook/react-native/issues/6613)