import { useEffect, useState } from 'react'
import { messageService } from './services/messages'
import { familyService } from './services/family'
import { aiService } from './services/ai'

export default function DisplayView() {
    const [message, setMessage] = useState('<p>Waiting for message...</p>')
    const [family, setFamily] = useState([])

    // Chat State
    const [isChatOpen, setIsChatOpen] = useState(false)
    const [question, setQuestion] = useState('')
    const [aiAnswer, setAiAnswer] = useState('')
    const [isThinking, setIsThinking] = useState(false)

    useEffect(() => {
        const unsubscribeMsg = messageService.subscribe(setMessage)
        const unsubscribeFamily = familyService.subscribe(setFamily)
        return () => {
            unsubscribeMsg()
            unsubscribeFamily()
        }
    }, [])

    const handleAsk = async (e) => {
        e.preventDefault()
        if (!question.trim()) return

        setIsThinking(true)
        const answer = await aiService.askQuestion(question)
        setAiAnswer(answer)
        setIsThinking(false)
        setQuestion('')
    }

    const closeChat = () => {
        setIsChatOpen(false)
        setAiAnswer('')
        setQuestion('')
    }

    return (
        <div className="full-screen display-view">
            <div className="family-status-list">
                {family.map((member) => (
                    <div key={member.name} className="family-member">
                        <span>{member.name}:</span>
                        <span className="family-status-emoji">{member.status}</span>
                    </div>
                ))}
            </div>

            {/* Ask Button */}
            <button
                className="ask-btn"
                onClick={() => setIsChatOpen(true)}
            >
                ❓ Ask a Question
            </button>

            {/* Chat Modal */}
            {isChatOpen && (
                <div className="chat-overlay">
                    <div className="chat-modal">
                        <button className="chat-close" onClick={closeChat}>✖</button>

                        {!aiAnswer ? (
                            <>
                                <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>What would you like to know?</h2>
                                <form onSubmit={handleAsk} style={{ width: '100%' }}>
                                    <input
                                        type="text"
                                        className="chat-input"
                                        value={question}
                                        onChange={(e) => setQuestion(e.target.value)}
                                        placeholder="e.g. Did I eat lunch today?"
                                        autoFocus
                                    />
                                    <button
                                        type="submit"
                                        className="chat-submit"
                                        disabled={isThinking}
                                    >
                                        {isThinking ? "Thinking..." : "Ask"}
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="chat-answer">
                                <p>{aiAnswer}</p>
                                <button className="chat-done" onClick={closeChat}>OK, Thanks!</button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div
                className="display-text"
                dangerouslySetInnerHTML={{ __html: message }}
                style={{
                    textAlign: 'center',
                    width: '100%',
                    maxWidth: '900px'
                }}
            />
        </div>
    )
}
