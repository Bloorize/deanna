import { supabase } from '../supabaseClient'

export const familyService = {
    subscribe: (onUpdate) => {
        if (!supabase) return () => { }

        // Fetch initial state
        supabase
            .from('family_members')
            .select('*')
            .order('name')
            .then(({ data }) => {
                if (data) onUpdate(data)
            })

        // Real-time subscription
        const channel = supabase
            .channel('public:family_members')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'family_members' }, (payload) => {
                // Simple strategy: re-fetch all to keep sort order and state consistent
                // (Optimization: handle payload directly if list grows large)
                supabase
                    .from('family_members')
                    .select('*')
                    .order('name')
                    .then(({ data }) => {
                        if (data) onUpdate(data)
                    })
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    },

    getMembers: async () => {
        if (!supabase) return []
        const { data, error } = await supabase
            .from('family_members')
            .select('*')
            .order('name')

        if (error) {
            console.error('Error fetching family:', error)
            return []
        }
        return data
    },

    updateStatus: async (name, status) => {
        if (!supabase) return
        const { error } = await supabase
            .from('family_members')
            .update({ status, updated_at: new Date() })
            .eq('name', name)

        if (error) throw error
    }
}
