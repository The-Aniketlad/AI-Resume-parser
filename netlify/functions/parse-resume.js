import fetch from "node-fetch";
import FormData from "form-data";

export async function handler(event) {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    
    const contentType = event.headers["content-type"] || "application/pdf";
    const buffer = Buffer.from(event.body, event.isBase64Encoded ? "base64" : "utf8");

    // Build FormData for Superparser API
    const formData = new FormData();
    formData.append("file", buffer, {
      filename: "resume.pdf",
      contentType: contentType
    });

    // Call Superparser API
    const response = await fetch("https://api.superparser.com/parse", {
      method: "POST",
      headers: {
        "X-API-Key": process.env.API_KEY  
      },
      body: formData
    });

    const result = await response.json();

    return {
      statusCode: response.status,
      body: JSON.stringify(result)
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
}
