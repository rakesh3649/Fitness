import React, { useState } from "react";
import { Formik, Form, ErrorMessage, Field } from "formik";
import * as Yup from "yup";
import contact from "../../assets/contact.webp";

const ContactForm = () => {
	const [formSubmitted, setFormSubmitted] = useState(false);

	const initialValues = {
		name: "",
		email: "",
		subject: "",
		textarea: "",
	};

	const validationSchema = Yup.object({
		name: Yup.string().required("Name is required").max(20),
		email: Yup.string()
			.required("Email is required")
			.email("Invalid email address"),
		subject: Yup.string()
			.required("Subject is required")
			.min(5, "Subject must be at least 5 characters"),
		textarea: Yup.string()
			.required("Message is required")
			.min(15, "Textarea must be at least 15 characters"),
	});

	// In the handleSubmit function in ContactForm.jsx, update it to:
const handleSubmit = async (values, { resetForm }) => {
    try {
        console.log('Submitting contact form:', values);
        
        // Send data to backend
        const response = await fetch('http://localhost:5000/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: values.name,
                email: values.email,
                subject: values.subject,
                message: values.textarea
            }),
        });

        const data = await response.json();
        console.log('Contact form response:', data);
        
        if (response.ok) {
            setFormSubmitted(true);
            resetForm();

            setTimeout(() => {
                setFormSubmitted(false);
            }, 3000);
        } else {
            console.error('Error submitting form:', data.message);
            // Show error message to user
            alert(`Error: ${data.message || 'Failed to send message'}`);
        }
    } catch (error) {
        console.error('Network error:', error);
        alert('Network error. Please check if backend server is running.');
    }
};
	return (
		<>
			<img
				src={contact}
				alt="Man exercising at the gym."
				className="contact__img"
			/>
			<div className="contact__info">
				<h2 className="contact__title">get in touch</h2>
				<p className="contact__text">
					Get in touch with us! We're ready to assist and chat about your
					questions and needs.
				</p>
				<Formik
					onSubmit={handleSubmit}
					initialValues={initialValues}
					validationSchema={validationSchema}
				>
					<Form className="contact__form">
						<div>
							<Field
								className="contact__input"
								type="text"
								name="name"
								placeholder="Your name"
							/>
							<ErrorMessage
								name="name"
								component="span"
								className="contact__error"
							/>
						</div>
						<div>
							<Field
								className="contact__input"
								type="email"
								name="email"
								placeholder="Your email"
							/>
							<ErrorMessage
								name="email"
								component="span"
								className="contact__error"
							/>
						</div>
						<div>
							<Field
								className="contact__input"
								type="text"
								name="subject"
								placeholder="Your Subject"
							/>
							<ErrorMessage
								name="subject"
								component="span"
								className="contact__error"
							/>
						</div>
						<div>
							<Field
								as="textarea"
								name="textarea"
								placeholder="Write Your Message"
								className="contact__area"
							/>
							<ErrorMessage
								name="textarea"
								component="span"
								className="contact__error contact__error-line"
							/>
						</div>
						<button className="contact__btn" type="submit">
							SEND MESSAGE
						</button>
						{formSubmitted && (
							<p className="contact__sent">
								Your message was sent successfully!
							</p>
						)}
					</Form>
				</Formik>
			</div>
		</>
	);
};

export default ContactForm;
