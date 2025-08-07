import axios from 'axios';
import './App.css';
import React from "react";
import LeaguesTables1 from "./Components/LeaguesTables1";
import HistoryByRounds from "./Components/HistoryByRounds";
import TopScorers from "./Components/TopScorers";
import Statistic from "./Components/Statistic";

class App extends React.Component {
  state={
    leagueId: "",
    leagues: [],
      selectedLeagueId: ""
  };

  componentDidMount() {
      axios.get("https://app.seker.live/fm1/leagues").then(res=>{
          this.setState({leagues: res.data});
      });
  }
  handleLeagueChange=(e)=>{
      this.setState({leagueId: e.target.value});
  }

  render(){
    return (
        <div className="App">
            <select value={this.state.leagueId} onChange={this.handleLeagueChange}>
                <option value="">Choose league</option>
                {this.state.leagues.map(league=> (
                    <option key={league.id} value={league.id}>{league.name}</option>
                ))}
            </select>
        <LeaguesTables1 leagueId={this.state.leagueId} />
            <HistoryByRounds leagueId={this.state.leagueId} />
            <TopScorers leagueId={this.state.leagueId} />
            <Statistic leagueId={this.state.leagueId} />
        </div>
    )
  }
}
export default App;

