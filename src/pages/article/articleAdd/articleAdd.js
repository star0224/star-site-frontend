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
        console.log(this.state.id)
    }

    componentDidMount() {
        const _this = this
        this.setState({
            width: $(window).width() - $('#navigation_bk').width()
        })
        if (this.state.id != undefined) {
            axios.get(global.constants.server + "/article?id=" + this.state.id)
                .then(res => {
                    const article = JSON.parse(res.data)
                    _this.setState({
                        article,
                        categoryList: [
                            article.category
                        ],
                        value: article.content,
                        categoryId: article.category.id,
                        articleTitle: article.title
                    })
                })
        } else {
            axios.get(global.constants.server + "/article/category/list")
                .then(res => {
                    _this.setState({
                        categoryList: JSON.parse(res.data)
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
    saveArticle = () => {
        let data = {
            "title": this.state.articleTitle,
            "content": this.state.value,
            "views": 0,
            "likes": 0,
            "isTop": 0,
            "articleCategory": {
                "id": this.state.categoryId,
            }
        }
        if (this.state.id != undefined) {
            data.id = this.state.id
            data.articleCategory.name = this.state.article.category.name
        }
        axios.post(global.constants.server + '/article/add', data)
            .then(res => {
                if (this.state.id != undefined) {
                    notification.open({
                        message: '修改成功',
                        description: 'success'
                    });
                } else {
                    notification.open({
                        message: '插入成功',
                        description: 'success'
                    });
                }
            }).catch(e => {
            notification.open({
                message: '插入失败',
                description: e
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
                        <Button type="primary" onClick={this.saveArticle}>保存</Button>
                        <Button type="primary">保存并发布</Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default ArticleAdd;