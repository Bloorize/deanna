import { useState, useEffect } from 'react'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import { messageService } from './services/messages'
import { familyService } from './services/family'
import { SignedIn, SignedOut, SignIn, UserButton } from "@clerk/clerk-react";

export default function AdminView() {
    const [input, setInput] = useState('')
    const [status, setStatus] = useState('')
    const [family, setFamily] = useState([])

    useEffect(() => {
        const unsubscribe = familyService.subscribe(setFamily)
        return () => unsubscribe()
    }, [])

    const handleUpdate = async (e) => {
        e.preventDefault()
        try {
            await messageService.update(input)
            setStatus('Updated!')
            setTimeout(() => setStatus(''), 2000)
        } catch (err) {
            console.error(err)
            setStatus('Error updating')
        }
    }

    const handleEmojiUpdate = async (name, emoji) => {
        try {
            await familyService.updateStatus(name, emoji)
        } catch (err) {
            console.error(err)
            alert('Error updating status')
        }
    }

    const presets = [
        "You have a doctor's appointment tomorrow at 10 AM.",
        "Dinner is at 6 PM.",
        "Everything is okay.",
        "The nurse is coming at 2 PM."
    ]

    const emojis = ['🙂', '😡', '😴']

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['clean']
        ],
    }

    return (
        <>
            <SignedOut>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--color-bg)' }}>
                    <SignIn />
                </div>
            </SignedOut>

            <SignedIn>
                <div className="container admin-view">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
                        <h1 style={{ fontSize: 'var(--font-size-heading)', marginBottom: 0 }}>Admin Control</h1>
                        <UserButton showName />
                    </div>

                    <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                        <div style={{ backgroundColor: 'white' }}>
                            <ReactQuill
                                theme="snow"
                                value={input}
                                onChange={setInput}
                                modules={modules}
                                style={{ height: '200px', marginBottom: '50px' }}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn-primary"
                            style={{
                                padding: 'var(--space-md)',
                                backgroundColor: 'var(--color-accent)',
                                color: 'white',
                                border: 'none',
                                borderRadius: 'var(--radius-md)',
                                fontSize: '1.2rem',
                                fontWeight: 'bold',
                                marginTop: 'var(--space-md)'
                            }}
                        >
                            Update Display
                        </button>
                    </form>

                    {status && <p style={{ marginTop: 'var(--space-sm)', color: 'var(--color-accent)' }}>{status}</p>}

                    <div className="admin-family-section">
                        <h3 style={{ marginBottom: 'var(--space-md)' }}>Family Status</h3>
                        {family.map(member => (
                            <div key={member.name} className="admin-family-row">
                                <span style={{ fontWeight: 500 }}>{member.name}</span>
                                <div>
                                    {emojis.map(emoji => (
                                        <button
                                            key={emoji}
                                            className={`emoji-btn ${member.status === emoji ? 'active' : ''}`}
                                            onClick={() => handleEmojiUpdate(member.name, emoji)}
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: 'var(--space-lg)' }}>
                        <h3>Quick Presets</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', marginTop: 'var(--space-sm)' }}>
                            {presets.map((preset, i) => (
                                <button
                                    key={i}
                                    onClick={() => setInput(preset)}
                                    style={{
                                        padding: 'var(--space-sm)',
                                        textAlign: 'left',
                                        backgroundColor: 'white',
                                        border: '1px solid var(--color-border)',
                                        borderRadius: 'var(--radius-md)'
                                    }}
                                >
                                    {preset}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </SignedIn>
        </>
    )
}
