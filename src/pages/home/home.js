import React, {Component} from 'react';
import Navigation from "../../components/Navigation/Navigation";
import './index.css'
import axios from 'axios'
import {BackTop, Button, Col, Divider, Icon, List, notification, Row} from "antd";
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import {NavLink} from "react-router-dom";
import Footer from "../../components/Footer/Footer";

class Home extends Component {

    constructor(props) {
        super(props)
        this.state = {
            archives: [],
            essays: [],
            categories: []
        }
    }

    componentDidMount() {
        const _this = this
        axios.get(global.constants.server + "/article/list")
            .then(res => {
                console.log(JSON.parse(res.data))
                _this.setState({
                    archives: JSON.parse(res.data),
                })
            }).catch(e => {
            notification.open({
                message: '请求失败',
                description: '错误信息：' + e,
            });
        })
        axios.get(global.constants.server + "/article/category/list")
            .then(res => {
                this.setState({
                    categories: JSON.parse(res.data)
                })
            }).catch(e => {
            notification.open({
                message: '请求失败',
                description: '错误信息：' + e,
            });
        })
    }


    render() {

        const IconText = ({type, text}) => (
            <span>
                <Icon type={type} style={{marginRight: 8}}/>
                {text}
            </span>
        );

        return (
            <div>
                <ProgressBar/>
                <BackTop/>
                <Navigation current="home"/>
                <div id="background"></div>
                <div id="blurBox">
                    <p className="enHomeTitle">Star's</p>
                    <p className="enHomeTitle">The First Lands —— The Placidium of Navori</p>
                    <h2 id="blurBoxTitle">Star的初生之土 —— 纳沃利的普雷西典</h2>
                    <p>
                        <Button>What's New</Button>
                        <Button>Archives</Button>
                        <Button type="primary">Reading</Button>
                    </p>
                </div>
                <div id="content">
                    <Row>
                        <Col span={3}>
                        </Col>
                        <Col span={10}>
                            <div id="archives">
                                <h3>
                                    <Icon type="smile"/>
                                    Discovery
                                </h3>
                                <Divider dashed/>
                                <List
                                    itemLayout="vertical"
                                    size="large"
                                    pagination={{
                                        onChange: page => {
                                            console.log(page);
                                        },
                                        pageSize: 6,
                                    }}
                                    dataSource={this.state.archives}
                                    renderItem={item => (
                                        <List.Item
                                            key={item.title}
                                        >
                                            <List.Item.Meta
                                                title={<NavLink to={"/article/" + item.id}>{item.title}</NavLink>}
                                                description={(
                                                    <div id="archivesDesc">
                                                        <IconText type="calendar" text={item.date} key="calendar"/>
                                                        <IconText type="folder-open" text={item.category.name}
                                                                  key="category"/>
                                                        <IconText type="message" text={2 + " Comments"} key="message"/>
                                                        <IconText type="eye" text={item.views + " Views"} key="views"/>
                                                    </div>
                                                )}
                                            />
                                            {item.content}
                                        </List.Item>
                                    )}
                                />
                            </div>
                        </Col>
                        <Col span={2}></Col>
                        <Col span={6}>
                            <div id="essays">
                                <h3>
                                    <Icon type="unordered-list"/>
                                    目录
                                </h3>
                                <Divider dashed/>
                                <List
                                    split={false}
                                    dataSource={this.state.categories}
                                    renderItem={item => (
                                        <List.Item>
                                            <NavLink to={"/category/" + item.id}
                                                     style={{color: 'rgba(0, 0, 0, 0.65)'}}>
                                                <IconText type="folder" text={item.name}/>
                                            </NavLink>
                                        </List.Item>
                                    )}
                                />
                            </div>
                        </Col>
                        <Col span={3}>
                        </Col>
                    </Row>
                    <Row>
                        <Footer/>
                    </Row>
                </div>
            </div>
        );
    }
}

export default Home;