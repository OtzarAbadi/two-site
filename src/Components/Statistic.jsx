import React from 'react';
import axios from 'axios';
import "./Statistic.css";

class Statistic extends React.Component {
    state = {
        leagueHistory: []
    }

    componentDidUpdate(prevProps) {
        if (prevProps.leagueId !== this.props.leagueId && this.props.leagueId) {
            this.getLeagueHistory();
        }
    }

    getLeagueHistory = () => {
        axios.get(`https://app.seker.live/fm1/history/${this.props.leagueId}`).then(res => {
            this.setState({ leagueHistory: res.data });
        });
    }

    calculateStatistics = () => {
        let firstHalfGoals = 0;
        let secondHalfGoals = 0;
        let earliestGoal = Infinity;
        let latestGoal = -Infinity;
        const goalsByRound = {};

        this.state.leagueHistory.forEach(match => {
            let goalsInThisRound = 0;
            match.goals.forEach(goal => {
                const minute = goal.minute;
                if (minute <= 45) firstHalfGoals++;
                else secondHalfGoals++;
                if (minute < earliestGoal) earliestGoal = minute;
                if (minute > latestGoal) latestGoal = minute;
                goalsInThisRound++;
            });

            const round = match.round;
            if (!goalsByRound[round]) goalsByRound[round] = 0;
            goalsByRound[round] += goalsInThisRound;
        });

        let maxRound = null, minRound = null, maxGoals = -Infinity, minGoals = Infinity;
        Object.entries(goalsByRound).forEach(([round, goals]) => {
            if (goals > maxGoals) {
                maxGoals = goals;
                maxRound = round;
            }
            if (goals < minGoals) {
                minGoals = goals;
                minRound = round;
            }
        });

        return {
            firstHalfGoals,
            secondHalfGoals,
            earliestGoal: earliestGoal === Infinity ? null : earliestGoal,
            latestGoal: latestGoal === -Infinity ? null : latestGoal,
            maxRound,
            maxGoals,
            minRound,
            minGoals
        };
    }

    render() {
        const stats = this.state.leagueHistory.length > 0 ? this.calculateStatistics() : null;

        return (
            <div className="general-stats-container">
                <h1>General Statistics</h1>
                {stats && (
                    <div className="stats-box">
                        <p>Goals in First Half: {stats.firstHalfGoals}</p>
                        <p>Goals in Second Half: {stats.secondHalfGoals}</p>
                        <p>Earliest Goal Minute: {stats.earliestGoal}</p>
                        <p>Latest Goal Minute: {stats.latestGoal}</p>
                        <p>Round with Most Goals: {stats.maxRound} ({stats.maxGoals} goals)</p>
                        <p>Round with Fewest Goals: {stats.minRound} ({stats.minGoals} goals)</p>
                    </div>
                )}
            </div>
        );
    }
}

export default Statistic;
