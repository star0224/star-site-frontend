import React, {Component} from 'react';
import {Col, Icon, notification, Row, Spin} from "antd";
import './index.css'
import axios from "axios";
import {Accordion, List} from 'antd-mobile';
import {NavLink} from "react-router-dom";

class HomeMobile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            articles: [{
                category: {
                    name: ''
                }
            }],
            categories: [],
            loaded: false
        }
    }

    componentDidMount() {
        axios.get(global.constants.server + "/article/list/public?isPublic=1")
            .then(res => {
                res = JSON.parse(res.data)
                if (res.status === 1) {
                    this.setState({
                        articles: res.data,
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
                        loaded: true
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
                <Row id="homeMobileTitle">
                    <h1 style={{fontSize: '4em', marginBottom: '10px', marginLeft: '20px'}}>Star's First Land</h1>
                    <p style={{fontSize: '2em', color: 'rgb(198, 198, 198)', marginLeft: '20px'}}>这里将会向你分享一些技术文章</p>
                </Row>
                {!this.state.loaded ?
                    (<Row style={{height: '70vh'}} type="flex" justify="center" align="middle">
                        <Spin indicator={<Icon type="loading" style={{ fontSize: 40, position: 'relative', top: '-5px'}} spin />} />
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
                                                if (article.category.name === categoryName) {
                                                    return (
                                                        <List.Item arrow="horizontal" multipleLine>
                                                            <NavLink to={'/mobile/article/' + article.id}>
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