import React, {Component} from "react";
import {Icon, Menu, Input} from "antd";
import "./index.css"
import {NavLink} from "react-router-dom";

const {Search} = Input;

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
            case "search":
                break;
            default:
                this.setState({
                    current: e.key,
                })
                console.log("click", e);
                break;
        }
    }

    componentDidMount() {
        if (this.state.current = 'home') {
            const menu = document.getElementById("menu")
            const menuClasses = menu.classList
            window.addEventListener('scroll', function () {
                if (document.documentElement.scrollTop >= 1) {
                    menuClasses.add("halfTransparent")
                    menuClasses.remove("transparent")
                } else {
                    menuClasses.add("transparent")
                    menuClasses.remove("halfTransparent")

                }
            }, false)

            menu.onmouseover = () => {
                if (menuClasses.contains('transparent')) {
                    menuClasses.remove("transparent")
                }
                menuClasses.add("halfTransparent")
            }
            menu.onmouseleave = () => {
                if (document.documentElement.scrollTop <= 1) {
                    if (menuClasses.contains('halfTransparent')) {
                        menuClasses.remove("halfTransparent")
                    }
                    menuClasses.add("transparent")
                }
            }
        }
    }

    render() {
        return (
            <Menu id="menu" className="transparent" onClick={this.handleClick} selectedKeys={[this.state.current]}
                  mode="horizontal" on>
                <Menu.Item id="logoItem" key="logo">
                    <NavLink to="/">
                        <Icon id="logo" type="star" theme="twoTone"/>
                    </NavLink>
                </Menu.Item>
                <Menu.Item key="/" title="首页">
                    <NavLink to="/">
                        首页
                    </NavLink>
                </Menu.Item>
                <Menu.Item key="/category">
                    <NavLink to="/category">
                        分类
                    </NavLink>
                </Menu.Item>
                <Menu.Item key="/archive">
                    <NavLink to="/archive">
                        归档
                    </NavLink>
                </Menu.Item>
                <Menu.Item key="/message">
                    <NavLink to="/message">
                        留言
                    </NavLink>
                </Menu.Item>
                <Menu.Item key="/statistics">
                    <NavLink to="/statistics">
                        统计
                    </NavLink>
                </Menu.Item>
                <Menu.Item id="searchMenu" key="search">
                    <Search id="search" enterButton onSearch={value => console.log(value)}/>
                </Menu.Item>
            </Menu>
        );
    }
}


console.log("hello")

export default Navigation;