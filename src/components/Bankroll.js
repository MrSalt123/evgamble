import React, { useState, useEffect } from 'react';
import axiosInstance from './axiosInstance';
import './styles/Bankroll.css';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBTypography, MDBIcon, MDBBtn, MDBModal, MDBModalDialog, MDBModalContent, MDBModalHeader, MDBModalTitle, MDBModalBody, MDBInputGroup} from 'mdb-react-ui-kit';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

const BankrollView = () => {
    const [userData, setUserData] = useState(null);
	const [sessions, setSessions] = useState([]);
	const [modalShow, setModalShow] = useState(false);

	const [formData, setFormData] = useState({
		duration: '',
		buyin: '',
		cashout: '',
		stakes: '',
		notes: ''
	});

	const toggleOpen = () => setModalShow(true);

	const getCurrentDateTime = () => {
		const now = new Date();
		return now.toISOString(); // outputs in correct format
	};

	const handleSubmit = (e) => {
		setModalShow(false);
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
			<Button variant="primary" onClick={() => setModalShow(true)} id="add-session">
		        <span class="material-symbols-outlined">add_circle</span>
		      </Button>

		      <Modal
		        show={modalShow}
		        onHide={() => setModalShow(false)}
		        size="lg"
		        aria-labelledby="contained-modal-title-vcenter"
		        centered
		      >
		        <Modal.Header closeButton>
		          <Modal.Title id="contained-modal-title-vcenter">
		            Add Poker Session
		          </Modal.Title>
		        </Modal.Header>
		        <Modal.Body>

					<InputGroup className="mb-3">
						<InputGroup.Text id="basic-addon1">Duration</InputGroup.Text>
						<Form.Control
							name="duration"
							value={formData.duration}
							onChange={handleChange}
							aria-label="Duration"
							aria-describedby="basic-addon1"
						/>
					</InputGroup>

					<InputGroup className="mb-3">
						<InputGroup.Text id="basic-addon2">Buy in</InputGroup.Text>
						<Form.Control
						name="buyin"
						value={formData.buyin}
						onChange={handleChange}
						aria-label="Buy in"
						aria-describedby="basic-addon2"
						/>
					</InputGroup>

					<InputGroup className="mb-3">
						<InputGroup.Text id="basic-addon1">Cash Out</InputGroup.Text>
						<Form.Control
						name="cashout"
						value={formData.cashout}
						onChange={handleChange}
						aria-label="Cash out"
						aria-describedby="basic-addon1"
						/>
					</InputGroup>
					
					<InputGroup className="mb-3">
						<InputGroup.Text id="basic-addon1">Stakes</InputGroup.Text>
						<Form.Control
						name="stakes"
						value={formData.stakes}
						onChange={handleChange}
						aria-label="Stakes"
						aria-describedby="basic-addon1"
						/>
					</InputGroup>

					<InputGroup>
						<InputGroup.Text>Notes</InputGroup.Text>
						<Form.Control name="notes" value={formData.notes} onChange={handleChange} as="textarea" aria-label="Notes" />
					</InputGroup>
					
		        </Modal.Body>

		        <Modal.Footer>
		          <Button onClick={handleSubmit}>Submit</Button>
		        </Modal.Footer>
		      </Modal>

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
