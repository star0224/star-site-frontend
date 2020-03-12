import React, {Component} from 'react';
import NavigationBack from "../../components/Navigation_Back/NavigationBack";
import './index.css'
import ViewsMap from "../../components/ViewsMap/ViewsMap";

class BackViews extends Component {


    render() {
        return (
            <div>
                <NavigationBack selectedKeys="backViews"/>
                <div id="backViews">
                    <ViewsMap />
                </div>
            </div>
        );
    }
}

export default BackViews;