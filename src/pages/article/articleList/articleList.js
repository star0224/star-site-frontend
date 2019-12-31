import React, {Component} from 'react'
import NavigationBack from "../../../components/Navigation_Back/NavigationBack"
import {Input, List} from "antd"
import './index.css'
import {NavLink} from "react-router-dom"
import axios from "axios"

const {Search} = Input;

class ArticleList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            articleList: []
        }
    }


    componentDidMount() {
        axios.get(global.constants.server + "/article/list")
            .then(res => {
                this.setState({
                    articleList: JSON.parse(res.data)
                })
            })
    }

    render() {

        return (
            <div>
                <NavigationBack selectedKeys="article_list" openKeys="article"/>

                <div id="listArticle">
                    <Search onSearch={value => console.log(value)} enterButton/>
                    <List
                        id="articleList"
                        itemLayout="horizontal"
                        size="large"
                        pagination={{
                            onChange: page => {
                                console.log(page);
                            },
                            pageSize: 10,
                        }}
                        dataSource={this.state.articleList}
                        renderItem={item => (
                            <List.Item
                                actions={[<a key="list-edit">edit</a>,
                                    <a key="list-del">del</a>]}>
                                <List.Item.Meta
                                    title={<NavLink to={"/bk/article" + item.id}>{item.title}</NavLink>}/>
                            </List.Item>
                        )}/>
                </div>
            </div>
        );
    }
}

export default ArticleList;