import React, { Suspense, lazy, Component } from 'react'
import MyLoadingComponent from './MyLoadingComponent'

export default path => {
    class LazyPage extends Component {
        render() {
            const Page = React.lazy(() => import(`../page/${path}`))
            return (
                <Suspense fallback={<div>Loading...</div>}>
                    <Page style={this.props.style}/>
                </Suspense>
            )
        }
    }
    return LazyPage
}
