import React, {Component} from 'react';
import NavigationBack from "../../../components/Navigation_Back/NavigationBack";
import {Button, Input, notification} from "antd";
import './index.css'
import axios from 'axios'
import {withRouter} from "react-router-dom";

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
                        }).catch(e => {
                            notification.open({
                                message: '请求失败',
                                description: '服务器无响应：' + e,
                            })
                        })
                    }}>提交</Button>
                </div>
            </div>
        );
    }
}

export default withRouter(CategoryAddBack);