import React, {Component} from 'react'
import Countdown from 'react-countdown-now';

export default class extends Component {

    countDownRenderer = ({ hours, minutes, seconds, completed }) => {
        if (completed) {
            return <span className='count-down'>Completed</span>
        } else {
            return <span className='count-down'>{hours}:{minutes}:{seconds}</span>;
        }
    };

    render() {
        return (
            <div className='match container d-flex flex-column align-items-center'>
                <h3>Betting</h3>
                <div className='d-flex flex-row align-items-center'>
                    <div className='h-100'>
                        <span className='end-in'>End in:&nbsp;</span>
                    </div>
                    <Countdown date={Date.now() + 10000} renderer={this.countDownRenderer}/>
                </div>

                <div className="segmented-control mb-3 mt-3">
                    <input type="radio" checked/>
                    <label onClick={() => this.setState({ currency: 'nac' })}>
                        Vietnam
                    </label>
                    <input type="radio" checked={false}/>
                    <label onClick={() => this.setState({ currency: 'eth' })}>
                        Laos
                    </label>
                </div>

                <div className="input-bet-container input-group mb-3">
                    <input type="text" className="form-control" placeholder="Amount to bet"
                           aria-label="Recipient's username" aria-describedby="basic-addon2"/>
                    <div className="input-group-append">
                        <span className="input-group-text" id="basic-addon2">BETT</span>
                    </div>
                    <div className="input-group-append">
                        <button className="btn btn-warning" type="button">BET</button>
                    </div>
                </div>
            </div>
        )
    }
}