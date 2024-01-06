let email_handler = null;
let email_view = null;
let cur_mailbox = "";

document.addEventListener("DOMContentLoaded", function () {
  email_handler = document.querySelector("#email-handler");
  email_view = document.querySelector("#email-view");
  // Use buttons to toggle between views
  document
    .querySelector("#inbox")
    .addEventListener("click", () => load_mailbox("inbox"));
  document
    .querySelector("#sent")
    .addEventListener("click", () => load_mailbox("sent"));
  document
    .querySelector("#archived")
    .addEventListener("click", () => load_mailbox("archive"));
  document.querySelector("#compose").addEventListener("click", compose_email);

  document.querySelector("#compose-form").onsubmit = (e) => {
    e.preventDefault();
    const recipients = document.querySelector("#compose-recipients");
    const subject = document.querySelector("#compose-subject");
    const com_body = document.querySelector("#compose-body");

    fetch("emails", {
      method: "post",
      body: JSON.stringify({
        recipients: recipients.value,
        subject: subject.value,
        body: com_body.value,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        recipients.value = "";
        subject.value = "";
        com_body.value = "";
        load_mailbox("sent");
      });
  };

  // By default, load the inbox
  load_mailbox("inbox");
});

function compose_email(
  prepopulate = { recipients: "", subject: "", body: "" }
) {
  // Show compose view and hide other views
  document.querySelector("#email-handler").style.display = "none";
  document.querySelector("#compose-view").style.display = "block";

  // Clear out composition fields
  const r = document.querySelector("#compose-recipients");
  r.value = prepopulate.recipients || "";
  document.querySelector("#compose-subject").value = prepopulate.subject || "";
  const b = document.querySelector("#compose-body");
  b.value = prepopulate.body || "";

  prepopulate?.body?.length > 0 ? b.focus() : r.focus();
}

function view_email(email) {
  email_view.querySelector("#view-sub").textContent = email.subject;
  email_view.querySelector("#view-recipient").textContent = email.recipients;
  email_view.querySelector("#view-body").textContent = email.body;

  update_archived_btn(email.archived);
  email_view.querySelector("#earchive-btn").onclick = () => {
    // setTimeout(() => {
    //   mailBtn.remove();
    // }, 1000);
    email.archived = !email.archived;
    console.log("click");
    fetch("/emails/" + email.id, {
      method: "PUT",
      body: JSON.stringify({
        archived: email.archived,
      }),
    });
    update_archived_btn(email.archived);
  };
  email_view.querySelector("#reply-btn").onclick = () => {
    compose_email({
      recipients: email.sender,
      subject: email.subject.includes("Re:")
        ? email.subject
        : "Re: " + email.subject,
      body: `On ${email.timestamp} ${email.sender} wrote:\n\n${email.body}\n------------------------------------\n`,
    });
  };

  email_handler.classList.add("show-email");
}

function hide_email() {
  email_handler.classList.remove("show-email");
}

function update_archived_btn(val) {
  email_view.querySelector("#earchive-btn img").src = val
    ? "./static/mail/check.png"
    : "./static/mail/download-file.png";
}

function load_mailbox(mailbox) {
  // Show the mailbox and hide other views
  document.querySelector("#email-handler").style.display = "flex";
  document.querySelector("#compose-view").style.display = "none";
  cur_mailbox = mailbox;
  hide_email();
  // Show the mailbox name
  document.querySelector(
    "#emails-view"
  ).innerHTML = `<h1 style='margin-bottom: 17px'>${
    mailbox.charAt(0).toUpperCase() + mailbox.slice(1)
  }</h1>`;
  // Load the mailbox contents
  fetch(`emails/${mailbox}`)
    .then((res) => res.json())
    .then((emails) => {
      console.log(emails);
      if (emails.length) {
        emails.forEach((email) => {
          const mailBtn = document.createElement("div");
          mailBtn.classList.add("mail-btn");

          if (email.read) mailBtn.classList.add("read");

          mailBtn.innerHTML = `
          <div class="leftside">
          <h4 class="mail-subject">${email.subject}</h4>
          <p class="mail-sender">${email.sender}</p>
          <p class="timestamp">${email.timestamp}</p>
          </div>
          ${
            mailbox != "sent"
              ? `
              <button class="archive-btn">
                ${email.archived ? "Unarchive" : "Archive"}
              </button>
            `
              : ``
          }
          `;

          document.querySelector("#emails-view").appendChild(mailBtn);

          mailBtn.onclick = () => {
            console.log("showing emali");
            mailBtn.classList.add("read");
            fetch("/emails/" + email.id, {
              method: "PUT",
              body: JSON.stringify({
                read: true,
              }),
            });
            view_email(email);
            // fill in the mail data
          };
          mailBtn.querySelector(".archive-btn").onclick = (e) => {
            mailBtn.classList.add("archive");
            setTimeout(() => {
              mailBtn.remove();
              if (
                !document
                  .querySelector("#emails-view")
                  .getElementsByClassName("mail-btn").length
              )
                no_emails();
            }, 1000);
            fetch("/emails/" + email.id, {
              method: "PUT",
              body: JSON.stringify({
                archived: !email.archived,
              }),
            });
            e.stopPropagation();
          };
        });
      } else {
        no_emails();
      }
    });
}

function no_emails() {
  const nofriends = document.createElement("h5");
  nofriends.style.color = "#777";
  nofriends.textContent = [
    "no friends lol",
    "so lonelyyyyy",
    "pathetic lmao",
    "sory lol no emial",
    "hahaha",
  ][Math.floor(Math.random() * 5)];
  document.querySelector("#emails-view").appendChild(nofriends);
}
