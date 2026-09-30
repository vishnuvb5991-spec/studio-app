/**
 * Balan Studios MCP Server
 * Connects Balan Studios Management App to AI Assistants (Gemini, Antigravity, Claude, Cursor)
 * Exposes tools for managing bookings, customer portal access, studio stats, and photography packages.
 */

const { McpServer } = require('@modelcontextprotocol/sdk/server/mcp.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { z } = require('zod');
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'studio-data.json');

// Initial default data
const DEFAULT_DATA = {
  studio_info: {
    name: "Balan Studios",
    owner: "Balan",
    phone: "+91 8129788272",
    email: "vishnuvb5991@gmail.com",
    website: "https://preetha-studio-app.surge.sh",
    tagline: "Capturing Timeless Elegance & Memories with Cinematic Artistry",
    location: "Kerala, India",
    working_hours: "09:00 AM - 08:30 PM (Mon - Sun)"
  },
  packages: [
    {
      id: "pkg-1",
      name: "Royal Wedding Cinematic Package",
      price_inr: 85000,
      description: "Full wedding coverage including traditional + candid photography, 4K cinematic film, drone aerial coverage, luxury velvet photo album (40 pages), and teaser trailer.",
      category: "Wedding"
    },
    {
      id: "pkg-2",
      name: "Classic Wedding & Reception",
      price_inr: 55000,
      description: "Traditional photography & HD video coverage for ceremony and reception with premium embossed photo book.",
      category: "Wedding"
    },
    {
      id: "pkg-3",
      name: "Pre-Wedding / Post-Wedding Shoot",
      price_inr: 25000,
      description: "Outdoor destination couple shoot with costume changes, candid photography, and 1-minute cinematic reel.",
      category: "Couples"
    },
    {
      id: "pkg-4",
      name: "Portrait & Model Portfolio",
      price_inr: 8000,
      description: "In-studio session with 3 lighting styles, 15 retouched high-resolution digital portraits, and web gallery.",
      category: "Portrait"
    },
    {
      id: "pkg-5",
      name: "Heritage Photo Restoration",
      price_inr: 1500,
      description: "Digital scanning, scratch/tear repair, color restoration, face reconstruction, and premium framed print.",
      category: "Restoration"
    }
  ],
  bookings: [
    {
      id: "BK-1001",
      client_name: "Rahul & Sneha Nair",
      phone: "+91 9847123456",
      email: "rahul.nair@example.com",
      event_type: "Royal Wedding Cinematic Package",
      date: "2026-11-15",
      venue: "Grand Palace Auditorium, Kochi",
      status: "confirmed",
      total_amount_inr: 85000,
      advance_paid_inr: 30000,
      notes: "Drone coverage requested for outdoor procession."
    },
    {
      id: "BK-1002",
      client_name: "Arjun Verma",
      phone: "+91 9745987654",
      email: "arjun.verma@example.com",
      event_type: "Pre-Wedding Shoot",
      date: "2026-10-20",
      venue: "Vagamon Pine Forest",
      status: "pending",
      total_amount_inr: 25000,
      advance_paid_inr: 5000,
      notes: "Golden hour sunset lighting requested."
    },
    {
      id: "BK-1003",
      client_name: "Meera Pillai",
      phone: "+91 9447112233",
      email: "meera.pillai@example.com",
      event_type: "Portrait & Model Portfolio",
      date: "2026-10-05",
      venue: "Balan Studios Floor 1",
      status: "completed",
      total_amount_inr: 8000,
      advance_paid_inr: 8000,
      notes: "Delivered 15 retouched digital portraits."
    }
  ],
  customer_access_requests: [
    {
      id: "req-1",
      email: "ananya.s@gmail.com",
      full_name: "Ananya Sharma",
      requested_at: "2026-09-26T18:30:00Z",
      status: "pending",
      device: "Mobile Chrome"
    }
  ]
};

// Data persistence helpers
function loadData() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_DATA, null, 2), 'utf-8');
      return DEFAULT_DATA;
    }
    const content = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Error reading studio data file:', err);
    return DEFAULT_DATA;
  }
}

function saveData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing studio data file:', err);
    return false;
  }
}

// Initialize server
const server = new McpServer({
  name: "preetha-studio",
  version: "1.0.0"
});

