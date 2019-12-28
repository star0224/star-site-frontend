import React, {Component} from 'react';
import './index.css'

class ArticleInfo extends Component {

    render() {
        return (
            this.props.articleInfos.map((articleInfo, i) => {
                return (
                    <li className="articleInfo" key={i}>
                        <span>{articleInfo.date}</span>
                        <span>
                            <a href="http://localhost:3000">
                                {articleInfo.info}
                            </a>
                        </span>
                    </li>
                )
            })
        );
    }
}

export default ArticleInfo;