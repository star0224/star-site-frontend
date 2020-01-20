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
                    {/*<StarStatistic />*/}
                    <div style={{flexDirection: "column", display: "flex", alignItems: "center", justifyContent: "center", height: "100%"}}>
                        <h1>正在维护中...</h1>
                    </div>
                </div>
            </div>
        );
    }
}

export default Archive;