const fileInput = document.getElementById('resume-file');
const parseButton = document.getElementById('parse-button');
const resultsContainer = document.getElementById('results');
const loadingIndicator = document.getElementById('loading');

fileInput.addEventListener('change', () => {
  parseButton.disabled = fileInput.files.length === 0;
  resultsContainer.innerHTML = '';
});

parseButton.addEventListener('click', async () => {
  const file = fileInput.files[0];
  if (!file) return;

  resultsContainer.innerHTML = '';
  loadingIndicator.classList.remove('hidden');

  try {
    // Convert file → base64
    const arrayBuffer = await file.arrayBuffer();
    const base64File = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

    // Send raw base64 string to Netlify function
    const response = await fetch('/.netlify/functions/parse-resume', {
      method: 'POST',
      headers: {
        "Content-Type": file.type,
      },
      body: base64File,
    });

    const rawData = await response.json();
    loadingIndicator.classList.add('hidden');

    if (!response.ok || rawData.error) {
      resultsContainer.innerHTML = `<p class="error">Error: ${rawData.error || 'Failed to parse resume.'}</p>`;
      return;
    }

    displayResults(rawData.data || rawData);

  } catch (err) {
    loadingIndicator.classList.add('hidden');
    resultsContainer.innerHTML = `<p class="error">Error: ${err.message}</p>`;
  }
});



    console.log("Frontend received data:", rawData);

    
    const data = rawData.data || rawData;

    console.log("ALL KEYS:", Object.keys(data));
    console.log("FULL DATA DUMP:", JSON.stringify(data, null, 2));


    console.log("DEBUG EDUCATION RAW:", JSON.stringify(
  data.education || data.education_details || data.academics, 
  null, 
  2
));

    displayResults(data);

  } catch (err) {
    loadingIndicator.classList.add('hidden');
    resultsContainer.innerHTML = `<p class="error">Error: ${err.message}</p>`;
  }
});




function displayResults(data) {
  function safe(v, fallback = "N/A") {
    return (v === null || v === undefined || v === "" ? fallback : v);
  }

  const name = safe(data.name?.full_name);
  const email = safe(data.email?.[0]?.email);
  const phone = safe(data.phone?.[0]?.phone);
  const address = safe([data.address?.city, data.address?.country_code].filter(Boolean).join(", "));

  const profile = safe(data.profile_summary);
  const skills = data.skills?.overall_skills || data.profile_summary_details?.skills || [];
  const education = data.education || [];
  const techSkills = data.skills_heading
    ? data.skills_heading.replace("TECHNICAL SKILLS", "").trim().split("\n")
    : [];
  const others = data.others_heading || "";
  const experience = data.experience || data.work_experience || [];

  let textOutput = `
===========================================
              Resume Information
===========================================

Name     : ${name}
Email    : ${email}
Phone    : ${phone}
Address  : ${address}

-------------------------------------------
           Profile Summary
-------------------------------------------
${profile}

-------------------------------------------
               Skills
-------------------------------------------
${skills.join(", ")}

-------------------------------------------
             Education
-------------------------------------------
${education.map(e => 
  `${safe(e.degree)} in ${safe(e.course)} — ${safe(e.institute)} (${e.to_month || ""} ${e.to_year || ""})`
).join("\n")}

-------------------------------------------
             Experience
-------------------------------------------
${experience.length > 0 
  ? experience.map(exp => 
      `${safe(exp.job_title)} at ${safe(exp.company)} (${safe(exp.from_year)} - ${safe(exp.to_year)})`
    ).join("\n") 
  : "N/A"}

-------------------------------------------
          Technical Skills
-------------------------------------------
${techSkills.join(", ")}

-------------------------------------------
      Languages & Certifications
-------------------------------------------
${others.replace("ADDITIONAL INFORMATION", "").trim()}
`;

  document.getElementById("results").innerHTML =
    `<pre class="text-output">${textOutput}</pre>`;

  
  document.getElementById("results-container").classList.remove("hidden");
  document.getElementById("copy-btn").classList.remove("hidden");
}


document.getElementById("copy-btn").addEventListener("click", () => {
  const text = document.getElementById("results").innerText;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById("copy-btn");
    btn.innerText = "✅ Copied!";
    setTimeout(() => btn.innerText = "📋 Copy", 2000);
  });
});










