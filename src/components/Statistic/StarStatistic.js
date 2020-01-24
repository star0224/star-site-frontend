import React, {Component} from 'react';
import {Card, Col, Icon, notification, Row} from "antd";
import './index.css'
import {Area} from '@antv/g2plot';
import axios from 'axios'

class StarStatistic extends Component {

    constructor(props) {
        super(props);
        this.state = {
            articleTotal: '...',
            articleDay: '...',
            articleWeek: '...',
            articleMonth: '...',
            categoryNum: [
                {
                    categoryName: '',
                    articleNum: ''
                }
            ],
        }
    }

    componentDidMount() {
        axios.get(global.constants.server + "/article/statistic")
            .then(res => {
                res = JSON.parse(res.data)
                if (res.status === 1) {
                    this.setState({
                        articleTotal: res.data.articleTotal,
                        articleDay: res.data.articleDay,
                        articleWeek: res.data.articleWeek,
                        articleMonth: res.data.articleMonth,
                    })
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

        axios.get(global.constants.server + "/article/num")
            .then(res => {
                res = JSON.parse(res.data)
                if (res.status === 1) {
                    this.setState({
                        categoryNum: res.data
                    })
                    const data = this.state.categoryNum
                    const categoryPlot = new Area('categoryCanvas', {
                        title: {
                            visible: true,
                            text: '分类分布图',
                        },
                        data,
                        xField: 'categoryName',
                        yField: 'articleNum',
                        legend: {
                            visible: true,
                            position: 'top',
                        },
                        areaStyle: {}
                    });
                    categoryPlot.render();
                } else {
                    notification.open({
                        message: '请求失败',
                        description: '服务器返回信息： ' + res.msg
                    })
                }
            }).catch(e => {
            console.log(e)
        })

    }

    render() {

        return (
            <div>
                <Row type="flex" justify="center" gutter={32} style={{marginTop: '60px'}}>
                    <Col span={5}>
                        <Card style={{background: 'linear-gradient(to right, rgb(71, 118, 230), rgb(142, 84, 233))'}}
                              className="statisticCard" hoverable bordered={false}>
                            <Row>
                                <Col span={21}>
                                    <h1 style={{color: '#fff', display: 'inline'}}>{this.state.articleTotal + " "}</h1>篇
                                </Col>
                                <Col span={3}>
                                    <Icon style={{fontSize: '25px'}} type="rocket"/>
                                </Col>
                            </Row>
                            <p>总计 total</p>
                        </Card>
                    </Col>
                    <Col span={5}>
                        <Card style={{background: 'linear-gradient(to right,rgb(213, 51, 105), rgb(203, 173, 109))'}}
                              className="statisticCard" hoverable bordered={false}>
                            <Row>
                                <Col span={21}>
                                    <h1 style={{color: '#fff', display: 'inline'}}>{this.state.articleDay + " "}</h1>篇
                                </Col>
                                <Col span={3}>
                                    <Icon style={{fontSize: '25px'}} type="bulb"/>
                                </Col>
                            </Row>
                            <p>今日 today</p>
                        </Card>
                    </Col>
                    <Col span={5}>
                        <Card style={{background: 'linear-gradient(to right, rgb(28, 216, 210), rgb(147, 237, 199))'}}
                              className="statisticCard" hoverable bordered={false}>
                            <Row>
                                <Col span={21}>
                                    <h1 style={{color: '#fff', display: 'inline'}}>{this.state.articleWeek + " "}</h1>篇
                                </Col>
                                <Col span={3}>
                                    <Icon style={{fontSize: '25px'}} type="crown"/>
                                </Col>
                            </Row>
                            <p>本周 week</p>
                        </Card>
                    </Col>
                    <Col span={5}>
                        <Card
                            style={{background: 'linear-gradient(to right, rgb(229, 57, 53), rgb(227, 93, 91))'}}
                            className="statisticCard" hoverable bordered={false}>
                            <Row>
                                <Col span={21}>
                                    <h1 style={{color: '#fff', display: 'inline'}}>{this.state.articleMonth + " "}</h1>篇
                                </Col>
                                <Col span={3}>
                                    <Icon style={{fontSize: '25px'}} type="star"/>
                                </Col>
                            </Row>
                            <p>本月 month</p>
                        </Card>
                    </Col>
                </Row>
                <Row type="flex" justify="center" style={{marginTop: '80px'}}>
                    <Col span={20} style={{backgroundColor: '#fff', borderRadius: '10px'}}>
                        <div id="categoryCanvas"></div>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default StarStatistic;