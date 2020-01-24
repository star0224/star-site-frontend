import React, {Component} from 'react';
import {BrowserRouter, Redirect, Route, Switch, useHistory, useLocation} from "react-router-dom";
import {Button, Icon, Input, Modal, notification} from "antd";
import './router.css'
import {loginInfo} from "./config";
import loadable from "./utils/loadable";
import App from "./App";
// import ArticleMobile from "./pages/articleMobile/articleMobile";
// import Version from "./pages/version/version";
// import CategoryList from "./pages/categoryList/categoryList";
// import Archive from "./pages/archive/archive";
// import ArticleInfo from "./components/ArticleInfo/ArticleInfo";
// import HomeBack from "./pages/homeBack/homeBack";
// import ArticleAdd from "./pages/article/articleAdd/articleAdd";
// import CategoryAddBack from "./pages/categoryBack/categoryAddBack/categoryAddBack";
// import CategoryListBack from "./pages/categoryBack/categoryListBack/categoryListBack";
// import NoMatch from "./pages/404/noMatch";
// import HomeMobile from "./pages/homeMobile/homeMobile";
// import NoMatchMobile from "./pages/404Mobile/noMatchMobile";
// import Navigation from "./components/Navigation/Navigation";

const Home = loadable(() => import('./pages/home/home'))
const CategoryList = loadable(() => import('./pages/categoryList/categoryList'))
const Archive = loadable(() => import('./pages/archive/archive'))
const CategoryListBack = loadable(() => import('./pages/categoryBack/categoryListBack/categoryListBack'))
const CategoryAddBack = loadable(() => import('./pages/categoryBack/categoryAddBack/categoryAddBack'))
const NoMatch = loadable(() => import('./pages/404/noMatch'))
const HomeBack = loadable(() => import('./pages/homeBack/homeBack'))
const ArticleAdd = loadable(() => import('./pages/article/articleAdd/articleAdd'))
const ArticleInfo = loadable(() => import('./components/ArticleInfo/ArticleInfo'))
const Navigation = loadable(() => import('./components/Navigation/Navigation'))
const HomeMobile = loadable(() => import('./pages/homeMobile/homeMobile'))
const NoMatchMobile = loadable(() => import('./pages/404Mobile/noMatchMobile'))
const Version = loadable(() => import('./pages/version/version'))
const ArticleMobile = loadable(() => import('./pages/articleMobile/articleMobile'))


export default class Router extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isMobile: false,
            visible: false
        }
    }

    componentDidMount() {
        // 移动端判断逻辑：UA中出现Mobile或者Android则判定为移动端
        let userAgent = navigator.userAgent
        let isMobile = (userAgent.split("Mobile").length >= 2 || userAgent.split("Android").length >= 2)
        this.setState({
            isMobile
        })
        window.onbeforeunload = (e) => {
            if (loginInfo.isLogin) {
                return ''
            }
        }
    }

    render() {
        if (!this.state.isMobile) {
            return (
                // PC端
                <BrowserRouter>
                    <App>
                        <Switch>
                            <Route exact path="/" component={Home}/>
                            <Route path="/login" render={() => <LoginPage/>}/>
                            <Route path="/category/list" component={CategoryList}/>
                            <Route path="/category/:id" component={CategoryList}/>
                            <Route path="/archive" component={Archive}/>
                            <Route path="/article/:id" component={ArticleInfo}/>
                            <PrivateRoute path="/bk">
                                <Switch>
                                    <Route exact path="/bk" component={HomeBack}/>
                                    <Route path="/bk/article/add/new" component={ArticleAdd}/>
                                    <Route path="/bk/article/add/:id" component={ArticleAdd}/>
                                    <Route path="/bk/category/add" component={CategoryAddBack}/>
                                    <Route path="/bk/category/list" component={CategoryListBack}/>
                                    <Route path="/bk/category/:id" component={CategoryListBack}/>
                                    <Route path="/bk/version" component={Version}/>
                                </Switch>
                            </PrivateRoute>
                            <Route component={NoMatch}/>
                        </Switch>
                    </App>
                </BrowserRouter>
            )
        } else {
            return (
                // 移动端
                <BrowserRouter>
                    <div>
                        <Switch>
                            <Route exact path="/" component={HomeMobile}/>
                            <Route path="/mobile/article/:id" component={ArticleMobile}/>
                            <Route component={NoMatchMobile}/>
                        </Switch>
                    </div>
                </BrowserRouter>
            )
        }
    }
}

function LoginPage() {
    let history = useHistory();
    let location = useLocation();
    let {from} = location.state || {from: {pathname: "/"}};
    return (
        <div id="loginPage">
            <Navigation current="login" showLogin={true}/>

            <div id="loginSquare">
                <div id="loginText">
                    身份认证
                </div>

                <Input
                    id="backToken"
                    placeholder="请输入Token"
                    prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                />

                <div>
                    <Button onClick={() => {
                        loginInfo.logIn(() => {
                            if (document.getElementById('backToken').value === 'gx0224') {
                                history.replace(from);
                            } else {
                                notification.open({
                                    message: '请输入正确Token'
                                })
                            }
                        })
                    }} type='primary'>Go~</Button>
                </div>
            </div>
        </div>
    );
}

function PrivateRoute({children}) {
    return (
        <Route
            render={({location}) =>
                loginInfo.isLogin ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: "/login",
                            state: {from: location}
                        }}
                    />
                )
            }
        />
    );
}
