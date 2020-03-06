import React, {Component} from 'react'
import NavigationBack from "../../../components/Navigation_Back/NavigationBack"
import MdEditor from "for-editor"
import $ from 'jquery'
import './index.css'
import {Button, DatePicker, Icon, Input, notification, Row, Select, Spin} from "antd"
import axios from "axios"
import {withRouter} from "react-router-dom";
import locale from "antd/es/date-picker/locale/zh_CN";
import moment from "moment";

const {Option} = Select;

// 拓展Date格式化功能
Date.prototype.format = function (fmt) {
    let o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (let k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

// 统计文章字数
function wordCount(data) {
    data = data.replace(/!\[.*?\]\(data:image.*?\)/g, '')
    const pattern = /[a-zA-Z0-9_\u0392-\u03c9]+|[\u4E00-\u9FFF\u3400-\u4dbf\uf900-\ufaff\u3040-\u309f\uac00-\ud7af]+/g;
    let m = data.match(pattern);
    let count = 0;
    if (m == null) {
        return count;
    }
    for (let i = 0; i < m.length; i++) {
        if (m[i].charCodeAt(0) >= 0x4E00) {
            count += m[i].length;
        } else {
            count += 1;
        }
    }
    return count;
}

class ArticleAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            inputVisible: false,
            inputValue: '',
            categoryId: '',
            categoryList: [],
            wordCount: 0,
            images: [],
            imageLoaded: false,
            date: new Date().format("yyyy-MM-dd"),
            id: props.match.params.id,
            articleTitle: '',
            article: {
                category: {},
                date: ''
            },
            loaded: false,
            imageIds: []
        }
        this.$vm = React.createRef()
    }

    componentDidMount() {
        const _this = this
        this.setState({
            width: $(window).width() - $('#navigation_bk').width()
        })
        if (this.state.id !== undefined) {
            axios.get(global.constants.server + "/article?id=" + this.state.id)
                .then(res => {
                    res = JSON.parse(res.data)
                    if (res.status === 1) {
                        const article = res.data
                        _this.setState({
                            article,
                            categoryList: [
                                article.category
                            ],
                            date: article.date,
                            value: article.content,
                            categoryId: article.category.id,
                            articleTitle: article.title,
                            wordCount: wordCount(article.content),
                            loaded: true
                        })
                        axios.get(global.constants.server + "/article/images?articleId=" + this.state.id)
                            .then(res => {
                                res = JSON.parse(res.data)
                                if (res.status === 1) {
                                    const images = res.data
                                    if (images !== null && images.length > 0) {
                                        let value = this.state.value
                                        const placeholder = value.match(/!\[.*?\]\(data:image.*?\)/g)
                                        if (placeholder !== null) {
                                            for (let i = 0; i < placeholder.length; i++) {
                                                value = this.state.value.replace(placeholder[i], images[i].image)
                                                _this.setState({
                                                    value
                                                })
                                            }
                                        }
                                    }
                                    _this.setState({
                                        imageLoaded: true
                                    })
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
                    description: '服务器无响应：' + e,
                })
            })
        } else {
            axios.get(global.constants.server + "/article/category/list")
                .then(res => {
                    res = JSON.parse(res.data)
                    if (res.status === 1) {
                        _this.setState({
                            categoryList: res.data,
                            imageLoaded: true
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
                })
            })
        }
    }


    // 保存事件
    saveArticle = (isPublic) => {
        if (!this.state.imageLoaded) {
            notification.open({
                message: '图片未加载完成，请稍等',
            })
            return
        }
        let imagesContents = this.state.value.match(/!\[.*?\]\(data:image.*?\)/g)
        let images = []
        if (imagesContents !== null) {
            for (let i = 0; i < imagesContents.length; i++) {
                images.push({
                    articleId: this.state.id,
                    image: imagesContents[i]
                })
            }
        }
        let data = {
            title: this.state.articleTitle,
            content: this.state.value.replace(/!\[.*?\]\(data:image.*?\)/g, '![加载中](data:image)'),
            category: {
                id: this.state.categoryId,
            },
            wordCount: this.state.wordCount,
            isPublic: isPublic,
            date: this.state.date,
            description: this.state.value.split('。')[0]
        }
        if (this.state.id !== undefined) {
            data.id = this.state.id
            data.category.name = this.state.article.category.name
            data.views = this.state.article.views
        }
        axios.post(global.constants.server + '/article/add', data)
            .then(res => {
                res = JSON.parse(res.data)
                if (res.status === 1) {
                    notification.open({
                        message: '请求成功',
                        description: '服务器返回信息： ' + res.msg
                    })
                    for(let i = 0; i < images.length; i++) {
                        images[i].articleId = res.data;
                    }
                    if (images.length > 0) {
                        axios.post(global.constants.server + '/article/images/save', images)
                            .then(res => {
                                res = JSON.parse(res.data)
                                if (res.status === 1) {
                                    notification.open({
                                        message: '请求成功',
                                        description: '服务器返回信息： ' + res.msg
                                    })
                                    this.props.history.push('/bk/category/list')
                                } else {
                                    notification.open({
                                        message: '请求失败',
                                        description: '服务器返回信息： ' + res.msg
                                    })
                                }
                            })
                    } else {
                        this.props.history.push('/bk/category/list')
                    }
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
            })
        })
    }

    onChange = (value) => {
        this.setState({
            categoryId: value
        })
    }

    render() {
        return (
            <div>
                {
                    this.state.id !== undefined ?
                        <NavigationBack selectedKeys="article_update" openKeys="article"/> :
                        <NavigationBack selectedKeys="article_add" openKeys="article"/>
                }
                {
                    this.state.id === undefined || this.state.loaded ?
                        (
                            <div id="addArticle">
                                <Input
                                    id="articleTitle"
                                    autocomplete="off"
                                    value={this.state.articleTitle}
                                    onChange={e => {
                                        this.setState({
                                            articleTitle: e.target.value
                                        })
                                    }}
                                    placeholder="输入文章标题"/>
                                <div id="tags">
                                    <span>文章分类：</span>
                                    <Select
                                        showSearch
                                        style={{width: 200}}
                                        optionFilterProp="children"
                                        onChange={this.onChange}
                                        value={this.state.categoryId}
                                        filterOption={(input, option) =>
                                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {
                                            this.state.categoryList.map(item => {
                                                return (
                                                    <Option value={item.id}>{item.name}</Option>
                                                )
                                            })
                                        }
                                    </Select>
                                    <span style={{marginLeft: '30px'}}>日期：</span>
                                    {!this.state.loaded ?
                                        <DatePicker locale={locale}
                                                    defaultValue={moment(new Date().format("yyyy-MM-dd"))}
                                                    onChange={(date, dateString) => {
                                                        this.setState({
                                                            date: dateString
                                                        })
                                                    }}/> :
                                        <DatePicker locale={locale} value={moment(this.state.date, 'YYYY-MM-DD')}
                                                    format='YYYY-MM-DD' onChange={(date, dateString) => {
                                            this.setState({
                                                date: dateString
                                            })
                                        }}/>
                                    }
                                    <span style={{marginLeft: '30px'}}>字数：{this.state.wordCount}字</span>
                                </div>
                                <MdEditor
                                    ref={this.$vm}
                                    toolbar={{
                                        h1: true, // h1
                                        h2: true, // h2
                                        h3: true, // h3
                                        h4: true, // h4
                                        img: true, // 图片
                                        link: false, // 链接
                                        code: true, // 代码块
                                        preview: true, // 预览
                                        expand: true, // 全屏
                                        undo: true, // 撤销
                                        redo: true, // 重做
                                        save: false, // 保存
                                        subfield: true, // 单双栏模式
                                    }}
                                    style={{height: '500px'}}
                                    value={this.state.value}
                                    placeholder=" "
                                    addImg={file => {
                                        // TODO 文件大小限制
                                        const reader = new FileReader()
                                        reader.readAsDataURL(file)
                                        reader.onload = () => {
                                            this.$vm.current.$img2Url(file.name, reader.result)
                                        }
                                    }}
                                    onChange={value => {
                                        this.setState({
                                            value,
                                            wordCount: wordCount(value),
                                        })
                                    }}/>
                                <div id="saveButton">
                                    <Button type="primary" onClick={() => this.saveArticle("0")}>保存为草稿</Button>
                                    <Button type="primary" onClick={() => this.saveArticle("1")}>保存并发布</Button>
                                </div>
                            </div>
                        ) : (
                            <Row style={{height: '80vh'}} type="flex" justify="center" align="middle">
                                <Spin
                                    indicator={<Icon type="loading"
                                                     style={{
                                                         fontSize: 24,
                                                         position: 'relative',
                                                         top: '-2px',
                                                         marginRight: '10px'
                                                     }}
                                                     spin/>}/>
                                <h2 style={{marginLeft: '10px'}}>正在加载，请稍等~</h2>
                            </Row>
                        )
                }
            </div>
        );
    }
}

export default withRouter(ArticleAdd);