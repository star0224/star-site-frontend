import React, {Component} from 'react';
import {BrowserRouter, Route, Switch} from "react-router-dom";
import Home from "./pages/home/home";
import App from "./App";
import HomeBack from "./pages/home_back/homeBack";
import ArticleAdd from "./pages/article/articleAdd/articleAdd";
import ArticleList from "./pages/article/articleList/articleList";
import ArticleInfo from "./components/ArticleInfo/ArticleInfo";
import NoMatch from "./pages/404/noMatch";
import CategoryAddBack from "./pages/categoryBack/categoryAddBack/categoryAddBack";
import CategoryListBack from "./pages/categoryBack/categoryListBack/categoryListBack";
import CategoryList from "./pages/categoryList/categoryList";
import Archive from "./pages/archive/archive";


class Router extends Component {


    render() {
        return (
            <BrowserRouter>
                <App>
                    <Switch>
                        <Route exact path="/" component={Home}/>
                        <Route path="/category/list" component={CategoryList}/>
                        <Route path="/category/:id" component={CategoryList}/>
                        <Route path="/archive" component={Archive} />
                        <Route exact path="/bk" component={HomeBack}/>
                        <Route path="/bk/article/add/new" component={ArticleAdd}/>
                        <Route path="/bk/article/add/:id" component={ArticleAdd}/>
                        <Route path="/bk/article/list" component={ArticleList}/>
                        <Route path="/article/:id" component={ArticleInfo}/>
                        <Route path="/bk/category/add" component={CategoryAddBack} />
                        <Route path="/bk/category/list" component={CategoryListBack} />
                        <Route component={NoMatch}/>
                    </Switch>
                </App>
            </BrowserRouter>
        )
    }
}

export default Router;