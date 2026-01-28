import { supabase } from '../supabaseClient'

export const journalService = {
    addEntry: async (content) => {
        if (!supabase) return
        const { error } = await supabase
            .from('journal')
            .insert([{ content }])

        if (error) throw error
    },

    getRecentEntries: async (limit = 10) => {
        if (!supabase) return []

        // Get entries from the last 48 hours for context
        const twoDaysAgo = new Date()
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)

        const { data, error } = await supabase
            .from('journal')
            .select('content, created_at')
            .gte('created_at', twoDaysAgo.toISOString())
            .order('created_at', { ascending: false })
            .limit(limit)

        if (error) {
            console.error('Error fetching journal:', error)
            return []
        }
        return data
    }
}
