/**
 * Balan Studios — WebMCP Integration
 * Exposes studio data and actions as MCP tools that AI agents can call
 * directly from inside the browser tab.
 *
 * Tools registered:
 *  1. get_studio_stats        — Booking counts, revenue overview
 *  2. list_bookings           — All bookings with status/type filters
 *  3. list_pending_requests   — Customers awaiting owner approval
 *  4. approve_customer        — Grant portal access by email
 *  5. decline_customer        — Reject portal access by email
 *  6. list_notifications      — Recent security alerts & activity log
 *  7. get_gallery             — List photo gallery items
 *  8. search_bookings         — Search bookings by name or event type
 */

import '@mcp-b/global';

// ─── Helper: safe localStorage read ────────────────────────────────────────
const readStore = (key, fallback = []) => {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
};

const writeStore = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};

// ─── Register all tools ─────────────────────────────────────────────────────
export function initStudioMCP() {
  // Guard: browser must support WebMCP
  if (typeof document === 'undefined' || !document.modelContext) {
    console.info(
      '[Balan Studios MCP] document.modelContext not available in this browser. ' +
      'Enable chrome://flags/#enable-webmcp-testing to use WebMCP tools.'
    );
    return;
  }

  // ── 1. Studio Stats ──────────────────────────────────────────────────────
  document.modelContext.registerTool({
    name: 'get_studio_stats',
    description:
      'Get Balan Studios overview: total bookings, pending approvals, revenue summary, and recent activity count.',
    inputSchema: { type: 'object', properties: {} },
    execute: async () => {
      const bookings = readStore('studio_bookings', []);
      const requests = readStore('studio_access_requests', []);
      const notifications = readStore('studio_admin_notifications', []);

      const stats = {
        total_bookings: bookings.length,
        confirmed_bookings: bookings.filter(b => b.status === 'confirmed').length,
        pending_bookings: bookings.filter(b => b.status === 'pending').length,
        pending_customer_approvals: requests.filter(r => r.status === 'pending').length,
        unread_notifications: notifications.filter(n => n.unread).length,
        total_customers: readStore('studio_approved_customers', []).length,
      };

      return {
        content: [{ type: 'text', text: JSON.stringify(stats, null, 2) }],
      };
    },
  });

  // ── 2. List Bookings ─────────────────────────────────────────────────────
  document.modelContext.registerTool({
    name: 'list_bookings',
    description:
      'List all Balan Studios bookings. Optionally filter by status (pending/confirmed/completed/cancelled) or event_type.',
    inputSchema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          description: 'Filter by booking status: pending, confirmed, completed, cancelled',
        },
        event_type: {
          type: 'string',
          description: 'Filter by event type e.g. "Wedding Photography"',
        },
        limit: {
          type: 'number',
          description: 'Max number of bookings to return (default 20)',
        },
      },
    },
    execute: async ({ status, event_type, limit = 20 }) => {
      let bookings = readStore('studio_bookings', []);

      if (status) {
        bookings = bookings.filter(b => b.status?.toLowerCase() === status.toLowerCase());
      }
      if (event_type) {
        bookings = bookings.filter(b =>
          b.event_type?.toLowerCase().includes(event_type.toLowerCase())
        );
      }

      const result = bookings.slice(0, limit);

      return {
        content: [
          {
            type: 'text',
            text:
              result.length > 0
                ? JSON.stringify(result, null, 2)
                : `No bookings found${status ? ` with status "${status}"` : ''}${event_type ? ` for event type "${event_type}"` : ''}.`,
          },
        ],
      };
    },
  });

  // ── 3. Search Bookings ───────────────────────────────────────────────────
  document.modelContext.registerTool({
    name: 'search_bookings',
    description: 'Search Balan Studios bookings by client name, phone, or event type.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query — name, phone number, or event keyword',
        },
      },
      required: ['query'],
    },
    execute: async ({ query }) => {
      const bookings = readStore('studio_bookings', []);
      const q = query.toLowerCase();
      const results = bookings.filter(
        b =>
          b.client_name?.toLowerCase().includes(q) ||
          b.phone?.includes(q) ||
          b.email?.toLowerCase().includes(q) ||
          b.event_type?.toLowerCase().includes(q) ||
          b.location?.toLowerCase().includes(q)
      );

      return {
        content: [
          {
            type: 'text',
            text:
              results.length > 0
                ? JSON.stringify(results, null, 2)
                : `No bookings found matching "${query}".`,
          },
        ],
      };
    },
  });

  // ── 4. List Pending Customer Requests ────────────────────────────────────
  document.modelContext.registerTool({
    name: 'list_pending_requests',
    description:
      'List customers currently waiting for Balan Studios owner approval to access the portal.',
    inputSchema: { type: 'object', properties: {} },
    execute: async () => {
      const requests = readStore('studio_access_requests', []);
      const pending = requests.filter(r => r.status === 'pending');

      return {
        content: [
          {
            type: 'text',
            text:
              pending.length > 0
                ? JSON.stringify(pending, null, 2)
                : 'No pending customer access requests at the moment. ✅',
          },
        ],
      };
    },
  });

  // ── 5. Approve Customer ──────────────────────────────────────────────────
  document.modelContext.registerTool({
    name: 'approve_customer',
    description: 'Grant portal access to a customer by their email address.',
    inputSchema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          description: 'Email address of the customer to approve',
        },
      },
      required: ['email'],
    },
    execute: async ({ email }) => {
      const cleanEmail = email.trim().toLowerCase();

      // Update request status
      const requests = readStore('studio_access_requests', []);
      const updated = requests.map(r =>
        r.email.toLowerCase() === cleanEmail ? { ...r, status: 'approved' } : r
      );
      writeStore('studio_access_requests', updated);

      // Add to approved list
      const approved = readStore('studio_approved_customers', []);
      if (!approved.includes(cleanEmail)) {
        approved.push(cleanEmail);
        writeStore('studio_approved_customers', approved);
      }

      // Fire UI update event so Navbar/Dashboard refresh
      window.dispatchEvent(new CustomEvent('studio_notification_update'));

      return {
        content: [
          {
            type: 'text',
            text: `✅ Access approved for ${email}. They can now sign in to Balan Studios portal.`,
          },
        ],
      };
    },
  });

  // ── 6. Decline Customer ──────────────────────────────────────────────────
  document.modelContext.registerTool({
    name: 'decline_customer',
    description: 'Reject a customer portal access request by their email address.',
    inputSchema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          description: 'Email address of the customer to decline',
        },
      },
      required: ['email'],
    },
    execute: async ({ email }) => {
      const cleanEmail = email.trim().toLowerCase();

      const requests = readStore('studio_access_requests', []);
      const updated = requests.map(r =>
        r.email.toLowerCase() === cleanEmail ? { ...r, status: 'declined' } : r
      );
      writeStore('studio_access_requests', updated);

      // Remove from approved list if present
      const approved = readStore('studio_approved_customers', []);
      writeStore('studio_approved_customers', approved.filter(e => e !== cleanEmail));

      window.dispatchEvent(new CustomEvent('studio_notification_update'));

      return {
        content: [
          {
            type: 'text',
            text: `🚫 Access declined for ${email}. Request has been rejected.`,
          },
        ],
      };
    },
  });

  // ── 7. List Notifications ────────────────────────────────────────────────
  document.modelContext.registerTool({
    name: 'list_notifications',
    description:
      'List recent Balan Studios security alerts, owner login events, and customer access activity.',
    inputSchema: {
      type: 'object',
      properties: {
        unread_only: {
          type: 'boolean',
          description: 'If true, return only unread notifications',
        },
        limit: {
          type: 'number',
          description: 'Max number of notifications to return (default 10)',
        },
      },
    },
    execute: async ({ unread_only = false, limit = 10 }) => {
      let notifications = readStore('studio_admin_notifications', []);

      if (unread_only) {
        notifications = notifications.filter(n => n.unread);
      }

      const result = notifications.slice(0, limit);

      return {
        content: [
          {
            type: 'text',
            text:
              result.length > 0
                ? JSON.stringify(result, null, 2)
                : 'No notifications found.',
          },
        ],
      };
    },
  });

  // ── 8. Get Gallery Items ─────────────────────────────────────────────────
  document.modelContext.registerTool({
    name: 'get_gallery',
    description: 'List photo/video gallery items in Balan Studios.',
    inputSchema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: 'Filter by category e.g. "wedding", "portrait", "restoration"',
        },
      },
    },
    execute: async ({ category }) => {
      let gallery = readStore('studio_gallery', []);

      if (category) {
        gallery = gallery.filter(g =>
          g.category?.toLowerCase().includes(category.toLowerCase())
        );
      }

      return {
        content: [
          {
            type: 'text',
            text:
              gallery.length > 0
                ? JSON.stringify(gallery, null, 2)
                : `No gallery items found${category ? ` in category "${category}"` : ''}.`,
          },
        ],
      };
    },
  });

  console.log(
    '%c🎯 Balan Studios MCP Ready',
    'color: #d97706; font-weight: bold; font-size: 14px;',
    '— 8 AI tools registered via WebMCP'
  );
}
