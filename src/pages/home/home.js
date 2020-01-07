import React, {Component} from 'react';
import Navigation from "../../components/Navigation/Navigation";
import './index.css'
import axios from 'axios'
import {BackTop, Button, Col, Divider, Drawer, Icon, List, notification, Popover, Row, Typography} from "antd";
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import {NavLink} from "react-router-dom";
import Footer from "../../components/Footer/Footer";

class Home extends Component {

    constructor(props) {
        super(props)
        this.state = {
            archives: [],
            essays: [],
            categories: [],
            visible: false
        }
    }

    componentDidMount() {
        const _this = this
        axios.get(global.constants.server + "/article/list")
            .then(res => {
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

        const contactContent = (
            <div>
                <Button style={{border: 'none', boxShadow: 'none'}}>
                    <a href="https://github.com/star0224" target="view_window">
                        <Icon type="github" theme="filled"/>
                    </a>
                </Button>
                <Popover content={(
                    <div>
                        <img style={{width: '20vw', height: '40vh'}} src={require('../../assets/wechat.jpg')} alt="load error"/>
                    </div>
                )} trigger="hover" placement="right">
                    <Button style={{border: 'none', boxShadow: 'none'}} >
                        <Icon type="wechat" theme="filled"/>
                    </Button>
                </Popover>
            </div>
        )

        const IconText = ({type, text}) => (
            <span>
                <Icon type={type} style={{marginRight: 8}}/>
                {text}
            </span>
        );

        return (
            <div>
                <Drawer
                    width={350}
                    title="Star Blog V1.0"
                    placement="right"
                    closable={false}
                    onClose={() => this.setState({visible: false})}
                    visible={this.state.visible}
                >
                    <div>
                        <h3>1.0版本增加了：</h3>
                        <Divider style={{margin: '10px 0px 10px 0px'}}/>
                        <ul style={{listStyle: 'none', paddingLeft: '5px', marginBottom: '50px'}}>
                            <li style={{marginBottom: '5px'}}>1. 文章分类页面</li>
                            <li style={{marginBottom: '5px'}}>2. 文章锚点自动生成算法</li>
                            <li style={{marginBottom: '5px'}}>3. 后台文章及分类管理</li>
                        </ul>
                        <h3>预计在下版本上线：</h3>
                        <Divider style={{margin: '10px 0px 10px 0px'}}/>
                        <ul style={{listStyle: 'none', paddingLeft: '5px', marginBottom: '50px'}}>
                            <li style={{marginBottom: '5px'}}>1. 文章标签实现可伸缩</li>
                            <li style={{marginBottom: '5px'}}>2. 分类页面优化</li>
                            <li style={{marginBottom: '5px'}}>3. 移动端适配</li>
                            <li style={{marginBottom: '5px'}}>4. 留言功能</li>
                        </ul>
                    </div>
                </Drawer>

                <ProgressBar/>
                <BackTop/>
                <Navigation current="home"/>
                <div id="background"></div>
                <div id="blurBox">
                    <p className="enHomeTitle">Star's</p>
                    <p className="enHomeTitle">The First Lands —— The Placidium of Navori</p>
                    <h2 id="blurBoxTitle">Star的初生之土 —— 纳沃利的普雷西典</h2>
                    <p>
                        <Button onClick={() => this.setState({visible: true})}>What's New</Button>
                        <Button>Technic</Button>
                        <Popover content={contactContent} trigger="click" placement="right">
                            <Button type="primary">Contact Me</Button>
                        </Popover>
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
                                        pageSize: 5,
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
                                    Category
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