import React from 'react';
import axios from 'axios';
import "./TopScorers.css"


class TopScorers extends React.Component {
    state = {
        topScorers: [],
    };

    componentDidUpdate(prevProps) {
        if (prevProps.leagueId !== this.props.leagueId && this.props.leagueId) {
            this.fetchTopScorers();
        }
    }

    fetchTopScorers = () => {
        const { leagueId } = this.props;
        axios.get(`https://app.seker.live/fm1/history/${leagueId}`).then(res => {
            const matches = res.data;
            const scorerMap = {};

            matches.forEach(match => {
                if (!match.goals) return;

                match.goals.forEach(goal => {
                    const player = goal.scorer;
                    if (player && player.id) {
                        const key = player.name;
                        if (!scorerMap[key]) {
                            scorerMap[key] = 1;
                        } else {
                            scorerMap[key]++;
                        }
                    }
                });
            });

            const sortedScorers = Object.entries(scorerMap)
                .map(([name, goals]) => ({ name, goals }))
                .sort((a, b) => b.goals - a.goals)
                .slice(0, 3);

            this.setState({ topScorers: sortedScorers });
        });
    };

    render() {
        return (
            <div className="top-scorers-container">
                <h2>Top Scorers</h2>
                <table>
                    <thead>
                    <tr>
                        <th>Player</th>
                        <th>Goals</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.topScorers.map((scorer, index) => (
                        <tr key={index}>
                            <td>{scorer.name}</td>
                            <td>{scorer.goals}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default TopScorers;
