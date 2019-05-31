import React, { Suspense, lazy, Component } from 'react'
import { connect } from 'react-redux'
import { Spin, Alert } from 'antd'

class LazyPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            page: null
        }
    }
    componentWillMount() {
        this.setState({
            page: lazy(() => import(`../content/${this.props.path}`))
        })
    }
    render() {
        const Page = this.state.page,
            {tabKey, keyValue, prop} = this.props
        return (
            <Suspense
                fallback={
                    tabKey === keyValue && <Spin tip="Loading...">
                        <Alert
                            message="加载中..."
                            description="balabalabala"
                            type="info"
                        />
                    </Spin>
                }
            >
                <div style={{display: (tabKey === keyValue ? 'block' : 'none')}}>
                    <Page {...prop}/>
                </div>
            </Suspense>
        )
    }
    componentDidMount() {
        this.setState({
            hasRender: true
        })
    }
}

const mapStoreToProps = store => {
    const {tab: {tabKey}} = store
    return {
        tabKey
    }
}

export default connect(
    mapStoreToProps
)(LazyPage)
