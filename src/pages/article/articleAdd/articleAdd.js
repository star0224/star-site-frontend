import React, {Component} from 'react'
import NavigationBack from "../../../components/Navigation_Back/NavigationBack"
import MdEditor from "for-editor"
import $ from 'jquery'
import './index.css'
import {Button, Input, notification, Select} from "antd"
import axios from "axios"

const {Option} = Select;

class ArticleAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            inputVisible: false,
            inputValue: '',
            categoryId: '',
            categoryList: [],
            id: props.match.params.id,
            articleTitle: '',
            article: {
                category: {}
            }
        }
    }

    componentDidMount() {
        const _this = this
        this.setState({
            width: $(window).width() - $('#navigation_bk').width()
        })
        if (this.state.id != undefined) {
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
                            value: article.content,
                            categoryId: article.category.id,
                            articleTitle: article.title
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
                            categoryList: res.data
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

    handleChange(value) {
        this.setState({
            value
        })
    }


    // 保存事件
    saveArticle = (isPublic) => {
        let data = {
            "title": this.state.articleTitle,
            "content": this.state.value,
            "articleCategory": {
                "id": this.state.categoryId,
            },
            "isPublic": isPublic
        }
        if (this.state.id != undefined) {
            data.id = this.state.id
            data.articleCategory.name = this.state.article.category.name
        }
        axios.post(global.constants.server + '/article/add', data)
            .then(res => {
                res = JSON.parse(res.data)
                if (res.status === 1) {
                    notification.open({
                        message: '请求成功',
                        description: '服务器返回信息： ' + res.msg
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
                    </div>
                    <MdEditor
                        style={{height: '500px'}}
                        value={this.state.value} placeholder=" "
                        onChange={value => this.handleChange(value)}/>
                    <div id="saveButton">
                        <Button type="primary" onClick={() => this.saveArticle("0")}>保存为草稿</Button>
                        <Button type="primary" onClick={() => this.saveArticle("1")}>保存并发布</Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default ArticleAdd;