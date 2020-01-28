import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {PrismLight as SyntaxHighlighter} from "react-syntax-highlighter";
import {
    duotoneEarth,
    duotoneLight,
    ghcolors,
    hopscotch, okaidia,
    prism,
    twilight
} from "react-syntax-highlighter/dist/cjs/styles/prism";
import {jsx, java, javascript, kotlin, powershell, sql, typescript, yaml} from "react-syntax-highlighter/dist/cjs/languages/prism";

class CodeBlock extends Component {
    static propType = {
        value: PropTypes.string.isRequired,
        language: PropTypes.string
    }

    static defaultProps = {
        language: null
    }

    componentDidMount() {
        SyntaxHighlighter.registerLanguage("jsx", jsx);
        SyntaxHighlighter.registerLanguage("java", java);
        SyntaxHighlighter.registerLanguage("javascript", javascript);
        SyntaxHighlighter.registerLanguage("kotlin", kotlin);
        SyntaxHighlighter.registerLanguage("powershell", powershell);
        SyntaxHighlighter.registerLanguage("sql", sql);
        SyntaxHighlighter.registerLanguage("typescript", typescript);
        SyntaxHighlighter.registerLanguage("yaml", yaml);
    }

    render() {

        const  {language, value} = this.props

        return (
            <figure className="highlight">
                <SyntaxHighlighter language={language} style={hopscotch}>
                    {value}
                </SyntaxHighlighter>
            </figure>
        );
    }
}

export default CodeBlock;