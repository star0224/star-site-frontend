import React, {Component} from 'react';
import NavigationBack from "../../../components/Navigation_Back/NavigationBack";
import {Button, Input, notification} from "antd";
import './index.css'
import axios from 'axios'

class CategoryAddBack extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: ""
        }
    }

    render() {

        let category = {
            name: this.state.name
        }

        return (
            <div>
                <NavigationBack selectedKeys="category_add" openKeys="category"/>
                <div id="categoryAdd">
                    <div>新增分类：</div>
                    <Input onChange={(e) => {
                        this.setState({
                            name: e.target.value
                        })
                    }}/>
                    <Button type="primary" onClick={() => {
                        axios.post(global.constants.server + "/article/category/add", JSON.stringify(category), {
                            headers: {
                                'Content-Type': 'application/json;charset=UTF-8'
                            }
                        }).then(res => {
                            const category = JSON.parse(res.data)
                            if (category != null) {
                                notification.open({
                                    message: '插入成功',
                                    description: 'categoryId：' + category.id + ' categoryName: ' + category.name,
                                });
                            } else {
                                notification.open({
                                    message: '插入失败',
                                    description: '请重新尝试',
                                });
                            }
                        }).catch(e => {
                            notification.open({
                                message: '插入失败',
                                description: '错误信息：' + e,
                            });
                        })
                    }}>提交</Button>
                </div>
            </div>
        );
    }
}

export default CategoryAddBack;