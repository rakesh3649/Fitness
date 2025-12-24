import "./Modal.scss";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import ModalComponent from "./ModalComponent";

const Modal = ({ open, onClose }) => {
	const [message, setMessage] = useState("");
	const [isMessageSent, setIsMessageSent] = useState(false);

	// In the handleSubmit function in Modal.jsx, update it to:
const handleSubmit = async (values, { resetForm }) => {
    console.log('Submitting callback form:', values);
    
    try {
        const response = await fetch('http://localhost:5000/api/callback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        });

        console.log('Response status:', response.status);
        
        const data = await response.json();
        console.log('Response data:', data);
        
        if (response.ok) {
            setIsMessageSent(true);
            setMessage("Callback request submitted successfully! We'll contact you within 30 minutes.");
        } else {
            setIsMessageSent(true);
            setMessage(`Error: ${data.message || 'Something went wrong'}`);
        }
    } catch (error) {
        console.error('Fetch error:', error);
        setIsMessageSent(true);
        setMessage('Network error. Please try again later.');
    }
    
    resetForm();
    
    setTimeout(() => {
        setMessage("");
        setIsMessageSent(false);
        onClose();
    }, 3000);
};
	return (
		<AnimatePresence>
			{open && (
				<ModalComponent
					open={open}
					onClose={onClose}
					handleSubmit={handleSubmit} // Pass the updated handleSubmit function
					setIsMessageSent={setIsMessageSent}
					setMessage={setMessage}
					isMessageSent={isMessageSent}
					message={message}
				/>
			)}
		</AnimatePresence>
	);
};

export default Modal;