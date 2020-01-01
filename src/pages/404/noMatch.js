import React, {Component} from 'react';
import Navigation from "../../components/Navigation/Navigation";
import './index.css'

class NoMatch extends Component {
    render() {
        return (
            <div>
                <Navigation/>
                <div id="noMatch">
                    <h1>
                        404 Not Found
                    </h1>
                </div>
            </div>
        );
    }
}

export default NoMatch;