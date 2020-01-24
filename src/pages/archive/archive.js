import React, {Component} from 'react';
import Navigation from "../../components/Navigation/Navigation";
import './index.css'
import StarStatistic from "../../components/Statistic/StarStatistic";
import $ from "jquery";

class Archive extends Component {

    componentDidMount() {
        const width = $('#menu').height()
        $('#archive').css('top', width + 'px')
        $('#archive').height("calc(100vh - " + width + "px)")
    }

    render() {
        return (
            <div>
                <Navigation current="archive"/>
                <div id="archive">
                    <StarStatistic />
                </div>
            </div>
        );
    }
}

export default Archive;