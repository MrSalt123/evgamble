import React, { useState, useEffect } from 'react';
import axiosInstance from './axiosInstance';
import './styles/Bankroll.css';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBTypography, MDBIcon, MDBBtn, MDBModal, MDBModalDialog, MDBModalContent, MDBModalHeader, MDBModalTitle, MDBModalBody, MDBInputGroup} from 'mdb-react-ui-kit';


const BankrollView = () => {
    const [userData, setUserData] = useState(null);
	const [sessions, setSessions] = useState([]);
	const [optLgModal, setOptLgModal] = useState(false);

	const [formData, setFormData] = useState({
		duration: '',
		buyin: '',
		cashout: '',
		stakes: '',
		notes: ''
	});

	const toggleOpen = () => setOptLgModal(!optLgModal);

	const getCurrentDateTime = () => {
		const now = new Date();
		return now.toISOString(); // outputs in correct format
	};

	const handleSubmit = (e) => {
		setOptLgModal(false);
		const csrftoken = localStorage.getItem('csrftoken');
		const sessionData = {
			session_date: getCurrentDateTime(), // gets current date
			duration: formData.duration, // duration of game
			buy_in: formData.buyin, // total buy in
			cash_out: formData.cashout, // total cashout
			notes: formData.notes, // notes
			stakes: formData.stakes, // stakes of game
			user: "4" // user id
		};

		axiosInstance.post('Sessions/', sessionData, {
			headers: {
				'X-CSRFToken' : csrftoken
			}
		})
			.catch(error => {
				console.error('Error fetching data:', error);
			});
	};

	  const handleChange = (e) => {
		      const { name, value } = e.target;
		      setFormData({ ...formData, [name]: value });
		    };

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axiosInstance.get('User/');
				setUserData(response.data);
				console.log(userData.bankroll);
			} catch (error) {
				console.error('Error: ', error.response?.data?.message);
			}

			try {
				const response = await axiosInstance.get('Sessions/');
				console.log(response);
				setSessions(response.data.results);
			} catch (error) {
				console.error('Error: ', error.response?.data?.message);
			}
		};

		fetchData();
	}, []);

	const formatDate = (dateString) => {
		const date = new Date(dateString);
		const month = date.getUTCMonth() + 1;
		const day = date.getUTCDate();

		return `${month}/${day}`;
	};

	return (
      <div className="Bankroll">
		<div className="header">
			<h2>My Bankroll</h2>
			<h1>${userData?.bankroll}</h1>
		</div>
		<div className='session-box'>
			<MDBBtn id="add-session" onClick={toggleOpen}><span className="material-symbols-outlined">add_circle</span></MDBBtn>
		      <MDBModal open={optLgModal} tabIndex='-1' onClose={() => setOptLgModal(false)}>
		        <MDBModalDialog size='lg'>
		          <MDBModalContent>
		            <MDBModalHeader>
		              <MDBModalTitle>Add Poker Session</MDBModalTitle>
		              <MDBBtn className='btn-close' color='none' onClick={toggleOpen}></MDBBtn>
		            </MDBModalHeader>
		            <MDBModalBody>
						<MDBInputGroup textBefore='Duration' className='mb-3'>
		        <input className='form-control' type='text' value={formData.duration} name="duration" onChange={handleChange}/>
		      </MDBInputGroup>

		      <MDBInputGroup className='mb-3' textBefore='Buy in'>
		        <input className='form-control' type='text' value={formData.buyin} name="buyin" onChange={handleChange}/>
		      </MDBInputGroup>

		      <MDBInputGroup className='mb-3' textBefore='Cash out'>
		        <input className='form-control' type='text' value={formData.cashout} name="cashout" onChange={handleChange}/>
		      </MDBInputGroup>

		      <MDBInputGroup className='mb-3' textBefore='Stakes'>
		        <input className='form-control' type='text' value={formData.stakes} name="stakes" onChange={handleChange}/>
		      </MDBInputGroup>

		      <MDBInputGroup className='mb-3' textBefore='Notes'>
		        <textarea className='form-control' value={formData.notes} name="notes" onChange={handleChange}/>
		      </MDBInputGroup>
				<MDBBtn id="submit" onClick={handleSubmit}>Submit</MDBBtn>
					</MDBModalBody>
		          </MDBModalContent>
		        </MDBModalDialog>
		      </MDBModal>

			{sessions.slice().reverse().map((session, index) => (
				<MDBContainer key={index} className="py-5 h-100">
				        <MDBRow className="justify-content-center align-items-center h-100">
				          <MDBCol lg="6" className="mb-4 mb-lg-0">
				            <MDBCard className="mb-3" style={{ borderRadius: '.5rem' }}>
				              <MDBRow className="g-0">
				                <MDBCol md="12">
				                  <MDBCardBody className="p-4">
				                    <MDBTypography tag="h6">{formatDate(session.session_date)}</MDBTypography>
				                    <hr className="mt-0 mb-4" />
				                    <MDBRow className="pt-1">
				                      <MDBCol size="6" className="mb-3">
				                        <MDBTypography tag="h6">Profit/Loss</MDBTypography>
				                        <MDBCardText className="text-muted">{(session.cash_out) - (session.buy_in)}</MDBCardText>
				                      </MDBCol>
				                      <MDBCol size="6" className="mb-3">
				                        <MDBTypography tag="h6">Stakes</MDBTypography>
				                        <MDBCardText className="text-muted">{session.stakes}</MDBCardText>
				                      </MDBCol>
				                    </MDBRow>

				                    <MDBTypography tag="h6">Notes</MDBTypography>
				                    <hr className="mt-0 mb-4" />
				                    <MDBRow className="pt-1">
				                        <MDBCardText className="text-muted">{session.notes}</MDBCardText>
				                    </MDBRow>
				                  </MDBCardBody>
				                </MDBCol>
				              </MDBRow>
				            </MDBCard>
				          </MDBCol>
				        </MDBRow>
				      </MDBContainer>
				/* <div key={index} className="session">
					<h2>Session: {session.id}</h2>
					<h1>Buy in: {session.buy_in}</h1>
					<h1>Cash out: {session.cash_out}</h1>
					<h1>Date: {formatDate(session.session_date)}</h1>
					<h1>Notes: {session.notes}</h1>
				</div> */
			))}
		</div>
      </div>
    );
}

function Bankroll() {
	return (
		<div>
			<BankrollView />
		</div>
	);
}

export default Bankroll;
