const courses = ['B.Tech', 'M.Tech', 'MBA', 'BCA']
const branches = ['CSE', 'ECE', 'EEE', 'ME']

const ResourceFilters = ({ filters, onChange }) => (
  <div
    className="grid gap-4 rounded-3xl border p-5 md:grid-cols-3"
    style={{ background: 'var(--surface-bg)', borderColor: 'var(--surface-border)' }}
  >
    <select
      value={filters.course || ''}
      onChange={(e) => onChange({ ...filters, course: e.target.value || undefined })}
      className="rounded-2xl border px-4 py-3 text-sm transition"
      style={{
        backgroundColor: 'var(--surface-bg)',
        borderColor: 'var(--surface-border)',
        color: 'var(--text-primary)',
      }}
    >
      <option value="">All Courses</option>
      {courses.map((course) => (
        <option key={course} value={course}>
          {course}
        </option>
      ))}
    </select>
    <select
      value={filters.branch || ''}
      onChange={(e) => onChange({ ...filters, branch: e.target.value || undefined })}
      className="rounded-2xl border px-4 py-3 text-sm transition"
      style={{
        backgroundColor: 'var(--surface-bg)',
        borderColor: 'var(--surface-border)',
        color: 'var(--text-primary)',
      }}
    >
      <option value="">All Branches</option>
      {branches.map((branch) => (
        <option key={branch} value={branch}>
          {branch}
        </option>
      ))}
    </select>
    <select
      value={filters.type || ''}
      onChange={(e) => onChange({ ...filters, type: e.target.value || undefined })}
      className="rounded-2xl border px-4 py-3 text-sm transition"
      style={{
        backgroundColor: 'var(--surface-bg)',
        borderColor: 'var(--surface-border)',
        color: 'var(--text-primary)',
      }}
    >
      <option value="">Notes & PYQs</option>
      <option value="note">Notes</option>
      <option value="pyq">PYQs</option>
    </select>
  </div>
)

export default ResourceFilters
