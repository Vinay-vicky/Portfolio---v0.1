import { useEffect, useMemo, useState } from 'react'
import {
  deleteAdminMessage,
  fetchAdminMessages,
  markAllAdminMessagesRead,
  updateAdminMessageStatus,
} from '../../features/portfolio/portfolioApi'
import { Archive, CheckCheck, ChevronLeft, ChevronRight, Inbox, Mail, RefreshCw, Reply, Search, Trash2, Undo2, XCircle } from 'lucide-react'

function AdminMessages({ onUnreadCountChange }) {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [appliedQuery, setAppliedQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    totalItems: 0,
    totalPages: 1,
    hasPreviousPage: false,
    hasNextPage: false,
  })
  const [error, setError] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)
  const [markingAllRead, setMarkingAllRead] = useState(false)
  const [stats, setStats] = useState({ total: 0, unread: 0, read: 0, archived: 0 })

  const fetchMessages = async ({ searchText = appliedQuery, pageNumber = page } = {}) => {
    try {
      setError(null)
      const response = await fetchAdminMessages({
        q: searchText,
        status: statusFilter,
        sort: sortBy,
        limit: pageSize,
        page: pageNumber,
      })

      setMessages(response.messages || [])
      setStats(response.stats || { total: 0, unread: 0, read: 0, archived: 0 })

      const nextPagination = response.pagination || {
        page: pageNumber,
        limit: pageSize,
        totalItems: response.messages?.length || 0,
        totalPages: 1,
        hasPreviousPage: false,
        hasNextPage: false,
      }

      setPagination(nextPagination)

      if (nextPagination.page !== page) {
        setPage(nextPagination.page)
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Unable to fetch messages.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setLoading(true)
    fetchMessages({ searchText: appliedQuery, pageNumber: page })
  }, [appliedQuery, statusFilter, sortBy, page, pageSize])

  useEffect(() => {
    if (typeof onUnreadCountChange === 'function') {
      onUnreadCountChange(stats.unread || 0)
    }
  }, [stats.unread, onUnreadCountChange])

  const messageCountLabel = useMemo(() => {
    if (loading) return 'Loading…'
    if (!pagination.totalItems) return 'No messages'
    return `Showing ${messages.length} of ${pagination.totalItems} message${pagination.totalItems === 1 ? '' : 's'}`
  }, [loading, messages.length, pagination.totalItems])

  const formatDateTime = (value) => {
    if (!value) return 'Unknown date'

    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value

    return new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date)
  }

  const handleSearchSubmit = (event) => {
    event.preventDefault()
    setPage(1)
    setAppliedQuery(query.trim())
  }

  const handleClearSearch = () => {
    setQuery('')
    setPage(1)
    setAppliedQuery('')
  }

  const handleDeleteMessage = async (id) => {
    if (!window.confirm('Delete this message permanently?')) return

    try {
      setDeletingId(id)
      setFeedback(null)
      const response = await deleteAdminMessage(id)
      setStats(response.stats || stats)

      const fallbackPage = messages.length === 1 && page > 1 ? page - 1 : page
      setPage(fallbackPage)
      await fetchMessages({ searchText: appliedQuery, pageNumber: fallbackPage })
      setFeedback({ type: 'success', text: 'Message deleted successfully.' })
    } catch (err) {
      setFeedback({ type: 'error', text: err.response?.data?.error || 'Failed to delete message.' })
    } finally {
      setDeletingId(null)
    }
  }

  const handleStatusUpdate = async (id, status) => {
    try {
      setUpdatingId(id)
      setFeedback(null)
      const response = await updateAdminMessageStatus(id, status)
      setStats(response.stats || stats)
      await fetchMessages({ searchText: appliedQuery, pageNumber: page })
      setFeedback({ type: 'success', text: `Message marked as ${status}.` })
    } catch (err) {
      setFeedback({ type: 'error', text: err.response?.data?.error || 'Failed to update status.' })
    } finally {
      setUpdatingId(null)
    }
  }

  const handleMarkAllRead = async () => {
    try {
      setMarkingAllRead(true)
      setFeedback(null)
      const response = await markAllAdminMessagesRead()
      setStats(response.stats || stats)
      setPage(1)
      await fetchMessages({ searchText: appliedQuery, pageNumber: 1 })
      setFeedback({ type: 'success', text: response.message || 'All unread messages marked as read.' })
    } catch (err) {
      setFeedback({ type: 'error', text: err.response?.data?.error || 'Failed to mark all as read.' })
    } finally {
      setMarkingAllRead(false)
    }
  }

  const getStatusBadgeClass = (status) => {
    if (status === 'unread') return 'border-cyan-200 bg-cyan-50 text-cyan-700'
    if (status === 'read') return 'border-emerald-200 bg-emerald-50 text-emerald-700'
    return 'border-violet-200 bg-violet-50 text-violet-700'
  }

  const statusTabs = [
    { id: 'all', label: 'All', count: stats.total },
    { id: 'unread', label: 'Unread', count: stats.unread },
    { id: 'read', label: 'Read', count: stats.read },
    { id: 'archived', label: 'Archived', count: stats.archived },
  ]

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Contact Inbox</h2>
          <p className="mt-1 text-sm text-slate-500">{messageCountLabel}</p>
        </div>

        <button
          type="button"
          onClick={() => {
            setLoading(true)
            fetchMessages({ searchText: appliedQuery, pageNumber: page })
          }}
          className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      <div className="mb-4 grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="flex flex-col gap-1 text-xs font-semibold text-slate-500">
          Sort by
          <select
            value={sortBy}
            onChange={(event) => {
              setSortBy(event.target.value)
              setPage(1)
            }}
            className="min-h-[40px] rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="name-az">Name A-Z</option>
            <option value="name-za">Name Z-A</option>
          </select>
        </label>

        <label className="flex flex-col gap-1 text-xs font-semibold text-slate-500">
          Page size
          <select
            value={pageSize}
            onChange={(event) => {
              setPageSize(Number(event.target.value) || 20)
              setPage(1)
            }}
            className="min-h-[40px] rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
          </select>
        </label>

        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Page</p>
          <p className="mt-1 text-sm font-bold text-slate-800">{pagination.page} / {pagination.totalPages}</p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Total matched</p>
          <p className="mt-1 text-sm font-bold text-slate-800">{pagination.totalItems}</p>
        </div>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {statusTabs.map((tab) => {
          const active = statusFilter === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setStatusFilter(tab.id)
                setPage(1)
              }}
              aria-pressed={active}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition sm:text-sm ${
                active
                  ? 'border-blue-200 bg-blue-50 text-blue-700'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          )
        })}

        <button
          type="button"
          onClick={handleMarkAllRead}
          disabled={markingAllRead || stats.unread === 0}
          className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-70 sm:text-sm"
        >
          <CheckCheck size={14} />
          {markingAllRead ? 'Marking…' : 'Mark all unread as read'}
        </button>
      </div>

      <form onSubmit={handleSearchSubmit} className="mb-5 flex flex-col gap-3 sm:flex-row">
        <label className="relative block flex-1">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="soft-input pl-9"
            placeholder="Search by name, email, subject, or message"
            aria-label="Search contact messages"
          />
        </label>

        <button type="submit" className="btn-primary min-w-[110px]">Search</button>

        {(query || appliedQuery) ? (
          <button
            type="button"
            onClick={handleClearSearch}
            className="btn-secondary min-w-[120px]"
          >
            <span className="inline-flex items-center gap-1.5">
              <XCircle size={14} />
              Clear
            </span>
          </button>
        ) : null}
      </form>

      {feedback ? (
        <div className={`mb-4 rounded-lg border px-3 py-2 text-sm ${feedback.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
          {feedback.text}
        </div>
      ) : null}

      {error ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="flex min-h-[200px] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-blue-500" />
        </div>
      ) : null}

      {!loading && messages.length === 0 ? (
        <div className="glass-card flex min-h-[220px] flex-col items-center justify-center text-center">
          <Inbox size={26} className="text-slate-400" />
          <p className="mt-3 text-sm font-semibold text-slate-700">No messages found</p>
          <p className="mt-1 text-xs text-slate-500">Try adjusting your search keyword or wait for new submissions.</p>
        </div>
      ) : null}

      {!loading && messages.length > 0 ? (
        <div className="space-y-3">
          {messages.map((message) => {
            const subjectText = message.subject?.trim() || '(No subject)'
            const phoneText = message.phone?.trim() || 'Not provided'
            const status = message.status || 'unread'

            return (
              <article key={message.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/60">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-base font-black text-slate-900">{message.name}</h3>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <p className="text-xs text-slate-500">{formatDateTime(message.created_at)}</p>
                      <span className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${getStatusBadgeClass(status)}`}>
                        {status}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href={`mailto:${message.email}?subject=${encodeURIComponent(`Re: ${subjectText}`)}`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
                    >
                      <Reply size={13} />
                      Reply
                    </a>

                    {status !== 'read' ? (
                      <button
                        type="button"
                        onClick={() => handleStatusUpdate(message.id, 'read')}
                        disabled={updatingId === message.id}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        <CheckCheck size={13} />
                        Mark read
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleStatusUpdate(message.id, 'unread')}
                        disabled={updatingId === message.id}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-semibold text-cyan-700 transition hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        <Undo2 size={13} />
                        Mark unread
                      </button>
                    )}

                    {status !== 'archived' ? (
                      <button
                        type="button"
                        onClick={() => handleStatusUpdate(message.id, 'archived')}
                        disabled={updatingId === message.id}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700 transition hover:bg-violet-100 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        <Archive size={13} />
                        Archive
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleStatusUpdate(message.id, 'read')}
                        disabled={updatingId === message.id}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        <Undo2 size={13} />
                        Restore
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDeleteMessage(message.id)}
                      disabled={deletingId === message.id || updatingId === message.id}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      <Trash2 size={13} />
                      {deletingId === message.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>

                <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                  <p className="inline-flex items-center gap-2 text-slate-600">
                    <Mail size={14} className="text-slate-400" />
                    <span className="font-medium">{message.email}</span>
                  </p>
                  <p className="text-slate-600"><span className="font-semibold text-slate-700">Phone:</span> {phoneText}</p>
                  <p className="sm:col-span-2 text-slate-600"><span className="font-semibold text-slate-700">Subject:</span> {subjectText}</p>
                </div>

                <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-relaxed text-slate-700">
                  {message.message}
                </div>
              </article>
            )
          })}

          <div className="mt-4 flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs font-semibold text-slate-600">
              Showing page {pagination.page} of {pagination.totalPages}
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={!pagination.hasPreviousPage || loading}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <ChevronLeft size={13} />
                Previous
              </button>

              <button
                type="button"
                onClick={() => setPage((prev) => prev + 1)}
                disabled={!pagination.hasNextPage || loading}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Next
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default AdminMessages
