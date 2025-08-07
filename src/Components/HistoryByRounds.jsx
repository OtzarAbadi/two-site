import React from 'react';
import axios from 'axios';
import "./HistoryByRounds.css"

class HistoryByRounds extends React.Component {
    state = {
        minRound: 1,
        maxRound: 2,
        histories: [],
    };

    handleChange = (e) => {
        this.setState({ [e.target.name]: Number(e.target.value) });
    };

    getHistory = () => {
        const { leagueId } = this.props;
        const { minRound, maxRound } = this.state;

        const roundNumbers = Array.from(
            { length: maxRound - minRound + 1 },
            (_, i) => minRound + i
        );

        const requests = roundNumbers.map((round) =>
            axios.get(`https://app.seker.live/fm1/round/${leagueId}/${round}`)
        );

        Promise.all(requests).then((resArray) => {
            const allHistories = resArray.map((res) => res.data).flat();
            console.log("All matches from api:", allHistories);
            this.setState({ histories: allHistories });
        });
    };

    render() {
        const { minRound, maxRound, histories } = this.state;

        return (
            <div className={"history-rounds-container"}>
                <h2>Games History By Rounds</h2>
                <label>Min round:</label>
                <input
                    type="number"
                    name="minRound"
                    value={minRound}
                    onChange={this.handleChange}
                />
                <label>Max round:</label>
                <input
                    type="number"
                    name="maxRound"
                    value={maxRound}
                    onChange={this.handleChange}
                />
                <button onClick={this.getHistory}>Show History</button>

                {histories.length > 0 && (
                    <div>
                        <h3>Games Scores:</h3>
                        <ul className={"history-list"}>
                            {this.state.histories.map((match, index) => {
                                if (!match || !match.homeTeam || !match.awayTeam || !match.goals) {
                                    return null;
                                }
                                const homeGoals = match.goals.filter(goal => goal.home).length;
                                const awayGoals = match.goals.filter(goal => !goal.home).length;
                                return (
                                    <li key={index}>
                                        {match.homeTeam.name} {homeGoals} – {awayGoals} {match.awayTeam.name}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}
            </div>
        );
    }
}

export default HistoryByRounds;
