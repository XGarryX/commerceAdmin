import React, { Component } from 'react'
import '../style/components/Images.less'

class Images extends Component {
    constructor(props) {
        super(props)
        this.handleLoad = this.handleLoad.bind(this)
        this.handleError = this.handleError.bind(this)
    }
    state = {
        loadding: true,
        hasError: false
    }
    handleLoad() {
        const { onLoad } = this.props
        this.setState({loadding: false})
        onLoad && onLoad()
    }
    handleError() {
        const { onError } = this.props
        this.setState({
            loadding: false,
            hasError: true
        })
        onError && onError()
    }
    componentWillReceiveProps() {
        this.setState({
            loadding: true,
            hasError: false
        })
    }
    render() {
        const { loadding, hasError } = this.state
        const { src, alt } = this.props
        return (
            <div className="component-image">
                {loadding && <span className="loading-text">加载中...</span>}
                {!hasError && <img
                    style={{
                        visibility: `${loadding ? 'hidden' : ''}`
                    }}
                    src={src}
                    alt={alt}
                    onLoad={this.handleLoad}
                    onError={this.handleError}
                />}
                {hasError && <p className="errTips">
                    <span className="icon-mood_bad"></span>
                    <span>抱歉，该图片无法显示</span>
                </p>
                }
            </div>
        )
    }
}

export default Images
