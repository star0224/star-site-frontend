import React, {Component} from 'react';
import {Menu, Icon} from 'antd';
import './index.css'
import {NavLink} from "react-router-dom";

const {SubMenu} = Menu;

class NavigationBack extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedKeys: props.selectedKeys,
            openKeys: props.openKeys
        }
    }

    render() {
        return (
            <Menu id="navigation_bk"
                  style={{width: '15vw'}}
                  defaultSelectedKeys={[this.state.selectedKeys]}
                  defaultOpenKeys={[this.state.openKeys]}
                  mode="inline">
                <Menu.Item key="back">
                    <NavLink to="/">
                        <Icon type="arrow-left"/>
                    </NavLink>
                </Menu.Item>
                <Menu.Item key="dashboard">
                    <NavLink to="/bk">
                        <span>
                            <Icon type="dashboard"/>
                            <span>统计</span>
                        </span>
                    </NavLink>
                </Menu.Item>
                <Menu.Item key="version">
                    <NavLink to="/bk/version">
                        <Icon type="branches"/>
                        版本
                    </NavLink>
                </Menu.Item>
                <SubMenu key="article" title={
                    <span>
                        <Icon type="read"/>
                        <span>文章</span>
                    </span>
                }>
                    {
                        this.state.selectedKeys !== 'article_update' ?
                            <Menu.Item key="article_add">
                                <NavLink to="/bk/article/add/new">
                                    Article Add 增加
                                </NavLink>
                            </Menu.Item> : ""
                    }
                    {
                        this.state.selectedKeys === 'article_update' ?
                            <Menu.Item key="article_update">
                                Article Update 修改
                            </Menu.Item> : ""
                    }
                    <Menu.Item key="category_add">
                        <NavLink to="/bk/category/add">
                            Category Add 增加
                        </NavLink>
                    </Menu.Item>
                    <Menu.Item key="category_list">
                        <NavLink to="/bk/category/list">
                            Article List 列表
                        </NavLink>
                    </Menu.Item>
                </SubMenu>
                <SubMenu key="vocabulary" title={
                    <span>
                        <Icon type="sort-ascending"/>
                        <span>词汇</span>
                    </span>
                }>
                    {
                        this.state.selectedKeys !== 'vocabulary_update' ?
                            <Menu.Item key="vocabulary_add">
                                <NavLink to="/bk/vocabulary/add/new">
                                    Vocabulary Add 增加
                                </NavLink>
                            </Menu.Item> : ""
                    }
                    {
                        this.state.selectedKeys === 'vocabulary_update' ?
                            <Menu.Item key="vocabulary_update">
                                <NavLink to="/bk/vocabulary/add/new">
                                    Vocabulary Update 修改
                                </NavLink>
                            </Menu.Item> : ""
                    }

                    <Menu.Item key="vocabulary_list">
                        <NavLink to="/bk/vocabulary/list">
                            Vocabulary List 列表
                        </NavLink>
                    </Menu.Item>
                </SubMenu>
            </Menu>
        );
    }
}

export default NavigationBack;