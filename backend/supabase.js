const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase;

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-project-url') || supabaseKey.includes('your-service-role-key')) {
    console.warn('\x1b[33m%s\x1b[0m', '⚠️  Supabase credentials missing or invalid in .env. Image uploads to Supabase Storage will fail.');
    // Export a proxy or mock to avoid crashing but log errors when called
    supabase = {
        storage: {
            from: () => ({
                upload: async () => ({ data: null, error: new Error('Supabase credentials not configured') }),
                getPublicUrl: () => ({ data: { publicUrl: null } }),
                remove: async () => ({ data: null, error: new Error('Supabase credentials not configured') })
            })
        }
    };
} else {
    supabase = createClient(supabaseUrl, supabaseKey);
}

/**
 * Uploads a multer file to Supabase Storage and returns the public URL.
 */
async function uploadToSupabase(file, bucket = 'Images') {
    const fileName = `backgrounds/${Date.now()}-${file.originalname}`;
    const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file.buffer, {
            contentType: file.mimetype,
            upsert: false
        });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return publicUrl;
}

/**
 * Extracts the file path from a Supabase public URL and deletes it.
 * URL format: .../storage/v1/object/public/Images/folder/filename.ext
 */
async function deleteFromSupabase(url, bucket = 'Images') {
    if (!url || !url.includes('/storage/v1/object/public/')) return;
    try {
        const parts = url.split(`/public/${bucket}/`);
        if (parts.length < 2) return;
        const filePath = parts[1];
        const { error } = await supabase.storage.from(bucket).remove([filePath]);
        if (error) console.error('Supabase Delete Error:', error);
    } catch (err) {
        console.error('deleteFromSupabase helper error:', err);
    }
}

module.exports = { supabase, uploadToSupabase, deleteFromSupabase };
