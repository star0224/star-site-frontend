import React, {Component} from 'react';
import axios from "axios";
import {notification} from "antd";

class ViewsMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            maxValue: 0
        }
    }

    componentDidMount() {
        axios.get(global.constants.server + "/views/province")
            .then(res => {
                res = JSON.parse(res.data)
                if (res.status === 1) {
                    let provinces = res.data
                    provinces.forEach(item => {
                        item.name = item.name.replace('省', '')
                        item.name = item.name.replace('市', '')
                        item.name = item.name.replace('自治区', '')
                        if (item.value > this.state.maxValue) {
                            this.setState({
                                maxValue: item.value
                            })
                        }
                    })
                    this.setState({
                        provinces
                    })
                    console.log(this.state.provinces)
                    this.generateMap()
                } else {
                    notification.open({
                        message: '请求失败',
                        description: '服务器返回信息： ' + res.msg
                    })
                }
            }).catch(e => {
            notification.open({
                message: '请求失败',
                description: '服务器无响应：' + e,
            });
        })
    }

    generateMap = () => {
        const echarts = require('echarts');
        const chart = echarts.init(document.getElementById('viewsMap'));
        echarts.registerMap('china', require('../../assets/china'));
        chart.setOption({
            series: [{
                type: 'map',
                map: 'china',
                label: {
                    show: true
                },
                data: this.state.provinces
            }],
            tooltip: {
                trigger: 'item',
                formatter: (params) => {
                    if (params.value) {
                        return params.name + ' ' + params.value + ' views';
                    } else {
                        return params.name + ' ' + 0 + ' views';
                    }
                }
            },
            title: {
                text: '访问量地域分布'
            },
            visualMap: {
                min: 0,
                max: this.state.maxValue,
                text: ['High', 'Low'],
                realtime: true,
                calculable: true,
                inRange: {
                    color: ['#4cb0dd', '#2d79ad', '#265da0'] //颜色
                },
            },
        });
    }

    render() {
        return (
            <div id="viewsMap" style={{height: '100%'}}>
            </div>
        );
    }
}

export default ViewsMap;