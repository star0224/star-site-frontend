import React, {Component} from 'react';
import axios from "axios";
import {BackTop, Col, Divider, Icon, notification, Row, Spin} from "antd";
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import ReactMarkdown from "react-markdown";
import './index.css'
import {NavLink} from "react-router-dom";
import CodeBlock from "../../components/CodeBlock/CodeBlock";

class ArticleMobile extends Component {

    constructor(props) {
        super(props)
        this.state = {
            id: props.match.params.id,
            article: {},
            loaded: false
        }
    }

    componentDidMount() {
        axios.get(global.constants.server + "/article?id=" + this.state.id)
            .then(res => {
                res = JSON.parse(res.data)
                if (res.status === 1) {
                    this.setState({
                        article: res.data,
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
                description: '服务器无响应： ' + e,
            });
        })
    }

    render() {
        return (
            <div id="mobileArticle">
                <ProgressBar/>
                <Row type="flex" justify="center" align="center">
                    <Col span={21}>
                        <NavLink to="/">
                            <Icon type="home" style={{fontSize: '40px', marginLeft: '30px', color: '#404040'}}/>
                        </NavLink>
                        <span id="mobileTitleDivider"/>
                        <div id="mobileArticleTitle">{this.state.article.title}</div>
                    </Col>
                    <Col span={3}>
                        {!this.state.loaded ? <Spin
                            indicator={<Icon type="loading" style={{fontSize: 40, position: 'relative', top: '10px'}}
                                             spin/>}/> : ""
                        }
                    </Col>
                </Row>
                <Divider/>
                <Row>
                    <Col span={3}>
                    </Col>
                    <Col span={18} style={{fontSize: '30px'}}>
                        <ReactMarkdown source={this.state.article.content} renderers={{
                            code: CodeBlock
                        }}/>
                    </Col>
                    <Col span={3}>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default ArticleMobile;