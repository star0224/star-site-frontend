import React, {Component} from 'react';
import axios from "axios";
import {BackTop, Col, Divider, Icon, notification, Row, Spin} from "antd";
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import ReactMarkdown from "react-markdown";
import './index.css'
import {NavLink} from "react-router-dom";
import CodeBlock from "../../components/CodeBlock/CodeBlock";
import $ from "jquery";
import loadingURL from "../../assets/loading.svg";

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
                    $('h1').addClass('mobileArticleH1')
                    $('h2').addClass('mobileArticleH2')
                    $('h3').addClass('mobileArticleH3')
                    $('h4').addClass('mobileArticleH4')
                    $('h5').addClass('mobileArticleH5')
                    $('td').addClass('mobileArticleT')
                    $('th').addClass('mobileArticleT')
                    $('table').addClass('mobileArticleT')
                    $('img').attr('src', loadingURL)
                    $('img').addClass('autoFlip')
                    $('img').css('max-width', '80vw')
                    // 获取图片
                    axios.get(global.constants.server + "/article/images?articleId=" + this.state.id)
                        .then(res => {
                            res = JSON.parse(res.data)
                            if (res.status === 1) {
                                const images = res.data
                                $('img').removeClass('autoFlip')
                                if (images !== null && images.length > 0) {
                                    let article = this.state.article;
                                    const placeholder = article.content.match(/!\[.*?\]\(data:image.*?\)/g)
                                    if (placeholder !== null) {
                                        for (let i = 0; i < placeholder.length; i++) {
                                            article.content = this.state.article.content.replace(placeholder[i], images[i].image)
                                            this.setState({
                                                article
                                            })
                                        }
                                    }
                                }
                                // 增加文章浏览量
                                axios.get(global.constants.server + "/article/views/add?id=" + this.state.id)
                            } else {
                                notification.open({
                                    message: '请求失败',
                                    description: '服务器返回信息： ' + res.msg
                                })
                            }
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
                        <Row type="flex" justify="center" align="middle">
                            <Col span={2}>
                                <NavLink to="/">
                                    <Icon type="home" style={{fontSize: '40px', marginLeft: '30px', color: '#404040'}}/>
                                </NavLink>
                            </Col>
                            <Col span={1}></Col>
                            <Col span={2}>
                                <span id="mobileTitleDivider"/>
                            </Col>
                            <Col span={2}></Col>
                            <Col span={16}>
                                <div id="mobileArticleTitle">{this.state.article.title}</div>
                            </Col>
                        </Row>
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
                    <Col span={1}>
                    </Col>
                    <Col span={22} style={{fontSize: '30px'}}>
                        <ReactMarkdown source={this.state.article.content} renderers={{
                            code: CodeBlock
                        }}/>
                    </Col>
                    <Col span={1}>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default ArticleMobile;