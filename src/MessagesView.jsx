
import { useState, useEffect } from 'react'
import { SignedIn, SignedOut, SignIn, UserButton } from "@clerk/clerk-react";
import { familyService } from './services/family'
import './index.css'

export default function MessagesView() {
    const [family, setFamily] = useState([])

    useEffect(() => {
        const unsubscribe = familyService.subscribe(setFamily)
        return () => unsubscribe()
    }, [])

    return (
        <div className="messages-view-container">
            <SignedOut>
                <div className="auth-container">
                    <SignIn />
                </div>
            </SignedOut>

            <SignedIn>
                <div className="messages-header">
                    <h2>Family Dashboard</h2>
                    <UserButton />
                </div>
                <div className="quadrant-grid">
                    {family.map(member => (
                        <div key={member.name} className="quadrant-card">
                            <div className="quadrant-header">
                                <h3>{member.name}</h3>
                            </div>

                            <div className="quadrant-message-area">
                                <div className="message-display" style={{ cursor: 'default', border: 'none', background: 'transparent' }}>
                                    <div className="current-status-large">
                                        {member.status}
                                    </div>
                                    <p className="message-text">
                                        {member.message}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </SignedIn>
        </div>
    )
}
