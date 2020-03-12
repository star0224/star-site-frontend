import React, {Component} from 'react';
import {Card, Col, Icon, notification, Row} from "antd";
import './index.css'
import {Area, Column} from '@antv/g2plot';
import axios from 'axios'
import {withRouter} from "react-router-dom";

class StarStatistic extends Component {

    constructor(props) {
        super(props);
        this.state = {
            articleTotal: '...',
            vocabularyTotal: '...',
            bugTotal: '0',
            viewTotal: '...',
            isBack: props.isBack,
            categoryNum: [],
        }
    }

    componentDidMount() {
        axios.get(global.constants.server + "/article/statistic")
            .then(res => {
                res = JSON.parse(res.data)
                if (res.status === 1) {
                    this.setState({
                        articleTotal: res.data,
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

        axios.get(global.constants.server + "/vocabulary/all/num")
            .then(res => {
                res = JSON.parse(res.data)
                if (res.status === 1) {
                    this.setState({
                        vocabularyTotal: res.data,
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

        axios.get(global.constants.server + "/views/all/num")
            .then(res => {
                res = JSON.parse(res.data)
                if (res.status === 1) {
                    this.setState({
                        viewTotal: res.data,
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
                    let categoryNum = this.state.categoryNum
                    for (let i = 0; i < res.data.length; i++) {
                        categoryNum.push({
                            categoryName: res.data[i].categoryName,
                            num: parseInt(res.data[i].articleNum)
                        })
                    }
                    this.setState({
                        categoryNum
                    })
                    const data = this.state.categoryNum
                    const categoryPlot = new Column('statisticCanvas', {
                        data,
                        xField: 'categoryName',
                        yField: 'num',
                        meta: {
                            num: {
                                alias: '数量',
                            },
                            categoryName: {
                                alias: '类别'
                            }
                        },
                        legend: {
                            visible: true,
                            position: 'top',
                        },
                        point: {
                            visible: true,

                        },
                        yAxis: {
                            grid: {
                                visible: true,
                            },
                        },
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
                <Row type="flex" justify="center" gutter={32} style={{marginTop: '50px'}}>
                    <Col span={5}>
                        <Card style={{background: 'linear-gradient(to right, rgb(71, 118, 230), rgb(142, 84, 233))'}}
                              onClick={() => {
                                  if (this.state.isBack !== true) {
                                      this.props.history.push('/category/list');
                                  } else {
                                      this.props.history.push('/bk/category/list');
                                  }
                              }}
                              className="statisticCard" hoverable bordered={false}>
                            <Row>
                                <Col span={21}>
                                    <h1 style={{color: '#fff', display: 'inline'}}>{this.state.articleTotal + " "}</h1>篇
                                </Col>
                                <Col span={3}>
                                    <Icon style={{fontSize: '25px'}} type="rocket"/>
                                </Col>
                            </Row>
                            <p>文章 Article</p>
                        </Card>
                    </Col>
                    <Col span={5}>
                        <Card style={{background: 'linear-gradient(to right,rgb(213, 51, 105), rgb(203, 173, 109))'}}
                              onClick={() => {
                                  if (this.state.isBack !== true) {
                                      this.props.history.push('/vocabulary');
                                  } else {
                                      this.props.history.push('/bk/vocabulary/list');
                                  }
                              }}
                              className="statisticCard" hoverable bordered={false}>
                            <Row>
                                <Col span={21}>
                                    <h1 style={{
                                        color: '#fff',
                                        display: 'inline'
                                    }}>{this.state.vocabularyTotal + " "}</h1>个
                                </Col>
                                <Col span={3}>
                                    <Icon style={{fontSize: '25px'}} type="bulb"/>
                                </Col>
                            </Row>
                            <p>词汇 Vocabulary</p>
                        </Card>
                    </Col>
                    <Col span={5}>
                        <Card style={{background: 'linear-gradient(to right, rgb(28, 216, 210), rgb(147, 237, 199))'}}
                              onClick={() => {
                                  notification.open({
                                      message: '暂无漏洞',
                                      description: '0 Error, 0 Bug'
                                  })
                              }}
                              className="statisticCard" hoverable bordered={false}>
                            <Row>
                                <Col span={21}>
                                    <h1 style={{color: '#fff', display: 'inline'}}>{this.state.bugTotal + " "}</h1>例
                                </Col>
                                <Col span={3}>
                                    <Icon style={{fontSize: '25px'}} type="crown"/>
                                </Col>
                            </Row>
                            <p>漏洞 Bug</p>
                        </Card>
                    </Col>
                    <Col span={5}>
                        <Card
                            style={{background: 'linear-gradient(to right, rgb(229, 57, 53), rgb(227, 93, 91))'}}
                            onClick={() => {
                                if (this.state.isBack !== true) {
                                    this.props.history.push('/views');
                                } else {
                                    this.props.history.push('/bk/views');
                                }
                            }}
                            className="statisticCard" hoverable bordered={false}>
                            <Row>
                                <Col span={21}>
                                    <h1 style={{color: '#fff', display: 'inline'}}>{this.state.viewTotal + " "}</h1>次
                                </Col>
                                <Col span={3}>
                                    <Icon style={{fontSize: '25px'}} type="star"/>
                                </Col>
                            </Row>
                            <p>访问 View</p>
                        </Card>
                    </Col>
                </Row>
                <Row type="flex" justify="center" style={{marginTop: '60px'}}>
                    <Col span={20} style={{backgroundColor: '#fff', borderRadius: '10px'}}>
                        <div id="statisticCanvas"></div>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default withRouter(StarStatistic);