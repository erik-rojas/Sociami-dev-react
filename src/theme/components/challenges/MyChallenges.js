import React from 'react';

const Challenges = (props) => {
  return (
    <div className="col-box-wp p-0">
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Success</th>
              <th>Validation</th>
              <th>Reward</th>
              <th>Detail</th>
              <th>Submitted</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Mine 100 Iron Ore</td>
              <td className="gray-text">To Mine 100 Ion Ore in World of Warcraft and give to the Guild</td>
              <td className="yellow-text">100 Iron Ore Mined. Screenshot to be provided</td>
              <td>Creator</td>
              <td>Tokens</td>
              <td>500</td>
              <td className="yellow-text">3</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Challenges;
