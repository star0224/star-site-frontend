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

    handleClick = e => {

    };

    render() {
        return (
            <Menu id="navigation_bk"
                  onClick={this.handleClick}
                  style={{width: '15vw'}}
                  defaultSelectedKeys={[this.state.selectedKeys]}
                  defaultOpenKeys={[this.state.openKeys]}
                  mode="inline">
                <Menu.Item key="back">
                    <NavLink to="/">
                        <Icon type="arrow-left"/>
                    </NavLink>
                </Menu.Item>
                <SubMenu key="article" title={
                    <span>
                        <Icon type="file-text"/>
                        <span>文章</span>
                    </span>
                }>
                    <Menu.Item key="article_list">
                        <NavLink to="/bk/article/list">
                            Article List 列表
                        </NavLink>
                    </Menu.Item>
                    <Menu.Item key="article_add" title="Add 增加">
                        <NavLink to="/bk/article/add">
                            Article Add 增加
                        </NavLink>
                    </Menu.Item>
                </SubMenu>
                <SubMenu key="category" title={
                    <span>
                        <Icon type="folder-open"/>
                        <span>分类</span>
                    </span>
                }>
                    <Menu.Item key="category_list">
                        <NavLink to="/bk/category/list">
                            Category List 列表
                        </NavLink>
                    </Menu.Item>
                    <Menu.Item key="category_add" title="Add 增加">
                        <NavLink to="/bk/category/add">
                            Category Add 增加
                        </NavLink>
                    </Menu.Item>
                </SubMenu>
            </Menu>
        );
    }
}

export default NavigationBack;