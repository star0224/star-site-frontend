import React, {Component} from 'react'
import NavigationBack from "../../../components/Navigation_Back/NavigationBack"
import MdEditor from "for-editor"
import $ from 'jquery'
import './index.css'
import {Button, Input, notification, Select} from "antd"
import axios from "axios"

const { Option } = Select;

class ArticleAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            inputVisible: false,
            inputValue: '',
            categoryId: '',
            categoryList: []
        }

    }

    componentDidMount() {
        const _this = this
        this.setState({
            width: $(window).width() - $('#navigation_bk').width()
        })
        axios.get(global.constants.server + "/article/category/list")
            .then(res => {
                _this.setState({
                    categoryList: JSON.parse(res.data)
                })
            })
    }

    handleChange(value) {
        this.setState({
            value
        })
    }


    // 保存事件
    saveArticle = () => {
        let data = {
            "title": $("#articleTitle").val(),
            "content": this.state.value,
            "tags": this.state.tags,
            "views": 0,
            "likes": 0,
            "isTop": 0,
            "articleCategory": {
                "id": this.state.categoryId
            }
        }
        axios.post(global.constants.server + '/article/add', data)
            .then(res => {
                notification.open({
                    message: '插入成功',
                    description: JSON.parse(res.data)
                });
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
                <NavigationBack selectedKeys="article_add" openKeys="article"/>
                <div id="addArticle">
                    <Input
                        id="articleTitle"
                        autocomplete="off"
                        placeholder="输入文章标题" allowClear/>
                    <div id="tags">
                        <span>文章分类：</span>
                        <Select
                            showSearch
                            style={{width: 200}}
                            optionFilterProp="children"
                            onChange={this.onChange}
                            filterOption={(input, option) =>
                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {
                                this.state.categoryList.map(item => {
                                    return(
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