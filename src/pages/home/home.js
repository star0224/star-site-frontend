import React, {Component} from 'react';
import Navigation from "../../components/Navigation/Navigation";
import './index.css'

class Home extends Component {

    render() {
        return (
            <div>
                <Navigation/>
                <div id="background">

                </div>
                {/*<div id="focusinfo">*/}
                {/*    <div id="hometitle">*/}
                {/*        <p>为出生之土而战</p>*/}
                {/*    </div>*/}
                {/*</div>*/}
                <div id="home">
                    This is Home page.
                </div>
            </div>
        );
    }
}

export default Home;