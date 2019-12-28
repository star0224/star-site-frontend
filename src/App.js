import React, {Component} from 'react';
import './App.css';
import 'antd/dist/antd.css';
import ProgressBar from "./components/ProgressBar/ProgressBar";
import Navigation from "./components/Navigation/Navigation";

class App extends Component {
    render() {
        return (
            <div id="app">
                {this.props.children}
            </div>
        );
    }
}

export default App;