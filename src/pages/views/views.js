import React, {Component} from 'react';
import ViewsMap from "../../components/ViewsMap/ViewsMap";
import Navigation from "../../components/Navigation/Navigation";
import $ from "jquery";

class Views extends Component {

    componentDidMount() {
        const width = $('#menu').height()
        $('#views').css('top', width + 'px')
        $('#views').height("calc(100vh - " + width + "px)")
    }

    render() {
        return (
            <div>
                <Navigation current='views'/>
                <div id='views' style={{position: 'absolute', width: '100%', padding: '50px'}}>
                    <ViewsMap/>
                </div>
            </div>
        );
    }
}

export default Views;