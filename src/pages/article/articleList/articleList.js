import React, {Component} from 'react';
import NavigationBack from "../../../components/Navigation_Back/NavigationBack";
import {Icon, List} from "antd";
import './index.css'

class ArticleList extends Component {

    render() {
        const IconText = ({type, text}) => (
            <span>
                <Icon type={type} style={{marginRight: 8}}/>
                {text}
            </span>
        );

        const listData = [];
        for (let i = 0; i < 100; i++) {
            listData.push({
                href: 'http://ant.design',
                title: `ant design part ${i}`,
                description:
                    'Ant Design, a design language for background applications, is refined by Ant UED Team.',
                content:
                    'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
            });
        }

        return (
            <div>
                <NavigationBack selectedKeys="article_list" openKeys="article"/>

                <div id="listArticle">
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
                        dataSource={listData}
                        renderItem={item => (
                            <List.Item
                                actions={[<a key="list-edit">edit</a>,
                                    <a key="list-del">del</a>]}>
                                <List.Item.Meta
                                    title={<a href={item.href}>{item.title}</a>}/>
                            </List.Item>
                        )}/>
                </div>
            </div>
        );
    }
}

export default ArticleList;