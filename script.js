const topicData = {
  school: {
    motion: "Schools should teach emotional literacy as seriously as exam skills.",
    claim: "Emotional literacy improves learning because students can manage stress before it becomes shutdown or conflict.",
    evidence: "Use examples from classroom experience, attendance patterns, peer support, or wellbeing surveys.",
    challenge: "Ask: how can schools protect academic time while still teaching these skills?"
  },
  online: {
    motion: "Social media platforms should give teens more control over recommendation feeds.",
    claim: "Control over feeds can reduce comparison pressure and help students choose what supports their attention.",
    evidence: "Use examples from screen-time habits, platform settings, sleep routines, or digital wellbeing research.",
    challenge: "Ask: where is the line between personal responsibility and platform responsibility?"
  },
  community: {
    motion: "Every school should have peer-led listening circles.",
    claim: "Peer spaces make support easier to access because students often speak first to someone their own age.",
    evidence: "Use examples from mentorship programs, student councils, restorative circles, or club participation.",
    challenge: "Ask: what training and boundaries would keep peer support safe?"
  }
};

const topicButtons = document.querySelectorAll(".topic");
const motionText = document.querySelector("#motionText");
const claimText = document.querySelector("#claimText");
const evidenceText = document.querySelector("#evidenceText");
const challengeText = document.querySelector("#challengeText");

topicButtons.forEach((button) => {
  button.addEventListener("click", () => {
    topicButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    const selected = topicData[button.dataset.topic];
    motionText.textContent = selected.motion;
    claimText.textContent = selected.claim;
    evidenceText.textContent = selected.evidence;
    challengeText.textContent = selected.challenge;
  });
});

const supportForm = document.querySelector("#supportForm");
const formNote = document.querySelector("#formNote");

supportForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(supportForm);
  const helpType = formData.get("helpType");
  const contact = formData.get("contact");
  const isAnonymous = formData.get("anonymous") === "on";

  formNote.textContent = `Request saved for demo: ${helpType}, contact by ${contact}${isAnonymous ? ", anonymous at first" : ""}.`;
  supportForm.reset();
});

const feedbackForm = document.querySelector("#feedbackForm");
const feedbackNote = document.querySelector("#feedbackNote");

feedbackForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const rating = document.querySelector("#rating").value;
  feedbackNote.textContent = `Feedback saved for demo: ${rating}.`;
  feedbackForm.reset();
});

const classForm = document.querySelector("#classForm");
const classNote = document.querySelector("#classNote");

classForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const classLevel = document.querySelector("#classLevel").value;
  classNote.textContent = `Class interest saved for demo: ${classLevel}.`;
  classForm.reset();
});

const counselorForm = document.querySelector("#counselorForm");
const counselorNote = document.querySelector("#counselorNote");

counselorForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const reason = document.querySelector("#counselorReason").value;
  const time = document.querySelector("#counselorTime").value;
  counselorNote.textContent = `Counselor request saved for demo: ${reason}, preferred time: ${time}.`;
  counselorForm.reset();
});

const signupForm = document.querySelector("#signupForm");
const signupNote = document.querySelector("#signupNote");

signupForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const role = document.querySelector("#signupRole").value;
  const email = document.querySelector("#signupEmail").value;
  const staffRole = document.querySelector("#staffRole");
  signupNote.textContent = `Signup request saved for demo: ${role}. Follow-up will be sent to ${email}.`;

  if (role === "Trainer" || role === "Counselor") {
    staffRole.value = role;
    document.querySelector("#staff-platform").scrollIntoView({ behavior: "smooth" });
  }

  signupForm.reset();
});

const recordForm = document.querySelector("#recordForm");
const recordNote = document.querySelector("#recordNote");
const recordsList = document.querySelector("#recordsList");
const totalRecords = document.querySelector("#totalRecords");
const openRecords = document.querySelector("#openRecords");
const clearRecords = document.querySelector("#clearRecords");
const recordsKey = "khayalStudentRecords";

const getRecords = () => JSON.parse(localStorage.getItem(recordsKey) || "[]");

const saveRecords = (records) => {
  localStorage.setItem(recordsKey, JSON.stringify(records));
};

const escapeHtml = (value) => value.replace(/[&<>"']/g, (character) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  "\"": "&quot;",
  "'": "&#039;"
}[character]));

const renderRecords = () => {
  const records = getRecords();
  totalRecords.textContent = records.length;
  openRecords.textContent = records.filter((record) => ["Open", "Monitoring"].includes(record.status)).length;

  if (!records.length) {
    recordsList.innerHTML = '<p class="empty-records">No student records saved yet. Add a demo record using the form.</p>';
    return;
  }

  recordsList.innerHTML = records.map((record) => `
    <article class="record-card">
      <div>
        <h4>${escapeHtml(record.student)}</h4>
        <div class="record-meta">
          <span>${escapeHtml(record.role)}</span>
          <span>${escapeHtml(record.type)}</span>
          <span>${escapeHtml(record.status)}</span>
          <span>${escapeHtml(record.date)}</span>
        </div>
        <p>${escapeHtml(record.notes)}</p>
        ${record.file ? `<p class="record-file">Attached file: ${escapeHtml(record.file)}</p>` : ""}
      </div>
    </article>
  `).join("");
};

recordForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const fileInput = document.querySelector("#recordFile");
  const record = {
    role: document.querySelector("#staffRole").value,
    student: document.querySelector("#recordStudent").value,
    type: document.querySelector("#recordType").value,
    status: document.querySelector("#recordStatus").value,
    file: fileInput.files[0]?.name || "",
    notes: document.querySelector("#recordNotes").value,
    date: new Date().toLocaleDateString()
  };

  const records = [record, ...getRecords()];
  saveRecords(records);
  recordNote.textContent = `Record saved for demo: ${record.student}.`;
  recordForm.reset();
  renderRecords();
});

clearRecords.addEventListener("click", () => {
  saveRecords([]);
  recordNote.textContent = "Demo records cleared.";
  renderRecords();
});

renderRecords();
