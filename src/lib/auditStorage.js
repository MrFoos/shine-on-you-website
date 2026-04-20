import { supabase } from './supabase'

async function writeStorageAudit(operation, bucket, path) {
  await supabase.from('audit_log').insert({
    table_name: `storage:${bucket}`,
    operation,
    record_id: path,
    old_data: null,
    new_data: null,
  })
}

export async function storageUpload(bucket, path, file, options = {}) {
  const result = await supabase.storage.from(bucket).upload(path, file, options)
  if (!result.error) writeStorageAudit('STORAGE_UPLOAD', bucket, path)
  return result
}

export async function storageRemove(bucket, paths) {
  const result = await supabase.storage.from(bucket).remove(paths)
  if (!result.error) paths.forEach(p => writeStorageAudit('STORAGE_DELETE', bucket, p))
  return result
}
