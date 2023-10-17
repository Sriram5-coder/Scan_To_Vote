import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './result.css';
import { Link } from 'react-router-dom';

function Result() {
  const [teamVoteCounts, setTeamVoteCounts] = useState([]);
  const [maxVotes, setMaxVotes] = useState(0);
  const [winningTeam, setWinningTeam] = useState('');

  useEffect(() => {
    // Make a GET request to your Express.js server's API endpoint
    axios.get('https://vote-gijv.onrender.com/team-vote-counts')
      .then((response) => {
        setTeamVoteCounts(response.data);
        const maxCount = Math.max(...response.data.map(teamCount => teamCount.count));
        const winningTeam = response.data.find(teamCount => teamCount.count === maxCount);
  
        setMaxVotes(maxCount);
        setWinningTeam(winningTeam ? winningTeam._id : ''); // Set the team name
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div>
      <div className="elements">
        <h2>Votes Count</h2>
        <Link to="/admin">
          <p style={{ color: 'black', textDecoration: 'none' }}>Back</p>
        </Link>
        <Link to="/">
          <p style={{ color: 'black', textDecoration: 'none' }}>Logout</p>
        </Link>
      </div>
      <table>
        <thead>
          <tr>
            <th>Team</th>
            <th>Votes</th>
          </tr>
        </thead>
        <tbody>
          {teamVoteCounts.map((teamCount) => (
            <tr key={teamCount._id}>
              <td>{teamCount._id}</td>
              <td>{teamCount.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>Maximum votes: {maxVotes}</p>
      <p>Winning team: {winningTeam}</p>
    </div>
  );
}

export default Result;
