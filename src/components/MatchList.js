import React, {Component} from 'react'
import {callSc} from "../utils";

export default class extends Component {
    render() {
        return <div className='match-list'>
            {this.props.matches.map((e) => this._renderThumbnail(e.nameTeam1, e.nameTeam2, e.matchId === this.props.selectedMatch, e.matchId))}
        </div>
    }

    _renderThumbnail(team1, team2, selected = false, key) {
        return (
            <div className={'match' + (selected ? ' selected' : '')} key={key} onClick={this.props.onSelect.bind(this, key)}>
                <span>{team1} - {team2}</span>
            </div>
        )
    }
}