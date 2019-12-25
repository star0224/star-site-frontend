import React, {Component} from 'react';
import {HashRouter, Route, withRouter} from "react-router-dom";
import Home from "./pages/home/home";
import App from "./App";
import NoMatch from "./pages/404/noMatch";


class Router extends Component {


    render() {
        return (
            <withRouter>
                <HashRouter>
                    <App>
                        <Route exact path="/" component={Home}/>
                        <Route exact path="/category" component={NoMatch}/>
                    </App>
                </HashRouter>
            </withRouter>
        );
    }
}

export default Router;