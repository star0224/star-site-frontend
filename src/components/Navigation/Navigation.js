import React, {Component} from "react";
import {Icon, Menu} from "antd";
import "./index.css"

class Navigation extends Component {

    state = {
        current: "home",
    }


    handleClick = e => {

        switch (e.key) {
            case "logo":
                this.setState({
                    current: 'home',
                })
                break;
            default:
                this.setState({
                    current: e.key,
                })
                console.log("click", e);
        }
    }

    render() {
        return (
            <Menu onClick={this.handleClick} selectedKeys={[this.state.current]} mode="horizontal" on>
                <Menu.Item key="logo">
                    <Icon id="logo" type="star" theme="twoTone" />
                </Menu.Item>
                <Menu.Item key="home">
                    首页
                </Menu.Item>
                <Menu.Item key="category">
                    分类
                </Menu.Item>
                <Menu.Item key="archive">
                    归档
                </Menu.Item>
                <Menu.Item key="message">
                    留言
                </Menu.Item>
                <Menu.Item key="statistics">
                    统计
                </Menu.Item>
            </Menu>
        );
    }
}

export default Navigation;