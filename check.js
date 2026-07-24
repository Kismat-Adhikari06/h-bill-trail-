fetch("https://h-bill-trail-eight.vercel.app/api/bills").then(r => r.text()).then(t => console.log("Response:", t.substring(0, 300))).catch(e => console.log("Error:", e.message));
