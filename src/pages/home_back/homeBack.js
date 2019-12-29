import React, {Component} from 'react';
import NavigationBack from "../../components/Navigation_Back/NavigationBack";
import './index.css'

class HomeBack extends Component {
    render() {
        return (
            <div>
                <NavigationBack openKeys="article"/>
            </div>
        );
    }
}

export default HomeBack;