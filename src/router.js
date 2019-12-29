import React, {Component} from 'react';
import {HashRouter, Route} from "react-router-dom";
import Home from "./pages/home/home";
import App from "./App";
import NoMatch from "./pages/404/noMatch";
import HomeBack from "./pages/home_back/homeBack";
import ArticleAdd from "./pages/article/articleAdd/articleAdd";
import ArticleList from "./pages/article/articleList/articleList";


class Router extends Component {


    render() {
        return (
            <HashRouter>
                <App>
                    <Route exact path="/" component={Home}/>
                    <Route exact path="/bk" component={HomeBack} />
                    <Route path="/bk/article/add" component={ArticleAdd} />
                    <Route path="/bk/article/list" component={ArticleList} />
                    {/*<Route path="*" component={NoMatch}/>*/}
                </App>
            </HashRouter>
        );
    }
}

export default Router;