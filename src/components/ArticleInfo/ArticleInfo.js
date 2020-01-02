import React, {Component} from 'react';
import './index.css'
import axios from 'axios'
import {BackTop, Button, Col, Divider, Icon, notification, Row} from "antd";
import ReactMarkdown from "react-markdown";
import ProgressBar from "../ProgressBar/ProgressBar";
import {NavLink} from "react-router-dom";

class ArticleInfo extends Component {

    constructor(props) {
        super(props)
        this.state = {
            id: props.match.params.id,
            article: {
                category: {}
            },
        }
    }

    componentDidMount() {
        const _this = this
        axios.get(global.constants.server + "/article?id=" + this.state.id)
            .then(res => {
                _this.setState({
                    article: JSON.parse(res.data),
                })
            }).catch(e => {
            notification.open({
                message: '请求失败',
                description: '错误信息：' + e,
            });
        })
    }

    render() {

        // TODO 加入锚点功能

        return (
            <div>
                <BackTop/>
                <ProgressBar/>
                <div id="articleInfo">
                    <Row>
                        <Col span={4}>
                            <Button id="articleInfoBackBtn">
                                <NavLink to={"/category/" + this.state.article.category.id}>
                                    <Icon type="left"/>
                                </NavLink>
                            </Button>
                        </Col>
                        <Col span={16}>
                            <h2 id="articleInfoTitle">{this.state.article.title}</h2>
                            <div id="articleInfoDate">{this.state.article.date}</div>
                            <Divider/>
                            <ReactMarkdown source={this.state.article.content}/>
                        </Col>
                        <Col span={4}>

                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}

export default ArticleInfo;