// Tool 1: Get studio overview info
server.tool(
  "get_studio_info",
  "Get Balan Studios business profile, owner name (Balan), phone, website, and operating hours.",
  {},
  async () => {
    const data = loadData();
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data.studio_info, null, 2)
        }
      ]
    };
  }
);

// Tool 2: Get studio dashboard stats
server.tool(
  "get_studio_stats",
  "Get Balan Studios key metrics: total bookings, confirmed, pending, completed counts, total revenue, and pending customer portal access requests.",
  {},
  async () => {
    const data = loadData();
    const bookings = data.bookings || [];
    const requests = data.customer_access_requests || [];

    const totalRevenue = bookings.reduce((sum, b) => sum + (b.total_amount_inr || 0), 0);
    const advanceCollected = bookings.reduce((sum, b) => sum + (b.advance_paid_inr || 0), 0);

    const stats = {
      studio_name: data.studio_info.name,
      owner: data.studio_info.owner,
      total_bookings: bookings.length,
      confirmed_bookings: bookings.filter(b => b.status === 'confirmed').length,
      pending_bookings: bookings.filter(b => b.status === 'pending').length,
      completed_bookings: bookings.filter(b => b.status === 'completed').length,
      cancelled_bookings: bookings.filter(b => b.status === 'cancelled').length,
      total_booking_value_inr: totalRevenue,
      advance_collected_inr: advanceCollected,
      pending_customer_approvals: requests.filter(r => r.status === 'pending').length
    };

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(stats, null, 2)
        }
      ]
    };
  }
);

// Tool 3: List bookings with optional filters
server.tool(
  "list_bookings",
  "List Balan Studios bookings with optional status filter (confirmed, pending, completed, cancelled) or limit.",
  {
    status: z.enum(["confirmed", "pending", "completed", "cancelled"]).optional().describe("Filter by booking status"),
    limit: z.number().optional().describe("Max number of bookings to return (default 20)")
  },
  async ({ status, limit = 20 }) => {
    const data = loadData();
    let bookings = data.bookings || [];
    if (status) {
      bookings = bookings.filter(b => b.status === status);
    }
    const results = bookings.slice(0, limit);
    return {
      content: [
        {
          type: "text",
          text: results.length > 0 ? JSON.stringify(results, null, 2) : "No bookings found matching the criteria."
        }
      ]
    };
  }
);

// Tool 4: Search bookings
server.tool(
  "search_bookings",
  "Search bookings by customer name, phone number, or event type keyword.",
  {
    query: z.string().describe("Search keyword (e.g. client name, phone number, event type)")
  },
  async ({ query }) => {
    const data = loadData();
    const q = query.toLowerCase();
    const matches = (data.bookings || []).filter(b =>
      b.client_name?.toLowerCase().includes(q) ||
      b.phone?.includes(q) ||
      b.email?.toLowerCase().includes(q) ||
      b.event_type?.toLowerCase().includes(q) ||
      b.venue?.toLowerCase().includes(q)
    );
    return {
      content: [
        {
          type: "text",
          text: matches.length > 0 ? JSON.stringify(matches, null, 2) : `No bookings found matching "${query}".`
        }
      ]
    };
  }
);

// Tool 5: Create a new booking
server.tool(
  "create_booking",
  "Create a new booking in Balan Studios.",
  {
    client_name: z.string().describe("Full name of the client"),
    phone: z.string().describe("Client phone number"),
    email: z.string().optional().describe("Client email address"),
    event_type: z.string().describe("Package or event type (e.g. 'Royal Wedding Cinematic Package', 'Pre-Wedding Shoot')"),
    date: z.string().describe("Event date (YYYY-MM-DD)"),
    venue: z.string().describe("Event venue or location"),
    total_amount_inr: z.number().describe("Total agreed amount in INR"),
    advance_paid_inr: z.number().optional().describe("Advance payment received in INR (default 0)"),
    notes: z.string().optional().describe("Special instructions or requirements")
  },
  async (args) => {
    const data = loadData();
    const newId = `BK-${1000 + (data.bookings.length + 1)}`;
    const newBooking = {
      id: newId,
      client_name: args.client_name,
      phone: args.phone,
      email: args.email || "",
      event_type: args.event_type,
      date: args.date,
      venue: args.venue,
      status: "confirmed",
      total_amount_inr: args.total_amount_inr,
      advance_paid_inr: args.advance_paid_inr || 0,
      notes: args.notes || "",
      created_at: new Date().toISOString()
    };

    data.bookings.push(newBooking);
    saveData(data);

    return {
      content: [
        {
          type: "text",
          text: `✅ Booking created successfully!\n\nBooking ID: ${newId}\nClient: ${args.client_name}\nEvent: ${args.event_type}\nDate: ${args.date}\nStatus: Confirmed\nTotal: ₹${args.total_amount_inr.toLocaleString('en-IN')}\nAdvance Paid: ₹${(args.advance_paid_inr || 0).toLocaleString('en-IN')}`
        }
      ]
    };
  }
);

