import React, {Component, Fragment} from 'react'
import Countdown from 'react-countdown-now';
import {callTokenSc, callSc, getScData} from "../utils";

export default class extends Component {
    INITIAL_STATE = {
        selectedTeamId: this.props.match.idTeam1,
        betAmount: 0,
        userBet: null,
        userWinAmount: null,

        withdrawing: false,
        betting: false,
    }

    state = {
        ...this.INITIAL_STATE
    }

    async componentDidUpdate(prevProps) {
        if (prevProps.match.matchId !== this.props.match.matchId) {
            this.setState({...this.INITIAL_STATE})
            this.updateUserBet()
            this.updateUserWinAmount()
        }
    }

    componentDidMount() {
        this.updateUserBet()
        setInterval(() => {
            this.updateUserBet()
        }, 5000)
    }

    async updateUserBet() {
        const userBet = await callSc('userBet', window.web3.eth.accounts[0], this.props.match.matchId)
        this.setState({
            userBet: {
                valueBet: window.web3.fromWei(userBet[0]).toNumber(),
                isBet: userBet[1],
                isWithdrawn: userBet[3],
                idTeamBet: userBet[2].toNumber(),
            }
        })
        console.log('userBet', this.state.userBet)
    }

    async updateUserWinAmount() {
        const winAmount = await callSc('getWinAmount', window.web3.eth.accounts[0], this.props.match.matchId)
        this.setState({ userWinAmount: +window.web3.fromWei(winAmount).toNumber() })
    }

    countDownRenderer = ({ hours, minutes, seconds, completed }) => {
        if (completed) {
            return <span className='count-down'>Completed</span>
        } else {
            return <span className='count-down'>{hours}:{minutes}:{seconds}</span>;
        }
    };

    async bet() {
        const match = this.props.match
        try {
            await callTokenSc('approveBetAndCall', process.env.REACT_APP_SC_ADDRESS,
                window.web3.toWei(this.state.betAmount),
                this.state.selectedTeamId, match.matchId)
            console.log('update user bet ne')
            this.updateUserBet()
            this.setState({ betting: true })
        } catch (err) {
            alert('Error occurs')
        }
    }

    async withdraw() {
        // Default gas price
        const DEFAULT_MIN_GAS_GWEI = 4
        let gasPrice = await new Promise((resolve, reject) => window.web3.eth.getGasPrice((err, data) => {
            if (err) reject(err)
            else resolve(data)
        }))
        gasPrice = Math.max(+gasPrice, window.web3.fromWei(window.web3.toWei(DEFAULT_MIN_GAS_GWEI), 'gwei'))

        // Send transaction with data
        const data = getScData('withdraw', this.props.match.matchId)
        window.web3.eth.sendTransaction({
            to: process.env.REACT_APP_SC_ADDRESS,
            data,
            gasPrice
        }, (err, data) => {
            if (err) alert('Withdraw error')
            else {
                console.log('WITHDRAWN')
                this.setState({ withdrawing: true })
                this.updateUserBet()
            }
        })
    }

    render() {
        const {idTeam1, idTeam2, nameTeam1, nameTeam2, startTime} = this.props.match

        return (
            <div className='match container d-flex flex-column align-items-center'>
                <h3>{ startTime > new Date().getTime() ? 'Betting' : 'Completed' }</h3>
                <div className='d-flex flex-row align-items-center'>
                    <div className='h-100'>
                        <span className='end-in'>End in:&nbsp;</span>
                    </div>
                    <Countdown date={startTime} renderer={this.countDownRenderer}/>
                </div>
                {(new Date().getTime() < startTime) ? this._renderInfoInBetting() : this._renderInfoAfterBetting()}
            </div>
        )
    }

    _renderInfoInBetting() {
        if (this.state.userBet === null) return <h4>Loading...</h4>
        else {
            const userBet = this.state.userBet
            const match = this.props.match
            if (userBet.isBet) {
                let nameTeamBet
                if (userBet.idTeamBet === match.idTeam1) nameTeamBet = match.nameTeam1
                else if (userBet.idTeamBet === match.idTeam2) nameTeamBet = match.nameTeam2

                return <h4>You bet {nameTeamBet} for {userBet.valueBet} BETT</h4>
            } else if (this.state.betting) {
                return <h4>Betting...</h4>
            } else {
                const {nameTeam1, nameTeam2} = this.props.match

                return <Fragment>
                    <div className="segmented-control mb-3 mt-3">
                        <input type="radio" checked={this.state.selectedTeamId === this.props.match.idTeam1} onChange={e => this.setState({ selectedTeamId: this.props.match.idTeam1 })}/>
                        <label onClick={() => this.setState({ selectedTeamId: this.props.match.idTeam1 })}>
                            {nameTeam1}
                        </label>
                        <input type="radio" checked={this.state.selectedTeamId === this.props.match.idTeam2} onChange={e => this.setState({ selectedTeamId: this.props.match.idTeam1 })}/>
                        <label onClick={() => this.setState({ selectedTeamId: this.props.match.idTeam2 })}>
                            {nameTeam2}
                        </label>
                    </div>

                    <div className="input-bet-container input-group mb-3">
                        <input type="text" className="form-control" placeholder="Amount to bet"
                               aria-label="Recipient's username" aria-describedby="basic-addon2"
                               value={this.state.betAmount}
                               onChange={e => this.setState({ betAmount: e.target.value })}
                        />
                        <div className="input-group-append">
                            <span className="input-group-text" id="basic-addon2">BETT</span>
                        </div>
                        <div className="input-group-append">
                            <button className="btn btn-warning" type="button"
                                    onClick={this.bet.bind(this)}
                            >
                                BET Now!
                            </button>
                        </div>
                    </div>
                </Fragment>
            }
        }
    }

    _renderInfoAfterBetting() {
        if (!this.props.match.hasResult) return <h4>Match finished. Please wait for the result.</h4>

        if (this.state.userBet === null) return <h4>Loading...</h4>
        else {
            if (!this.state.userBet.isBet) {
                return <h4>Time for betting is over</h4>
            }

            if (this.state.userWinAmount == null) {
                this.updateUserWinAmount()
                return null
            }

            const {userBet} = this.state
            if (userBet.isWithdrawn) {
                return <h4>You won {this.state.userWinAmount} BETT and price is withdrawn</h4>
            } else {
                if (this.state.userWinAmount === 0) {
                    return <h4>You've loss! Good luck next time!</h4>
                } else if (this.state.withdrawing) {
                    return <h4>Withdrawing...</h4>
                } else {
                    return <Fragment>
                        <h4>You won {this.state.userWinAmount} BETT!!!</h4>
                        <button className='btn btn-primary'
                                onClick={this.withdraw.bind(this)}
                        >Withdraw</button>
                    </Fragment>
                }
            }
        }
    }
}