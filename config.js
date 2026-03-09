import { createClient } from 'https://supabase.com/dashboard/project/slqvnuerfaomyudjyjwt'

const SUPABASE_URL = 'https://slqvnuerfaomyudjyjwt.supabase.co'
const SUPABASE_KEY = 'sb_publishable_rmWBKI31bvjTNgefIkkr4A_JvM8LgZ5'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)