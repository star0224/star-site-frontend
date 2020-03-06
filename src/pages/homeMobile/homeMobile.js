import React, {Component} from 'react';
import {Col, Icon, notification, Row, Spin} from "antd";
import './index.css'
import axios from "axios";
import {Accordion, List, NoticeBar} from 'antd-mobile';
import {NavLink} from "react-router-dom";
import $ from "jquery";

class HomeMobile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            articles: [],
            categories: [],
            categoryLoaded: false,
            articleLoaded: false
        }
    }

    componentDidMount() {
        $.ajax({
            type: "get",
            dataType: 'jsonp',
            data: {
                key: global.constants.tencentKey,
                output: 'jsonp'
            },
            jsonp: "callback",
            url: 'https://apis.map.qq.com/ws/location/v1/ip',
            success: function (data) {
                const form = {
                    ip: data.result.ip,
                    country: data.result.ad_info.nation,
                    province: data.result.ad_info.province,
                    city: data.result.ad_info.city,
                    district: data.result.ad_info.district,
                    lat: data.result.location.lat,
                    lng: data.result.location.lng
                }
                axios.post(global.constants.server + "/views/add", form).catch(e => {
                    notification.open({
                        message: '请求失败',
                        description: '服务器无响应：' + e,
                    });
                })
            },
        });
        axios.get(global.constants.server + "/article/list/public?isPublic=1")
            .then(res => {
                res = JSON.parse(res.data)
                if (res.status === 1) {
                    this.setState({
                        articles: res.data,
                        articleLoaded: true
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
        axios.get(global.constants.server + "/article/category/list")
            .then(res => {
                res = JSON.parse(res.data)
                if (res.status === 1) {
                    this.setState({
                        categories: res.data,
                        categoryLoaded: true
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
    }

    render() {
        return (
            <div id="homeMobile">
                <NoticeBar mode="closable" style={{height: '60px', fontSize: '2em'}}>
                    完整功能请在PC端体验~
                </NoticeBar>
                <Row id="homeMobileTitle">
                    <h1 style={{fontSize: '4em', marginBottom: '10px', marginLeft: '20px', fontWeight: '700'}}>Star's First Land</h1>
                    <p style={{fontSize: '2em', color: 'rgb(198, 198, 198)', marginLeft: '20px'}}>Just enjoy it !</p>
                </Row>
                {!this.state.articleLoaded && !this.state.categoryLoaded ?
                    (<Row style={{height: '70vh'}} type="flex" justify="center" align="middle">
                        <Spin indicator={<Icon type="loading" style={{fontSize: 40, position: 'relative', top: '-5px'}}
                                               spin/>}/>
                        <h2 style={{marginLeft: '30px', fontSize: '40px'}}>正在加载，请稍等~</h2>
                    </Row>) :
                    (<Row id="homeMobileCategories">
                        {this.state.categories.map((category) => {
                            let categoryName = category.name
                            return (
                                <Accordion accordion>
                                    <Accordion.Panel header={categoryName}>
                                        <List>
                                            {this.state.articles.map(article => {
                                                if (article.categoryName === categoryName) {
                                                    return (
                                                        <List.Item arrow="horizontal" multipleLine>
                                                            <NavLink to={'/article/' + article.id}>
                                                                {article.title}
                                                            </NavLink>
                                                        </List.Item>
                                                    )
                                                }
                                            })}
                                        </List>
                                    </Accordion.Panel>
                                </Accordion>
                            )
                        })}
                    </Row>)}
            </div>
        );
    }
}

export default HomeMobile;