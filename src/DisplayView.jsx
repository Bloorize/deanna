import { useEffect, useState } from 'react'
import { messageService } from './services/messages'
import { familyService } from './services/family'

export default function DisplayView() {
    const [message, setMessage] = useState('<p>Waiting for message...</p>')
    const [family, setFamily] = useState([])

    useEffect(() => {
        const unsubscribeMsg = messageService.subscribe(setMessage)
        const unsubscribeFamily = familyService.subscribe(setFamily)
        return () => {
            unsubscribeMsg()
            unsubscribeFamily()
        }
    }, [])

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
