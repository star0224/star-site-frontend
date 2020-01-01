import React, {Component} from 'react'
import NavigationBack from "../../../components/Navigation_Back/NavigationBack"
import MdEditor from "for-editor"
import $ from 'jquery'
import './index.css'
import {Button, Icon, Input, Tag, Tooltip} from "antd"
import axios from "axios"

class ArticleAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            tags: [],
            inputVisible: false,
            inputValue: '',
        }

    }

    componentDidMount() {
        this.setState({
            width: $(window).width() - $('#navigation_bk').width()
        })
    }

    handleChange(value) {
        this.setState({
            value
        })
    }

    // 处理tag

    handleClose = removedTag => {
        const tags = this.state.tags.filter(tag => tag !== removedTag);
        console.log(tags);
        this.setState({tags});
    };

    showInput = () => {
        this.setState({inputVisible: true}, () => this.input.focus());
    };

    handleInputChange = e => {
        this.setState({inputValue: e.target.value});
    };

    handleInputConfirm = () => {
        const {inputValue} = this.state;
        let {tags} = this.state;
        if (inputValue && tags.indexOf(inputValue) === -1) {
            tags = [...tags, inputValue];
        }
        this.setState({
            tags,
            inputVisible: false,
            inputValue: '',
        });
    };

    saveInputRef = input => (this.input = input);

    // 保存事件
    saveArticle = () => {
        let data = {
            "title": $("#articleTitle").val(),
            "content": this.state.value,
            "tags": this.state.tags,
            "isTop": 0,
            "category": {
                "name": "未分类"
            }
        }
        axios.post(global.constants.server + '/article/add', data)
            .then(res => {
                console.log(res)
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
                        <span>文章标签：</span>
                        {this.state.tags.map((tag, index) => {
                            const isLongTag = tag.length > 20;
                            const tagElem = (
                                <Tag key={tag} closable onClose={() => this.handleClose(tag)}>
                                    {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                                </Tag>
                            );
                            return isLongTag ? (
                                <Tooltip title={tag} key={tag}>
                                    {tagElem}
                                </Tooltip>
                            ) : (
                                tagElem
                            );
                        })}
                        {this.state.inputVisible && (
                            <Input
                                ref={this.saveInputRef}
                                type="text"
                                size="small"
                                style={{width: 78}}
                                value={this.state.inputValue}
                                onChange={this.handleInputChange}
                                onBlur={this.handleInputConfirm}
                                onPressEnter={this.handleInputConfirm}
                            />
                        )}
                        {!this.state.inputVisible && (
                            <Tag onClick={this.showInput} style={{background: '#fff', borderStyle: 'dashed'}}>
                                <Icon type="plus"/> New Tag
                            </Tag>
                        )}
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