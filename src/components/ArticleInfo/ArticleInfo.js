import React, {Component} from 'react';
import './index.css'
import axios from 'axios'
import {Anchor, BackTop, Breadcrumb, Col, Divider, Icon, notification, Row, Spin} from "antd";
import ReactMarkdown from "react-markdown";
import ProgressBar from "../ProgressBar/ProgressBar";
import {NavLink} from "react-router-dom";
import $ from 'jquery'
import Footer from "../Footer/Footer";
import CodeBlock from "../CodeBlock/CodeBlock";
import loadingURL from '../../assets/loading.svg'

const {Link} = Anchor;

class ArticleInfo extends Component {

    constructor(props) {
        super(props)
        this.state = {
            id: props.match.params.id,
            article: {
                wordCount: 0,
                category: {}
            },
            loaded: false,
            anchor: [],
            targetOffset: undefined,
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
                        loaded: true
                    })
                    let anchor = this.generatorAnchor()
                    _this.setState({
                        anchor: anchor,
                        targetOffset: window.innerHeight / 6,
                    })
                    $('h1').addClass('articleH1')
                    $('h2').addClass('articleH2')
                    $('h3').addClass('articleH3')
                    $('h4').addClass('articleH4')
                    $('h5').addClass('articleH5')
                    $('h5').addClass('articleH5')
                    $('p').addClass('articleP')
                    $('ol').addClass('articleL')
                    $('ul').addClass('articleL')
                    $('table').addClass('articleTable')
                    $('th').addClass('articleThTd')
                    $('td').addClass('articleThTd')
                    $('#articleInfo').children('div:first-child').children('div:first-child').children('div:nth-child(2)').width($('#articleInfo').children('div:first-child').children('div:first-child').width())
                    let articleAnchor = $('#articleInfo').children('div').children('div:first-child').children('div:nth-child(2)')
                    let articleAnchorDOM = $('#articleInfo').children('div').children('div:first-child').children('div:nth-child(2)')[0]
                    if (articleAnchorDOM.scrollHeight > articleAnchorDOM.clientHeight) {
                        articleAnchor.addClass('articleAnchor')
                    }
                    $('img').attr('src', loadingURL)
                    $('img').addClass('autoFlip')
                    $('img').css('max-width', '60vw')
                    // $('body').addClass('bodyScroll')
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
                                            _this.setState({
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

    componentWillUnmount() {
        $('h1').removeClass('articleH1')
        $('h2').removeClass('articleH2')
        $('h3').removeClass('articleH3')
        $('h4').removeClass('articleH4')
        $('h5').removeClass('articleH5')
        $('h5').removeClass('articleH5')
        $('p').removeClass('articleP')
        $('ol').removeClass('articleL')
        $('ul').removeClass('articleL')
        $('table').removeClass('articleTable')
        $('th').removeClass('articleThTd')
        $('td').removeClass('articleThTd')
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
            } else if (thisTag.level === prevTagLevel) {
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
                <div id="articleInfo" className="starScroll">
                    <Row>
                        <Col span={5}>
                            <Breadcrumb id="articleInfoBackBtn">
                                <Breadcrumb.Item>
                                    <NavLink to="/">Home</NavLink>
                                </Breadcrumb.Item>
                                {this.state.loaded ? (<Breadcrumb.Item>
                                    <NavLink to={"/category/" + this.state.article.category.id}>
                                        {this.state.article.category.name}
                                    </NavLink>
                                </Breadcrumb.Item>) : ''}
                                {this.state.loaded ? (<Breadcrumb.Item>
                                    <NavLink
                                        to={"/article/" + this.state.article.id}>{this.state.article.title}
                                    </NavLink>
                                </Breadcrumb.Item>) : ''}
                            </Breadcrumb>
                            {this.state.loaded ? (
                                <Anchor
                                    style={{
                                        backgroundColor: '#f5f5f9',
                                        overflowY: 'scroll',
                                        scrollbarWidth: 'none',
                                        overflowX: 'hidden',
                                        marginTop: '40px',
                                        position: 'fixed',
                                        height: '80vh'
                                    }} targetOffset={this.state.targetOffset}
                                    affix={false}>
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
                                                                                                <Link
                                                                                                    href={"#" + item.id}
                                                                                                    title={item.title}>
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
                            ) : ''}
                        </Col>
                        <Col span={1}></Col>
                        <Col span={17}>
                            {!this.state.loaded ? (
                                <div>
                                    <Row style={{height: '80vh'}} type="flex" justify="center" align="middle">
                                        <Col span={6}/>
                                        <Col span={14}>
                                            <Spin
                                                indicator={<Icon type="loading"
                                                                 style={{
                                                                     fontSize: 24,
                                                                     position: 'relative',
                                                                     top: '-2px',
                                                                     marginRight: '10px'
                                                                 }}
                                                                 spin/>}/>
                                            <h2 style={{marginLeft: '10px', display: 'inline'}}>正在生成导航锚点，请稍等~</h2>
                                        </Col>
                                        <Col span={4}/>
                                    </Row>
                                </div>
                            ) : (
                                <div>
                                    <div id="articleInfoTitle"
                                         style={{marginBottom: '20px'}}>{this.state.article.title}</div>
                                    <div id="articleInfoDate">
                                        <Icon type="calendar" style={{marginRight: '5px'}}/>
                                        {this.state.article.date}
                                        <span style={{marginLeft: '30px'}}>
                                            <Icon type="eye" style={{marginRight: '5px'}}/>
                                            {this.state.article.views} views
                                        </span>
                                        <span style={{marginLeft: '30px'}}>
                                            <Icon type="highlight" style={{marginRight: '5px'}}/>
                                            {this.state.article.wordCount} 字
                                        </span>
                                        <span style={{marginLeft: '30px'}}>
                                            <Icon type="book" style={{marginRight: '5px'}}/>
                                            预计阅读时间：{Number.parseInt(this.state.article.wordCount / 500)} 分钟
                                        </span>
                                    </div>
                                </div>
                            )}

                            {this.state.loaded ? <Divider/> : ''}
                            <ReactMarkdown source={this.state.article.content} renderers={{
                                code: CodeBlock
                            }}/>
                        </Col>
                        <Col span={1}></Col>
                        {this.state.loaded ? <Footer/> : ''}
                    </Row>
                </div>
            </div>
        )
    }
}

export default ArticleInfo;