import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import '../styles/Chatbot.css'; // Make sure to style your component for a bottom window view

const Chatbot = ({ prescriptions }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const chatContainerRef = useRef(null); // Reference to the chat container

    const apiUrl =
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyD8BcpQmYNZi3lzdAuvV-Uhb8PIFqAc0Sg'; // Replace with your actual API key

    // Function to create a descriptive prompt from the prescriptions array
    const createPrompt = () => {
        if (!prescriptions || prescriptions.length === 0) return 'No prescriptions available.';

        // Generate a summary for each prescription
        return prescriptions
            .map((prescription, index) => {
                return `
**Prescription ${index + 1}:**
- **Doctor Name:** ${prescription.doctorName || 'N/A'}
- **Doctor User ID:** ${prescription.doctorUserId || 'N/A'}
- **Degrees:** ${prescription.doctorDegrees?.join(', ') || 'N/A'}
- **Categories:** ${prescription.doctorCategories?.join(', ') || 'N/A'}
- **Chamber Address:** ${prescription.chamberAddress || 'N/A'}
- **Time:** ${prescription.time || 'N/A'}
- **Serial No:** ${prescription.serialNo || 'N/A'}
- **Patient Name:** ${prescription.patientName || 'N/A'}
- **Patient User ID:** ${prescription.patientUserId || 'N/A'}
- **Address:** ${prescription.address || 'N/A'}
- **Age:** ${prescription.age || 'N/A'}
- **Sex:** ${prescription.sex || 'N/A'}
- **Diagnosis:** ${prescription.diagnosis || 'N/A'}
- **Advice:** ${prescription.advice || 'N/A'}
- **Medicines:**
${prescription.medicines
                        ?.map((medicine, i) => `  - Medicine ${i + 1}: ${medicine.name || 'N/A'}, Dosage: ${medicine.dosage || 'N/A'}`)
                        .join('\n') || 'N/A'}
- **Date:** ${prescription.date || 'N/A'}
        `;
            })
            .join('\n');
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: 'user', text: input },
        ]);
        setInput('');

        const prompt = createPrompt();
        const combinedPrompt = `${prompt}\n\n**User Question:** ${input}`;

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [{ text: combinedPrompt }],
                        },
                    ],
                }),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log('API Response:', data);

            // Extract Markdown text from the response
            const replyText =
                data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from API';

            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: 'bot', text: replyText },
            ]);
        } catch (error) {
            console.error('Error communicating with the API:', error);
            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: 'bot', text: 'Error communicating with the API. Please try again.' },
            ]);
        }
    };

    // Scroll to the bottom of the chat whenever a new message is added
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="chatbot-container">
            <div className="chatbot-header">AI Assistant</div>
            <div className="chatbot-messages" ref={chatContainerRef}>
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`chatbot-message ${message.sender === 'user' ? 'user-message' : 'bot-message'
                            }`}
                    >
                        {message.sender === 'bot' ? (
                            <ReactMarkdown>{message.text}</ReactMarkdown>
                        ) : (
                            <span>{message.text}</span>
                        )}
                    </div>
                ))}
            </div>
            <div className="chatbot-input-container">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type your question..."
                    className="chatbot-input"
                />
                <button onClick={handleSend} className="chatbot-send-button">
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chatbot;
