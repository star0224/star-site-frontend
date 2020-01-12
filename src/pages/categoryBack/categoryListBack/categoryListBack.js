import React, {Component} from 'react';
import NavigationBack from "../../../components/Navigation_Back/NavigationBack";
import './index.css'
import Category from "../../../components/Category/Category";


class CategoryListBack extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categoryId: props.match.params.id
        }
    }

    render() {
        return (
            <div>
                <NavigationBack selectedKeys="category_list" openKeys="category"/>
                <div id="categoryListBack">
                    {
                        this.state.categoryId !== undefined ?
                            <Category isBackStage={true} categorySelectedKeys={this.state.categoryId}/> :
                            <Category isBackStage={true} categorySelectedKeys="all_category"/>
                    }
                </div>
            </div>
        );
    }
}

export default CategoryListBack;