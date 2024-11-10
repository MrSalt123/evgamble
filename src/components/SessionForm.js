mport React, { useState } from 'react';
import axiosInstance from './axiosInstance';

const SessionForm = ({ onClose, onSave }) => {
	  const [values, setValues] = useState({
		buy_in: '',
		cash_out: '',
		duration: '',
		date: '',
		notes: ''
	  })

	  const handleSubmit = async (e) => {
		    e.preventDefault();
			const csrftoken = localStorage.getItem('csrftoken');
		    const sessionData = {
				"buy_in": values.buy_in,
				"cash_out": values.cash_out,
				"session_date": values.date,
				"duration": values.duration,
				"notes": values.date
			};

		    try {
				const response = await axios.post('Sessions/', sessionData, {
					headers: {
						'X-CSRFToken': csrftoken
					}
				});
			} catch (error) {
				console.error("Error: ", error);
			}
		};

	  return (
		      <div className="modal">
		        <form onSubmit={handleSubmit}>
		          <div>
		            <label>Buy In:</label>
		            <input
		              type="number"
		              value={buyIn}
		              onChange={(e) => setBuyIn(e.target.value)}
		            />
		          </div>
		          <div>
		            <label>Cash Out:</label>
		            <input
		              type="number"
		              value={cashOut}
		              onChange={(e) => setCashOut(e.target.value)}
		            />
		          </div>
		          <div>
		            <label>Duration:</label>
		            <input
		              type="number"
		              value={duration}
		              onChange={(e) => setDuration(e.target.value)}
		            />
		          </div>
		          <div>
		            <label>Date:</label>
		            <input
		              type="date"
		              value={date}
		              onChange={(e) => setDate(e.target.value)}
		            />
		          </div>
		          <div>
		            <label>Notes:</label>
		            <textarea
		              value={notes}
		              onChange={(e) => setNotes(e.target.value)}
		            />
		          </div>
		          <button type="submit">Save</button>
		          <button type="button" onClick={onClose}>Cancel</button>
		        </form>
		      </div>
		    );
};

export default SessionForm;
