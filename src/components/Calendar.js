import React, { Component } from 'react'
import { Input, Calendar } from 'antd'
import moment from 'moment'
import 'moment/locale/zh-cn'
import '../style/components/Calendar.less'

moment.locale('zh-cn')

class Calendars extends Component {
    constructor(props) {
        super(props)
        this.handleFocus = this.handleFocus.bind(this)
        this.handleBlur = this.handleBlur.bind(this)
        this.handleSelect = this.handleSelect.bind(this)
    }
    state = {
        hiden: true
    }
    handleFocus() {
        this.setState({ hiden: false })
    }
    handleBlur(e) {
        !this.calendar.contains(e.target) && this.setState({ hiden: true })
    }
    handleSelect(data) {
        this.setState({
            moment: data
        })
    }
    componentDidMount() {
        window.addEventListener('click', this.handleBlur)
    }
    componentWillUnmount() {
        window.removeEventListener('click', this.handleBlur)
    }
    render() {
        return (
            <div
                style={this.props.style}
                className={`calendar ${this.props.className}`}
                ref={ref => this.calendar = ref}
            >
                <Input
                    className="js-datatime"
                    onFocus={this.handleFocus}
                    value={this.state.moment}
                />
                <div className={`calendar-block ${this.state.hiden ? 'hiden' : ''}`}>
                    <Calendar
                        fullscreen={false}
                        onPanelChange={this.props.onPanelChange}
                        onSelect={this.handleSelect}
                    />
                </div>
            </div>
        )
    }
}

export default Calendars