// Tool 6: Update booking status
server.tool(
  "update_booking_status",
  "Update the status of an existing booking (e.g. confirm, complete, or cancel).",
  {
    booking_id: z.string().describe("The ID of the booking to update (e.g. 'BK-1002')"),
    status: z.enum(["confirmed", "pending", "completed", "cancelled"]).describe("The new status")
  },
  async ({ booking_id, status }) => {
    const data = loadData();
    const booking = (data.bookings || []).find(b => b.id.toUpperCase() === booking_id.toUpperCase());

    if (!booking) {
      return {
        content: [{ type: "text", text: `❌ Booking "${booking_id}" not found.` }]
      };
    }

    const oldStatus = booking.status;
    booking.status = status;
    saveData(data);

    return {
      content: [
        {
          type: "text",
          text: `✅ Booking ${booking.id} (${booking.client_name}) updated from "${oldStatus}" to "${status}".`
        }
      ]
    };
  }
);

// Tool 7: List customer access requests
server.tool(
  "list_customer_access_requests",
  "List customers who requested access to the Balan Studios customer portal.",
  {},
  async () => {
    const data = loadData();
    const requests = data.customer_access_requests || [];
    return {
      content: [
        {
          type: "text",
          text: requests.length > 0 ? JSON.stringify(requests, null, 2) : "No customer access requests found."
        }
      ]
    };
  }
);

// Tool 8: Approve customer portal access
server.tool(
  "approve_customer_access",
  "Approve a customer access request so they can log into the client portal.",
  {
    email: z.string().describe("The email address of the customer to approve")
  },
  async ({ email }) => {
    const data = loadData();
    const cleanEmail = email.trim().toLowerCase();
    const req = (data.customer_access_requests || []).find(r => r.email.toLowerCase() === cleanEmail);

    if (req) {
      req.status = "approved";
      req.approved_at = new Date().toISOString();
      req.approved_by = data.studio_info.owner;
    } else {
      data.customer_access_requests.push({
        id: `req-${Date.now()}`,
        email: cleanEmail,
        status: "approved",
        approved_at: new Date().toISOString(),
        approved_by: data.studio_info.owner
      });
    }
    saveData(data);

    return {
      content: [
        {
          type: "text",
          text: `✅ Access approved for ${email}! Studio owner (${data.studio_info.owner}) authorization granted.`
        }
      ]
    };
  }
);

// Tool 9: Decline customer portal access
server.tool(
  "decline_customer_access",
  "Decline a customer access request.",
  {
    email: z.string().describe("The email address of the customer to decline")
  },
  async ({ email }) => {
    const data = loadData();
    const cleanEmail = email.trim().toLowerCase();
    const req = (data.customer_access_requests || []).find(r => r.email.toLowerCase() === cleanEmail);

    if (req) {
      req.status = "declined";
      req.declined_at = new Date().toISOString();
    }
    saveData(data);

    return {
      content: [
        {
          type: "text",
          text: `🚫 Access request for ${email} has been declined.`
        }
      ]
    };
  }
);

// Tool 10: Get photography & videography packages
server.tool(
  "get_pricing_packages",
  "Get Balan Studios service packages, pricing in INR, inclusions, and photography categories.",
  {},
  async () => {
    const data = loadData();
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data.packages, null, 2)
        }
      ]
    };
  }
);

// Start the stdio transport
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Balan Studios MCP Server running on stdio");
}

main().catch((err) => {
  console.error("Fatal error starting Balan Studios MCP Server:", err);
  process.exit(1);
});
