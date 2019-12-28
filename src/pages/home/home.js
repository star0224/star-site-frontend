import React, {Component} from 'react';
import Navigation from "../../components/Navigation/Navigation";
import './index.css'
import axios from 'axios'
import {Button, Col, Divider, Icon, List, Row} from "antd";
import ProgressBar from "../../components/ProgressBar/ProgressBar";

class Home extends Component {

    constructor(props) {
        super(props)
        this.state = {
            archives: []
        }
    }

    componentDidMount() {
        const _this = this
        axios.get("http://localhost:8080/getArchiveInfo")
            .then(response => {
                _this.setState({
                    archives: response.data
                })
            }).catch(error => {
            console.log(error)
            _this.setState({
                archives: [
                    {
                        date: '2019-07-10',
                        info: '1'
                    }
                ]
            })
        })
    }

    render() {

        const IconText = ({type, text}) => (
            <span>
                <Icon type={type} style={{marginRight: 8}}/>
                {text}
            </span>
        );

        const listData = [];
        for (let i = 0; i < 100; i++) {
            listData.push({
                href: 'http://ant.design',
                title: `ant design part ${i}`,
                avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
                description:
                    'Ant Design, a design language for background applications, is refined by Ant UED Team.',
                content:
                    'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
            });
        }

        const data = [
            {
                title: 'Ant Design Title 1',
            },
            {
                title: 'Ant Design Title 2',
            },
            {
                title: 'Ant Design Title 3',
            },
            {
                title: 'Ant Design Title 4',
            },
        ];

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
                                    Discovery
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
                                    dataSource={listData}
                                    renderItem={item => (
                                        <List.Item
                                            key={item.title}
                                            actions={[
                                                <IconText type="like-o" text="156" key="list-vertical-like-o"/>,
                                                <IconText type="message" text="2" key="list-vertical-message"/>,
                                            ]}
                                        >
                                            <List.Item.Meta
                                                title={<a href={item.href}>{item.title}</a>}
                                                description={item.description}
                                            />
                                            {item.content}
                                        </List.Item>
                                    )}
                                />,
                            </div>
                        </Col>
                        <Col span={10}>
                            <div id="essay">
                                <h3>
                                    <Icon type="like"/>
                                    Essay
                                </h3>
                                <Divider dashed/>
                                <List
                                    itemLayout="horizontal"
                                    dataSource={data}
                                    renderItem={item => (
                                        <List.Item>
                                            <List.Item.Meta
                                                title={<a href="https://ant.design">{item.title}</a>}
                                                description="Ant Design, a design language for background applications, is refined by Ant UED Team"
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