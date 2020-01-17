import React, {Component} from 'react';
import {BrowserRouter, Redirect, Route, Switch, useHistory, useLocation} from "react-router-dom";
import Home from "./pages/home/home";
import App from "./App";
import HomeBack from "./pages/home_back/homeBack";
import ArticleAdd from "./pages/article/articleAdd/articleAdd";
import ArticleInfo from "./components/ArticleInfo/ArticleInfo";
import NoMatch from "./pages/404/noMatch";
import CategoryAddBack from "./pages/categoryBack/categoryAddBack/categoryAddBack";
import CategoryListBack from "./pages/categoryBack/categoryListBack/categoryListBack";
import CategoryList from "./pages/categoryList/categoryList";
import Archive from "./pages/archive/archive";
import Navigation from "./components/Navigation/Navigation";
import {Button, Icon, Input} from "antd";
import './router.css'
import {loginInfo} from "./config";

export default class Router extends Component {

    render() {

        return (
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
                                <Route exact path="/bk" component={HomeBack} />
                                <Route path="/bk/article/add/new" component={ArticleAdd}/>
                                <Route path="/bk/article/add/:id" component={ArticleAdd}/>
                                <Route path="/bk/category/add" component={CategoryAddBack}/>
                                <Route path="/bk/category/list" component={CategoryListBack}/>
                                <Route path="/bk/category/:id" component={CategoryListBack}/>
                            </Switch>
                        </PrivateRoute>
                        <Route component={NoMatch}/>
                    </Switch>
                </App>
            </BrowserRouter>
        )
    }
}

function LoginPage() {
    let history = useHistory();
    let location = useLocation();
    let { from } = location.state || { from: { pathname: "/" } };
    return (
        <div id="loginPage">
            <Navigation/>

            <div id="loginSquare">
                <div id="loginText">
                    身份认证
                </div>

                <Input
                    placeholder="请输入Token"
                    prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                />

                <div>
                    <Button onClick={() => {
                        loginInfo.logIn(() => {
                            history.replace(from);
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
            render={({ location }) =>
                loginInfo.isLogin ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: "/login",
                            state: { from: location }
                        }}
                    />
                )
            }
        />
    );
}
