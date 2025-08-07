import React from 'react';
import axios from "axios";
import "./LeaguesTables1.css"


class LeaguesTables1 extends React.Component {
    state={
        leagues: [],
        leagueId: "",
        teamId: "",
        leagueTeams:[],
        squad:[],
        history:[],
        leagueTable:[]
    }
    componentDidUpdate(prevProps) {
        if (prevProps.leagueId !== this.props.leagueId) {
            this.getLeagueData();
            this.getAllMatches();
        }
    }
        getLeagueData=()=>{
        const leagueId= this.props.leagueId;
        axios.get(`https://app.seker.live/fm1/teams/${leagueId}`).then((res) => {
            this.setState({leagueTeams: res.data});
        })
        }

    getTeamSquad=(teamId)=>{
        const leagueId=this.props.leagueId;
        axios.get(`https://app.seker.live/fm1/squad/${leagueId}/${teamId}`).then(res=>{
            this.setState({squad: res.data});
        });
    }
    getTeamHistory=(teamId)=>{
        const leagueId=this.props.leagueId;
        axios.get(`https://app.seker.live/fm1/history/${leagueId}/${teamId}`).then(res=>{
            this.setState({history: res.data});
        })
    }
    handleTeam=(teamId)=>{
        this.setState({teamId: teamId});
        this.getTeamSquad(teamId);
        this.getTeamHistory(teamId);
    };
    getAllMatches=()=>{
        const leagueId=this.props.leagueId;
        axios.get(`https://app.seker.live/fm1/history/${leagueId}`).then((res) => {
            const matches=res.data;
            const table={};
            matches.forEach(match=>{
                const home=match.homeTeam;
                const away=match.awayTeam;
                const homeGoals=match.goals.filter(goal=>goal.home).length;
                const awayGoals= match.goals.filter(goal=>!goal.home).length;
                if (!table[home.id]){
                    table[home.id]= {
                        id: home.id,
                        name: home.name,
                        games: 0,
                        wins: 0,
                        draws: 0,
                        losses: 0,
                        goalsFor: 0,
                        goalsAgainst: 0,
                        points: 0
                    };
                    }
            if (!table[away.id]){
                table[away.id]= {
                    id: away.id,
                    name: away.name,
                    games: 0,
                    wins: 0,
                    draws: 0,
                    losses: 0,
                    goalsFor: 0,
                    goalsAgainst: 0,
                    points: 0
                };
                }
                if (typeof homeGoals === 'number' && typeof awayGoals === 'number')
                {
                    console.log(`${home.name} ${homeGoals} - ${awayGoals} ${away.name}`);
                    table[home.id].games += 1;
                table[home.id].goalsFor += homeGoals;
                table[home.id].goalsAgainst += awayGoals;
                table[away.id].games += 1;
                table[away.id].goalsFor += awayGoals;
                table[away.id].goalsAgainst += homeGoals;
                if (homeGoals > awayGoals) {
                    table[home.id].wins += 1;
                    table[home.id].points += 3;
                    table[away.id].losses += 1;
                } else if (homeGoals < awayGoals) {
                    table[away.id].wins += 1;
                    table[away.id].points += 3;
                    table[home.id].losses += 1;
                } else {
                    table[home.id].draws += 1;
                    table[away.id].draws += 1;
                    table[home.id].points += 1;
                    table[away.id].points += 1;
                }
                    }
            });
            const finalTable = Object.values(table).map(team => ({
                ...team,
                goalDifference: team.goalsFor - team.goalsAgainst
            })).sort((a, b) => {
                if (b.points !== a.points) return b.points - a.points;
                if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
                return a.name.localeCompare(b.name);
            });

            this.setState({ leagueTable: finalTable });
        });
            }


    render(){
        return (
            <div className={"container"}>
                {this.state.leagueTeams.length>0 && (
                <table>
                    <thead>
                    <tr>
                        <th>Team ID</th>
                        <th>Team Name</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.leagueTeams.map(team=>(
                        <tr key={team.id} onClick={()=> this.handleTeam(team.id)}>
                        <td>{team.id}</td>
                            <td>{team.name}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                )}
                {this.state.squad.length>0 && (
                    <div>
                        <h3> Squad:</h3>
                        <table>
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Captain</th>
                            </tr>
                            </thead>
                        <tbody>
                        {this.state.squad.map(player=>(
                            <tr key={player.id}>
                                <td>{player.id}</td>
                                <td>{player.firstName}</td>
                                <td>{player.lastName}</td>
                                <td>{player.captain? 'yes': 'no'}</td>
                            </tr>
                        ))}
                        </tbody>
                        </table>
                    </div>
                )}
                {this.state.history.length>0 && (
                    <div>
                    <h3> History:</h3>
                        <ul className="history-list">
                            {this.state.history.map((match, index) => {
                                const homeGoals = match.goals.filter(goal => goal.home).length;
                                const awayGoals = match.goals.filter(goal => !goal.home).length;

                                return (
                                    <li key={index}>
                                        {match.homeTeam.name} {homeGoals} - {awayGoals} {match.awayTeam.name}
                                    </li>
                                );
                            })}
                        </ul>

                    </div>
        )}
                {this.state.leagueTable.length > 0 && (
                    <div>
                        <h3>League Table:</h3>
                        <table>
                            <thead>
                            <tr>
                                <th>Place</th>
                                <th>Team</th>
                                <th>Games</th>
                                <th>Wins</th>
                                <th>Draws</th>
                                <th>Losses</th>
                                <th>Goals For</th>
                                <th>Goals Against</th>
                                <th>Goal Difference</th>
                                <th>Points</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.leagueTable.map((team, index) => {
                                let style = {};
                                if (index === 0) {
                                    style = { color: "blue", fontWeight: "bold" };
                                } else if (index >= this.state.leagueTable.length - 3) {
                                    style = { color: "red" };
                                }

                                return (
                                    <tr key={team.id} style={style}>
                                        <td>{index + 1}</td>
                                        <td>{team.name}</td>
                                        <td>{team.games}</td>
                                        <td>{team.wins}</td>
                                        <td>{team.draws}</td>
                                        <td>{team.losses}</td>
                                        <td>{team.goalsFor}</td>
                                        <td>{team.goalsAgainst}</td>
                                        <td>{team.goalDifference}</td>
                                        <td>{team.points}</td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        )}
}
export default LeaguesTables1;