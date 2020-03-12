import React, {Component} from "react";
import {Input, Menu} from "antd";
import "./index.css"
import {NavLink} from "react-router-dom";

const {Search} = Input;
const {SubMenu} = Menu;

class Navigation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            current: props.current,
            showLogin: props.showLogin,
            init: false
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
                this.setState({
                    current: e.key,
                })
                break;
        }
    }

    componentDidMount() {
        // const menu = document.getElementById('menu')
        // const menuClasses = menu.classList
        // if (this.state.current === 'home') {
        //     window.addEventListener('scroll', function () {
        //         if (document.documentElement.scrollTop >= 1) {
        //             menuClasses.add("halfTransparent")
        //             menuClasses.remove("transparent")
        //         } else {
        //             menuClasses.add("transparent")
        //             menuClasses.remove("halfTransparent")
        //         }
        //     }, false)
        //
        //     menu.onmouseover = () => {
        //         if (menuClasses.contains('transparent')) {
        //             menuClasses.remove("transparent")
        //         }
        //         menuClasses.add("halfTransparent")
        //     }

            // menu.onmouseleave = () => {
            //     if (document.documentElement.scrollTop <= 1) {
            //         if (menuClasses.contains('halfTransparent')) {
            //             menuClasses.remove("halfTransparent")
            //         }
            //         menuClasses.add("transparent")
            //     }
            // }

        // } else {
        //     if (menuClasses.contains('transparent')) {
        //         menuClasses.remove("transparent")
        //     }
        //     menuClasses.add("halfTransparent")
        // }
    }

    render() {
        return (
            <Menu id="menu" className="halfTransparent" onClick={this.handleClick} selectedKeys={[this.state.current]}
                  mode="horizontal" style={{lineHeight: '55px'}}>
                <Menu.Item id="logoItem" key="logo">
                    <NavLink to="/">
                        {/*<Icon id="logo" type="star" theme="twoTone"/>*/}
                        <img alt="star" src={require('../../assets/star.svg')}/>
                    </NavLink>
                </Menu.Item>
                <Menu.Item key="home" title="首页">
                    <NavLink to="/">
                        首页
                    </NavLink>
                </Menu.Item>
                <SubMenu popupClassName="starSubMenu" title="归档">
                    <Menu.Item key="category">
                        <NavLink to="/category/list">
                            文章
                        </NavLink>
                    </Menu.Item>
                    <Menu.Item key="vocabulary">
                        <NavLink to="/vocabulary">
                            词汇
                        </NavLink>
                    </Menu.Item>
                </SubMenu>
                <Menu.Item key="views">
                    <NavLink to="/views">
                        访客
                    </NavLink>
                </Menu.Item>
                <Menu.Item key="archive">
                    <NavLink to="/archive">
                        统计
                    </NavLink>
                </Menu.Item>
                {!this.state.showLogin === true ? (
                    <Menu.Item key="bk">
                        <NavLink to="/bk">
                            管理
                        </NavLink>
                    </Menu.Item>) : ''}
                {this.state.showLogin === true ? (
                    <Menu.Item key="login">
                        <NavLink to="/login">
                            登录
                        </NavLink>
                    </Menu.Item>
                ) : ''}
                <Menu.Item id="searchMenu" key="search">
                    <Search id="search" enterButton onSearch={value => console.log(value)}/>
                </Menu.Item>
            </Menu>
        );
    }
}

export default Navigation;