import React, {Component} from "react";
import {Icon, Menu, Input} from "antd";
import "./index.css"
import {NavLink} from "react-router-dom";

const {Search} = Input;

class Navigation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            current: props.current
        }
    }

    handleClick = e => {

        switch (e.key) {
            case "logo":
                this.setState({
                    current: 'home',
                })
                break;
            default:
                break;
        }
    }

    componentDidMount() {
        const menu = document.getElementById("menu")
        const menuClasses = menu.classList
        if (this.state.current === 'home') {
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
        } else {
            if (menuClasses.contains('transparent')) {
                menuClasses.remove("transparent")
            }
            menuClasses.add("halfTransparent")
        }
    }

    render() {
        return (
            <Menu id="menu" className="transparent" onClick={this.handleClick} selectedKeys={[this.state.current]}
                  mode="horizontal">
                <Menu.Item id="logoItem" key="logo">
                    <NavLink to="/">
                        <Icon id="logo" type="star" theme="twoTone"/>
                    </NavLink>
                </Menu.Item>
                <Menu.Item key="home" title="首页">
                    <NavLink to="/">
                        首页
                    </NavLink>
                </Menu.Item>
                <Menu.Item key="category">
                    <NavLink to="/category">
                        分类
                    </NavLink>
                </Menu.Item>
                <Menu.Item key="archive">
                    <NavLink to="/archive">
                        归档
                    </NavLink>
                </Menu.Item>
                <Menu.Item key="bk">
                    <NavLink to="/bk">
                        后台
                    </NavLink>
                </Menu.Item>
                <Menu.Item id="searchMenu" key="search">
                    <Search id="search" enterButton onSearch={value => console.log(value)}/>
                </Menu.Item>
            </Menu>
        );
    }
}

export default Navigation;