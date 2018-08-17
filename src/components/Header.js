import React, {Component} from 'react'

export default class extends Component {
    render() {
        return <header className='header'>
            <div className="container-fluid header_top">
                <div className="row header_row">
                    <img className='logo' src='/logo_nami.png'/>
                    <div className='d-flex align-items-center'>
                        <strong>Nami Football Betting</strong>
                    </div>
                </div>
            </div>
        </header>
    }
}