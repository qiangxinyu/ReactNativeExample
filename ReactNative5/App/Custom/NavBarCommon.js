import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    Platform,
    TouchableOpacity,
    Dimensions,
} from 'react-native';

const {width, height} = Dimensions.get('window')


class NavigationBar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            backImage: require('../Images/root/back@3x.png')
        }
    }


    render() {
        // leftTitle和leftImage 优先判断leftTitle (即 文本按钮和图片按钮优先显示文本按钮)
        const {title, leftTitle, unLeftImage, leftAction, rightTitle, rightImage, rightAction, navigator} = this.props;

        return (
            <View style={[styles.barView, this.props.style]}>
                {
                    leftTitle
                        ?
                        <TouchableOpacity style={styles.leftNav} onPress={ ()=>{leftAction()} }>
                            <View style={{alignItems: 'center'}}>
                                <Text style={styles.barButton}>{leftTitle}</Text>
                            </View>
                        </TouchableOpacity>
                        :
                        (
                            !unLeftImage
                                ?
                                <TouchableOpacity style={styles.leftNav} onPress={ ()=>{
                                                    leftAction ?
                                                        leftAction() :
                                                        navigator.pop()
                                                 } }>
                                    <View style={{alignItems: 'center', left: -2}}>
                                        <Image source={ this.state.backImage }/>
                                    </View>
                                </TouchableOpacity>
                                : null
                        )
                }
                {
                    title ?
                        <Text style={styles.title}>{title || ''}</Text>
                        : null
                }
                {
                    rightTitle ?
                        <TouchableOpacity style={styles.rightNav} onPress={ ()=>{rightAction()} }>
                            <View style={{alignItems: 'center'}}>
                                <Text style={styles.barButton}>{rightTitle}</Text>
                            </View>
                        </TouchableOpacity>
                        : (rightImage ?
                            <TouchableOpacity style={styles.rightNav} onPress={ ()=>{rightAction()} }>
                                <View style={{alignItems: 'center'}}>
                                    <Image source={ rightImage }/>
                                </View>
                            </TouchableOpacity>
                            : null
                    )
                }


            </View>
        )
    }
}

const styles = StyleSheet.create({
    barView: {
        height: Platform.OS === 'android' ? 44 : 64,
        backgroundColor: '#1d1d21',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    backgroundImage: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        flex: 1,
    },

    showView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginTop: 0,
        height: 44,
    },
    title: {
        color: 'white',
        backgroundColor: 'rgba(0,0,0,0)',
        marginTop: Platform.OS === 'ios' ? 20 : 0,

        fontSize: 18.0,
    },
    centerImage: {
        marginTop: Platform.OS === 'ios' ? 20 : 0,

    },
    leftNav: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 20 : 0,
        bottom: 0,
        left: 0,
        justifyContent: 'center',
        width: 50,

    },
    rightNav: {
        position: 'absolute',
        right: 8,
        top: 8 + (Platform.OS === 'ios' ? 20 : 0),
        bottom: 8,
        justifyContent: 'center',
    },
    barButton: {
        color: 'white',
        fontSize: 18
    },
})


export default NavigationBar