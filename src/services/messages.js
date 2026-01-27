import { supabase } from '../supabaseClient'

const STORAGE_KEY = 'deanna_current_message'

export const messageService = {
    // Subscribe to real-time updates
    subscribe: (onUpdate) => {
        if (supabase) {
            // Fetch initial state
            supabase
                .from('messages')
                .select('content')
                .order('created_at', { ascending: false })
                .limit(1)
                .single()
                .then(({ data }) => {
                    if (data) onUpdate(data.content)
                })

            // Real-time subscription
            const channel = supabase
                .channel('public:messages')
                .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
                    onUpdate(payload.new.content)
                })
                .subscribe()

            return () => {
                supabase.removeChannel(channel)
            }
        } else {
            // Local Storage Fallback (for testing in same browser)
            const data = localStorage.getItem(STORAGE_KEY)
            if (data) onUpdate(data)

            const handler = (event) => {
                if (event.key === STORAGE_KEY) {
                    onUpdate(event.newValue)
                }
            }
            window.addEventListener('storage', handler)
            return () => window.removeEventListener('storage', handler)
        }
    },

    // Update the message
    update: async (content) => {
        if (supabase) {
            const { error } = await supabase
                .from('messages')
                .insert([{ content }])

            if (error) throw error
        } else {
            localStorage.setItem(STORAGE_KEY, content)
            // Manually trigger storage event for current tab
            window.dispatchEvent(new Event('storage'))
        }
    }
}
