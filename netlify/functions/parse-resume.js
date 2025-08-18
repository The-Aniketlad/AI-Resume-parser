import fetch from "node-fetch";
import FormData from "form-data";

export async function handler(event) {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    // Netlify sends multipart/form-data base64 encoded
    const bodyBuffer = Buffer.from(event.body, event.isBase64Encoded ? "base64" : "utf8");

    // Build FormData for Superparser API
    const formData = new FormData();
    formData.append("file", bodyBuffer, {
      filename: "resume.pdf",
      contentType: event.headers["content-type"] || "application/pdf",
    });

    // Call Superparser API
    const apiResponse = await fetch("https://api.superparser.com/parse", {
      method: "POST",
      headers: {
        "X-API-Key": process.env.API_KEY,  // ✅ from Netlify env vars
      },
      body: formData,
    });

    const result = await apiResponse.json();

    return {
      statusCode: apiResponse.status,
      body: JSON.stringify(result),
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
