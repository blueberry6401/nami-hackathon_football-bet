import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import Header from "./components/Header";
import Match from "./components/Match";
import MatchList from "./components/MatchList";
import {callSc} from "./utils";

class App extends Component {
    state = {
        selectedMatchId: null,
        matches: null,
    }

    async componentDidMount() {
        this.updateMatches(true)
        setInterval(() => this.updateMatches(), 5000)
    }

    async updateMatches(updateSelected = false) {
        const [matchCount, timeOneMatch] = await Promise.all([
            callSc('currentMatch'),
            callSc('timeOneMatch')
        ])

        const listMatchPromises = []
        for (let i = 1; i <= matchCount; i++) {
            listMatchPromises.push(new Promise(async (resolve, reject) => {
                const result = {
                    matchId: i,
                }

                const listMatch = await callSc('listMatch', i)
                Object.assign(result, {
                    idTeam1: listMatch[0].toNumber(),
                    idTeam2: listMatch[1].toNumber(),
                    startTime: listMatch[2].toNumber() * 1000 - timeOneMatch * 1000,
                    hasResult: listMatch[3].toNumber() !== 0
                })

                const [name1, name2] = await Promise.all([
                    callSc('nameOfTeam', result.idTeam1),
                    callSc('nameOfTeam', result.idTeam2),
                ])
                Object.assign(result, {
                    nameTeam1: name1,
                    nameTeam2: name2,
                })

                resolve(result)
            }))
        }
        const matches = await Promise.all(listMatchPromises)

        // Sort by startTime descending
        matches.sort((x, y) => y.startTime - x.startTime)

        console.log('matches', matches)

        let selectedMatchId
        if (!updateSelected) selectedMatchId = this.state.selectedMatchId
        else if (matches.length) selectedMatchId = matches[matches.length - 1].matchId
        else selectedMatchId = null
        this.setState({
            matches,
            selectedMatchId,
        })
    }

    selectMatch(matchId) {
        this.setState({ selectedMatchId: matchId })
    }

    render() {
        return (
            <div className="App" style={{minHeight: '100%'}}>
                <Header/>
                {this._renderInner()}
            </div>
        );
    }

    _renderInner() {
        if (!this.state.matches) return <h3>Loading...</h3>

        const [match] = this.state.matches.filter(match => match.matchId === this.state.selectedMatchId)

        if (!match) return <h4>No matches at this moment!</h4>

        return <div className='row matches'>
            <div className='col-4'>
                <MatchList onSelect={this.selectMatch.bind(this)} matches={this.state.matches} selectedMatch={this.state.selectedMatchId}/>
            </div>
            <div className='col-8 match-container'>
                <Match match={match}/>
            </div>
        </div>;
    }
}

export default App;
