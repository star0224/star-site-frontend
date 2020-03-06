import React, {Component} from 'react';
import NavigationBack from "../../components/Navigation_Back/NavigationBack";
import './index.css'
import StarStatistic from "../../components/Statistic/StarStatistic";

class HomeBack extends Component {
    render() {
        return (
            <div>
                <NavigationBack selectedKeys="dashboard"/>
                <div id="archiveBack">
                    <StarStatistic isBack={true}/>
                </div>
            </div>
        );
    }
}

export default HomeBack;