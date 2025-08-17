import fetch from "node-fetch";

export async function handler(event) {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    // Send uploaded resume to external parser API
    const response = await fetch("https://api.superparser.com/parse", {
      method: "POST",
      headers: {
        "Content-Type": event.headers["content-type"],
        "Authorization": `Bearer ${process.env.API_KEY}` // only if needed
      },
      body: event.body
    });

    const result = await response.json();

    return { statusCode: 200, body: JSON.stringify(result) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
