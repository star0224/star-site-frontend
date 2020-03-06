import React, {Component} from 'react';
import NavigationBack from "../../components/Navigation_Back/NavigationBack";
import VocabularyList from "../../components/VocabularyList/VocabularyList";
import './index.css'

class VocabularyListBack extends Component {
    render() {
        return (
            <div>
                <NavigationBack selectedKeys="vocabulary_list" openKeys="vocabulary"/> :
                <div id="vocabularyList">
                    <VocabularyList isBack={true}/>
                </div>
            </div>
        );
    }
}

export default VocabularyListBack;