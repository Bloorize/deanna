import { useState, useEffect } from 'react'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import { messageService } from './services/messages'
import { familyService } from './services/family'
import { journalService } from './services/journal'
import { SignedIn, SignedOut, SignIn, UserButton } from "@clerk/clerk-react";

export default function AdminView() {
    const [input, setInput] = useState('')
    const [status, setStatus] = useState('')
    const [family, setFamily] = useState([])

    // Journal State
    const [journalInput, setJournalInput] = useState('')

    // Modal State
    const [reasonModal, setReasonModal] = useState({ isOpen: false, name: '', reason: '' })
    const [journalStatus, setJournalStatus] = useState('')
    const [recentMemories, setRecentMemories] = useState([])

    useEffect(() => {
        // Initial load
        let mounted = true

        loadMemories()

        const unsubscribe = familyService.subscribe((data) => {
            if (mounted) setFamily(data)
        })

        return () => {
            mounted = false
            unsubscribe()
        }
    }, [])

    const loadMemories = async () => {
        try {
            const memories = await journalService.getRecentEntries(5)
            setRecentMemories(memories)
        } catch (err) {
            console.error("Error loading memories", err)
        }
    }

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
            // Special Rule: If setting to Angry, require a journal entry
            if (emoji === '😡') {
                setReasonModal({ isOpen: true, name, reason: '' })
                return
            }

            // Update Status
            await familyService.updateStatus(name, emoji)

        } catch (err) {
            console.error(err)
            alert('Error updating status')
        }
    }

    const handleReasonSubmit = async (e) => {
        e.preventDefault()
        const { name, reason } = reasonModal
        if (!reason.trim()) return

        try {
            // 1. Create Journal Entry
            await journalService.addEntry(`${name} is acting 😡 because ${reason}`)

            // 2. Update Status
            await familyService.updateStatus(name, '😡')

            // 3. Cleanup
            setReasonModal({ isOpen: false, name: '', reason: '' })
            loadMemories()

        } catch (err) {
            console.error(err)
            alert('Error saving reason')
        }
    }

    const handleJournalSubmit = async (e) => {
        e.preventDefault()
        if (!journalInput.trim()) return

        try {
            await journalService.addEntry(journalInput)
            setJournalInput('')
            setJournalStatus('Saved to Memory!')
            loadMemories() // Refresh list
            setTimeout(() => setJournalStatus(''), 2000)
        } catch (err) {
            console.error("Journal Error", err)
            setJournalStatus('Error saving: ' + (err.message || 'Unknown error'))
        }
    }

    const presets = [
        "You have a doctor's appointment tomorrow.",
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
                {reasonModal.isOpen && (
                    <div className="modal-overlay" style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000
                    }}>
                        <div style={{
                            backgroundColor: 'white',
                            padding: 'var(--space-md)',
                            borderRadius: 'var(--radius-md)',
                            width: '90%',
                            maxWidth: '400px',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}>
                            <h3>Why is {reasonModal.name} angry?</h3>
                            <form onSubmit={handleReasonSubmit}>
                                <input
                                    type="text"
                                    value={reasonModal.reason}
                                    onChange={e => setReasonModal({ ...reasonModal, reason: e.target.value })}
                                    placeholder="Reason (required)"
                                    autoFocus
                                    style={{
                                        width: '100%',
                                        padding: 'var(--space-sm)',
                                        margin: 'var(--space-md) 0',
                                        borderRadius: 'var(--radius-sm)',
                                        border: '1px solid #ccc'
                                    }}
                                />
                                <div style={{ display: 'flex', gap: 'var(--space-sm)', justifyContent: 'flex-end' }}>
                                    <button
                                        type="button"
                                        onClick={() => setReasonModal({ isOpen: false, name: '', reason: '' })}
                                        style={{
                                            padding: '8px 16px',
                                            border: '1px solid #ccc',
                                            background: 'white',
                                            borderRadius: 'var(--radius-sm)',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        style={{
                                            padding: '8px 16px',
                                            border: 'none',
                                            background: 'var(--color-accent)',
                                            color: 'white',
                                            borderRadius: 'var(--radius-sm)',
                                            cursor: 'pointer',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        Save & Set Angry
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                <div className="container admin-view">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
                        <h1 style={{ fontSize: 'var(--font-size-heading)', marginBottom: 0 }}>Admin Control</h1>
                        <UserButton showName />
                    </div>

                    {/* Main Message Control */}
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

                    {/* Family Status */}
                    <div className="admin-family-section">
                        <h3 style={{ marginBottom: 'var(--space-md)' }}>Family Status</h3>
                        {family.map(member => (
                            <div key={member.name} className="admin-family-row">
                                <span style={{ fontWeight: 500 }}>{member.name}</span>
                                <div>
                                    {emojis.map(emoji => (
                                        <button
                                            key={emoji}
                                            type="button"
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

                    {/* AI Journal Section */}
                    <div style={{ marginTop: 'var(--space-lg)', background: 'white', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                        <h3>Daily Journal (AI Memory)</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-sm)' }}>
                            Log events here so Deanna can ask about them later.
                        </p>
                        <form onSubmit={handleJournalSubmit} style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                            <input
                                type="text"
                                value={journalInput}
                                onChange={(e) => setJournalInput(e.target.value)}
                                placeholder="e.g. Lunch at Olive Garden, Mitch visited..."
                                style={{
                                    flex: 1,
                                    padding: 'var(--space-sm)',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--color-border)',
                                    fontSize: '1rem'
                                }}
                            />
                            <button
                                type="submit"
                                style={{
                                    padding: 'var(--space-sm) var(--space-md)',
                                    backgroundColor: 'var(--color-text-secondary)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: 'var(--radius-md)',
                                    fontWeight: 'bold'
                                }}
                            >
                                Save
                            </button>
                        </form>
                        {journalStatus && <p style={{ marginTop: 'var(--space-sm)', color: 'green' }}>{journalStatus}</p>}

                        {/* Memory List */}
                        <div style={{ marginTop: 'var(--space-md)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-sm)' }}>
                            <h4 style={{ fontSize: '0.9rem', color: '#666', marginBottom: 'var(--space-sm)' }}>Recent Memories:</h4>
                            {recentMemories.length === 0 && <p style={{ fontSize: '0.8rem', fontStyle: 'italic', color: '#999' }}>No recent entries found (or connection error).</p>}
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {recentMemories.map((mem, i) => (
                                    <li key={i} style={{ fontSize: '0.9rem', marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
                                        <span>{mem.content}</span>
                                        <span style={{ color: '#999', fontSize: '0.8rem' }}>{new Date(mem.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
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
