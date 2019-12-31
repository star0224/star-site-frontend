import React, {Component} from 'react';
import Navigation from "../../components/Navigation/Navigation";
import './index.css'
import axios from 'axios'
import {Button, Col, Divider, Icon, List, Row} from "antd";
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import {NavLink} from "react-router-dom";

class Home extends Component {

    constructor(props) {
        super(props)
        this.state = {
            archives: [],
            essays: []
        }
    }

    componentDidMount() {
        const _this = this
        axios.get(global.constants.server + "/article/list?category=0")
            .then(res => {
                _this.setState({
                    archives: JSON.parse(res.data)
                })
            }).catch(e => console.log(e))
        axios.get(global.constants.server + "/article/list?category=1")
            .then(res => {
                _this.setState({
                    essays: JSON.parse(res.data)
                })
            }).catch(e => console.log(e))
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
                        <Col span={14}>
                            <div id="archives">
                                <h3>
                                    <Icon type="rocket"/>
                                    Archives
                                </h3>
                                <Divider dashed/>
                                <List
                                    id="archivesList"
                                    itemLayout="vertical"
                                    size="large"
                                    pagination={{
                                        onChange: page => {
                                            console.log(page);
                                        },
                                        pageSize: 3,
                                    }}
                                    dataSource={this.state.archives}
                                    renderItem={item => (
                                        <List.Item
                                            key={item.title}
                                            actions={[
                                                <IconText type="like-o" text="156" key="like" />,
                                                <IconText type="message" text="2" key="message" />,
                                            ]}
                                        >
                                            <List.Item.Meta
                                                title={<NavLink to={"/article" + item.id}>{item.title}</NavLink>}/>
                                            {item.content}
                                        </List.Item>
                                    )}
                                />,
                            </div>
                        </Col>
                        <Col span={10}>
                            <div id="essays">
                                <h3>
                                    <Icon type="like"/>
                                    Essay
                                </h3>
                                <Divider dashed/>
                                <List
                                    itemLayout="horizontal"
                                    dataSource={this.state.essays}
                                    renderItem={item => (
                                        <List.Item>
                                            <List.Item.Meta
                                                title={<a href="https://ant.design">{item.title}</a>}
                                            />
                                        </List.Item>
                                    )}
                                />
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}

export default Home;