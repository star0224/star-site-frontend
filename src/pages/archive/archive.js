import React, {Component} from 'react';
import Navigation from "../../components/Navigation/Navigation";
import './index.css'

class Archive extends Component {
    render() {
        return (
            <div>
                <Navigation current="archive"/>
                <div id="archive">
                    <h1>
                        正在维护中...
                    </h1>
                </div>
            </div>
        );
    }
}

export default Archive;