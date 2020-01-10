import React, {Component} from 'react';
import './index.css'
import axios from 'axios'
import {BackTop, Breadcrumb, Col, Divider, notification, Row, Anchor} from "antd";
import ReactMarkdown from "react-markdown";
import ProgressBar from "../ProgressBar/ProgressBar";
import {NavLink} from "react-router-dom";
import $ from 'jquery'
import Footer from "../Footer/Footer";

const {Link} = Anchor;

class ArticleInfo extends Component {

    constructor(props) {
        super(props)
        this.state = {
            id: props.match.params.id,
            article: {
                category: {}
            },
            anchor: [],
            targetOffset: undefined
        }
    }

    componentDidMount() {
        const _this = this
        axios.get(global.constants.server + "/article?id=" + this.state.id)
            .then(res => {
                res = JSON.parse(res.data)
                if (res.status === 1) {
                    _this.setState({
                        article: res.data,
                    })
                    let anchor = this.generatorAnchor()
                    _this.setState({
                        anchor: anchor,
                        targetOffset: window.innerHeight / 6,
                    })
                    $('h2').css('font-size', '28px')
                    $('h3').css('font-size', '25px')
                    $('h4').css('font-size', '22px')
                    $('h5').css('font-size', '19px')
                    $('#articleInfo').children('div:first-child').children('div:first-child').children('div:nth-child(2)').width($('#articleInfo').children('div:first-child').children('div:first-child').width())
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

    generatorAnchor = () => {
        const targetTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
        let parentDOMJQ = $('#articleInfo').children('div:first-child').children('div:nth-child(3)').children()
        const parentDOM = []
        for (let i = 0; i < parentDOMJQ.length; i++) {
            parentDOM[i] = parentDOMJQ[i]
        }
        // 过滤非h标签
        let anchorDOM = parentDOM.filter(
            (element, index, thisArr) => {
                return targetTags.indexOf(element.localName) > -1
            }
        )
        // 对过滤后的标签格式化为树状数组
        let anchorDOMFormat = []

        anchorDOM.forEach((element, index, thisArr) => {
            element.id = element.localName + "_" + index
            let thisTag = {
                id: element.id,
                title: element.innerHTML,
                parentId: '0',
                level: targetTags.indexOf(element.localName)
            }
            const maxTagLevel = targetTags.indexOf(thisArr[0].localName)
            let prevTagLevel = ""
            if (index !== 0) {
                prevTagLevel = targetTags.indexOf(thisArr[index - 1].localName)
            }
            if (thisTag.level === maxTagLevel) {
                anchorDOMFormat.push(thisTag)
                return
            } else if (thisTag.level > prevTagLevel) {
                thisTag.parentId = anchorDOMFormat[anchorDOMFormat.length - 1].id
                anchorDOMFormat.push(thisTag)
            } else if (thisTag.level == prevTagLevel) {
                thisTag.parentId = anchorDOMFormat[anchorDOMFormat.length - 1].parentId
                anchorDOMFormat.push(thisTag)
            } else if (thisTag.level < prevTagLevel) {
                if (anchorDOMFormat[anchorDOMFormat.length - 1].level === thisTag.level) {
                    thisTag.parentId = anchorDOMFormat[anchorDOMFormat.length - 1].parentId
                    anchorDOMFormat.push(thisTag)
                } else {
                    thisTag.parentId = anchorDOMFormat[anchorDOMFormat.length - 1].parentId
                    while (true) {
                        let parent = anchorDOMFormat.find(element => {
                            return element.id === thisTag.parentId
                        })
                        thisTag.parentId = parent.parentId
                        if (parent.level === thisTag.level) {
                            anchorDOMFormat.push(thisTag)
                            break
                        }
                    }
                }
            }
        })

        // 转化为树状结构
        let anchorMap = new Map()
        anchorDOMFormat.forEach(element => {
            element.child = []
            anchorMap.set(element.id, element)
        })
        console.log(anchorDOMFormat)
        let newData = []
        anchorDOMFormat.forEach(element => {
            if (element.parentId !== '0') {
                anchorMap.get(element.parentId).child.push(element)
            } else {
                newData.push(element)
            }
        })
        return newData
    }


    render() {

        const anchor = this.state.anchor

        return (
            <div>
                <BackTop/>
                <ProgressBar/>
                <div id="articleInfo">
                    <Row>
                        <Col span={5}>
                            <Breadcrumb id="articleInfoBackBtn">
                                <Breadcrumb.Item>
                                    <NavLink to="/">Home</NavLink>
                                </Breadcrumb.Item>
                                <Breadcrumb.Item>
                                    <NavLink to={"/category/" + this.state.article.category.id}>
                                        {this.state.article.category.name}
                                    </NavLink>
                                </Breadcrumb.Item>
                                <Breadcrumb.Item>
                                    <NavLink
                                        to={"/article/" + this.state.article.id}>{this.state.article.title}
                                    </NavLink>
                                </Breadcrumb.Item>
                            </Breadcrumb>
                            <Anchor targetOffset={this.state.targetOffset} affix={false}>
                                {
                                    anchor.map((item, index) => {
                                        return (
                                            <Link href={"#" + item.id} title={item.title}>
                                                {
                                                    item.child.map((item, id) => {
                                                        return (
                                                            <Link href={"#" + item.id} title={item.title}>
                                                                {
                                                                    item.child.map((item, id) => {
                                                                        return (
                                                                            <Link href={"#" + item.id}
                                                                                  title={item.title}>
                                                                                {
                                                                                    item.child.map((item, id) => {
                                                                                        return (
                                                                                            <Link href={"#" + item.id} title={item.title}>
                                                                                            </Link>
                                                                                        )
                                                                                    })
                                                                                }
                                                                            </Link>
                                                                        )
                                                                    })
                                                                }
                                                            </Link>
                                                        )
                                                    })
                                                }
                                            </Link>
                                        )
                                    })
                                }
                            </Anchor>
                        </Col>
                        <Col span={0}></Col>
                        <Col span={17}>
                            <div id="articleInfoTitle">{this.state.article.title}</div>
                            <div id="articleInfoDate">{this.state.article.date}</div>
                            <Divider/>
                            <ReactMarkdown source={this.state.article.content}/>
                        </Col>
                        <Col span={2}></Col>
                        <Footer/>
                    </Row>
                </div>
            </div>
        )
    }
}

export default ArticleInfo;