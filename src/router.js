import React, {Component} from 'react';
import {HashRouter, Route, Switch} from "react-router-dom";
import Home from "./pages/home/home";
import App from "./App";
import HomeBack from "./pages/home_back/homeBack";
import ArticleAdd from "./pages/article/articleAdd/articleAdd";
import ArticleList from "./pages/article/articleList/articleList";
import ArticleInfo from "./components/ArticleInfo/ArticleInfo";
import NoMatch from "./pages/404/noMatch";


class Router extends Component {


    render() {
        return (
            <HashRouter>
                <App>
                    <Switch>
                        <Route exact path="/" component={Home}/>
                        <Route exact path="/bk" component={HomeBack}/>
                        <Route path="/bk/article/add" component={ArticleAdd}/>
                        <Route path="/bk/article/list" component={ArticleList}/>
                        <Route path="/article/:id" component={ArticleInfo}/>
                        <Route component={NoMatch}/>
                    </Switch>
                </App>
            </HashRouter>
        );
    }
}

export default Router;