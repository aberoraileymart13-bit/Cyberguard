// Training lessons and branching scenarios for the browser-only learning flow.
(function () {
  "use strict";
  const q = (prompt, choices, answer, explanation) => ({ prompt, choices, answer, explanation });
  const lessons = {
    phishing: [
      {
        id: "phishing-signals", title: "Spot the signals", duration: "4 min", illustration: "message",
        paragraphs: [
          "Phishing is a message designed to make you reveal information, open a harmful file, or visit a deceptive site. It can arrive by email, text, social media, or a phone call.",
          "Look for a cluster of clues: an unexpected request, pressure to act quickly, a sender address that does not match the organization, unusual wording, or a link whose destination is different from its label. A polished logo is not proof of authenticity.",
          "Pause before acting. Check the full sender address and link destination without opening it. If the request matters, contact the organization using a number, app, or address you already trust."
        ],
        questions: [
          q("A familiar-looking email says your mailbox will close today unless you sign in. What is the safest next step?", ["Use its sign-in button before the deadline", "Open your mail service through its saved app or typed address", "Reply and ask whether it is genuine"], 1, "The urgency and sign-in link are warning signs. Verify by opening the service independently."),
          q("Which detail is the strongest reason to pause?", ["The message uses the company colors", "The sender address has an extra word after the company name", "The message includes your first name"], 1, "Look-alike sender domains can impersonate a real organization. Check the complete address and verify independently.")
        ]
      },
      {
        id: "phishing-links", title: "Check links and attachments", duration: "4 min", illustration: "link",
        paragraphs: [
          "A link's visible words can conceal a different destination. On a computer, you can hover to preview the address; on a phone, press and hold only when your device safely previews a link. Do not follow a link just to inspect it.",
          "Be wary of unexpected attachments, QR codes, shared documents, and requests to enable macros or install software. A known contact's account may have been taken over, so context still matters.",
          "When you need to reach a service, use a bookmark or type its known address. For work files, use the organization's normal collaboration tools and ask the sender through a separate trusted channel."
        ],
        questions: [
          q("A QR code on a flyer asks you to sign in to claim a prize. What should you do?", ["Scan and sign in if the page logo looks right", "Use a trusted route to verify the offer before entering details", "Enter only your username first"], 1, "QR codes can hide a deceptive destination. Verify the offer and site using an independent, trusted route."),
          q("A coworker unexpectedly sends an attachment and asks you to enable content. What is safest?", ["Confirm with them using a known work channel before opening it", "Enable content because the sender is familiar", "Forward it to your personal email"], 0, "A familiar account can be compromised. Confirm unusual files and requests out of band.")
        ]
      },
      {
        id: "phishing-pressure", title: "Resist urgency and impersonation", duration: "4 min", illustration: "clock",
        scenarioId: "online-scam",
        paragraphs: [
          "Scammers use pressure to keep you from checking. Common hooks include a threatened account closure, an overdue delivery fee, a surprise refund, a limited-time investment, or an urgent request from a manager.",
          "Treat payment changes, gift-card requests, password resets, and requests for one-time codes as high risk. Verify through a second channel you find yourself—not by replying to the message or calling a number it supplied.",
          "A legitimate organization will let you take time to confirm. If a request cannot survive a short verification step, do not proceed."
        ],
        questions: [
          q("A supposed manager asks you to buy gift cards immediately and send the codes. What should you do?", ["Verify the request using the manager's known number or work channel", "Buy them quickly to avoid disappointing the manager", "Reply asking which store to use"], 0, "Urgency and gift-card codes are common impersonation tactics. Verify through a contact method you already trust."),
          q("A caller says they are support and need your one-time login code to stop fraud. What is safest?", ["Read the code if they know your account name", "Decline and contact support using the official app or number", "Send the code in a text instead"], 1, "One-time codes are for you alone. End the call and contact the service independently.")
        ]
      },
      {
        id: "phishing-report", title: "Report and recover", duration: "5 min", illustration: "shield",
        scenarioId: "phishing-email",
        paragraphs: [
          "If a message looks suspicious, do not reply, click, download, or forward it to others. Use your organization's report-phishing control or report it to the service provider, then delete it when policy allows.",
          "If you already entered a password, go directly to the real service, change that password, and change it anywhere else it was reused. Sign out other sessions if available and enable multifactor authentication.",
          "If you shared payment details or a one-time code, contact the bank or account provider promptly through its official channel. Tell your IT or security team what happened; early, honest reporting helps limit harm."
        ],
        questions: [
          q("You entered your password on a page opened from a suspicious email. What should you do first?", ["Use the real service to change it and secure the account", "Wait to see whether anything happens", "Reply to the sender asking them to delete it"], 0, "Act through the genuine service, replace the exposed password, and secure any account where it was reused."),
          q("What is the best way to report a suspicious work message?", ["Use the approved reporting process and share relevant details with security", "Forward it to every coworker", "Click the link again to capture evidence"], 0, "Use your organization's reporting process. Do not increase exposure by opening or widely forwarding the message.")
        ]
      },
      {
        id: "real-or-fake-website", title: "Real or fake website?", duration: "5 min", illustration: "link",
        paragraphs: [
          "A fake website can copy a real logo and colors. Good design does not prove a site is real.",
          "Read the whole website address. Look for extra words, misspellings, or a name that is almost—but not quite—the real one. A padlock only means the connection is encrypted; it does not prove who runs the site.",
          "Do not use a link from an unexpected message to sign in or pay. Open the official app, use a saved bookmark, or type the address you already know. If unsure, call the organization using a number from a trusted source.",
          "Stop if the site asks for a password, payment, or personal detail that does not make sense. A real offer can wait while you check it."
        ],
        questions: [
          q("A website has a familiar logo but an address with an extra word. What should you do?", ["Continue because the logo looks right", "Stop and open the official site using a known address", "Enter your email to check"], 1, "A logo can be copied. Check the full address and use a route you already trust."),
          q("Does a padlock prove that a website is run by the real company?", ["Yes, always", "No. It protects the connection but does not prove who owns the site", "Only on a phone"], 1, "A secure connection is useful, but a fake site can also have one. Verify the address independently.")
        ]
      }
    ],
    privacy: [
      {
        id: "privacy-footprint", title: "Understand your digital footprint", duration: "4 min", illustration: "footprint",
        paragraphs: [
          "A digital footprint includes information you post as well as data collected by apps, websites, devices, and other people. Photos, likes, location tags, and public profiles can reveal more when combined.",
          "Before sharing, consider who can see it, how long it may remain available, and whether it could expose your location, routine, workplace, or someone else's personal information.",
          "Review old posts and audience settings periodically. Remove details that no longer need to be public, and ask before posting identifiable information about another person."
        ],
        questions: [
          q("Which post is least likely to reveal sensitive personal information?", ["A live photo tagged with your home address", "A general hobby shared with a limited audience", "Your dates away from home"], 1, "A general interest is less revealing than a precise location or travel schedule; still choose an audience intentionally."),
          q("A photo includes a visible street sign outside your home. What should you consider?", ["Crop or obscure the identifying detail before sharing", "Add your travel dates for context", "Tag your home location"], 0, "Images can disclose location details unintentionally. Remove them when they are not needed.")
        ]
      },
      {
        id: "privacy-permissions", title: "Manage app permissions", duration: "4 min", illustration: "controls",
        paragraphs: [
          "Apps may request access to your location, contacts, camera, microphone, photos, or motion data. Access should fit the feature you are using; a simple utility may not need your address book.",
          "Choose the narrowest permission that works, such as access only while using an app or selecting individual photos. Deny optional access when the purpose is unclear.",
          "Review permissions after installing apps and after software updates. Remove access you no longer need, uninstall apps you do not use, and get apps from official stores."
        ],
        questions: [
          q("A flashlight app asks for your contacts and precise location. What is prudent?", ["Grant everything so it works smoothly", "Deny permissions unrelated to its purpose", "Share contacts but not location"], 1, "Grant only what the app needs to provide the feature you chose."),
          q("When is a good time to review app permissions?", ["Only when a device breaks", "Periodically and when installing or updating apps", "Never, once an app has been approved"], 1, "Permissions and app needs can change. Review them regularly and revoke unnecessary access.")
        ]
      },
      {
        id: "privacy-sharing", title: "Share personal data thoughtfully", duration: "5 min", illustration: "share",
        scenarioId: "cyberbullying",
        paragraphs: [
          "Personal data includes more than passwords: names, contact details, school or work schedules, identity numbers, private conversations, and account-recovery answers can all create risk.",
          "Share only what is needed. Check an organization's privacy notice and choose a less revealing option when possible. Avoid posting documents or screenshots that expose names, addresses, notifications, or account details.",
          "Do not share someone else's private messages, images, or identifying information without consent. If harmful material is circulating, preserve only what is needed to report it safely and avoid resharing it."
        ],
        questions: [
          q("A form requests your full birth date even though it is optional and unrelated to the service. What is safer?", ["Leave it blank unless there is a clear need", "Provide it automatically", "Use your account password as the answer"], 0, "Minimize the data you share, particularly when a field is optional and not needed."),
          q("A friend sends you a private image of someone else. What should you do?", ["Avoid forwarding or posting it and ask for it to be removed", "Share it only with a large group", "Add the person's name for context"], 0, "Do not amplify private material. Respect consent and use the platform's reporting tools if it is being misused.")
        ]
      },
      {
        id: "privacy-breach", title: "Respond to a privacy incident", duration: "5 min", illustration: "shield",
        paragraphs: [
          "A privacy incident can include a lost device, a misdirected document, an exposed account, or personal information shared with the wrong audience. Respond quickly, but use trusted channels.",
          "For a lost device, use its official lock or find feature, contact your organization if it is managed, and change exposed account credentials from a trusted device. Revoke active sessions when possible.",
          "Report the incident to the relevant provider or privacy/security team. Keep a factual record of what was exposed and when; do not post sensitive details publicly while seeking help."
        ],
        questions: [
          q("You accidentally shared a document containing personal details with the wrong audience. What is a good response?", ["Restrict access if possible and promptly notify the responsible team", "Ignore it because the link is hard to guess", "Post the document publicly to explain"], 0, "Limit further access and report promptly so the organization can assess and respond."),
          q("Your phone is lost while signed in to work accounts. What should you do?", ["Use official device/account recovery steps and notify your organization", "Wait until your next password change", "Post your login details so someone can return it"], 0, "Use trusted lock/recovery tools, revoke access where possible, and notify the responsible team.")
        ]
      }
    ],
    passwords: [
      {
        id: "passwords-unique", title: "Use unique passwords", duration: "4 min", illustration: "key",
        paragraphs: [
          "When one service is breached, attackers may try the exposed password on other services. Reusing a password lets one incident unlock multiple accounts.",
          "Use a different password for every account, especially email, financial, and work accounts. A password manager can create and remember long, random passwords so you do not need to memorize each one.",
          "Never share passwords in chat or email. If you suspect reuse or exposure, change the affected password and every other account that used it."
        ],
        questions: [
          q("What is the safest approach for passwords across multiple sites?", ["Use one memorable password everywhere", "Use a unique password for each account, stored in a reputable manager", "Change one character for each site"], 1, "Unique passwords prevent a breach at one site from directly exposing your other accounts."),
          q("A site notifies you that its password database was exposed. What should you do?", ["Replace that password and any reused copies", "Wait for the site to contact you again", "Post the old password so others can check"], 0, "Change exposed credentials promptly, including any accounts where the same password was reused.")
        ]
      },
      {
        id: "passwords-length", title: "Choose strong passphrases", duration: "4 min", illustration: "key",
        paragraphs: [
          "Long, unique passwords are harder to guess than short or predictable ones. A passphrase made of several unrelated words can be easier to remember while still being long.",
          "Avoid predictable substitutions, personal facts, keyboard patterns, and common phrases. Use a reputable password manager to store unique passwords; never type a real password into practice tools.",
          "For accounts stored in a password manager, let it generate a random password that meets the service's requirements. Use a strong, unique master password for the manager."
        ],
        questions: [
          q("Which is a better password strategy for an important account?", ["A long, unique password or passphrase", "Your pet's name plus the current year", "A short password with a predictable symbol"], 0, "Length and unpredictability matter; personal information and common patterns are easier to guess."),
          q("What is a good use for a password manager?", ["Generate and store a different random password for each account", "Store one shared password for a whole team", "Keep recovery codes in a public note"], 0, "A manager helps you use unique credentials without having to memorize them all.")
        ]
      },
      {
        id: "passwords-mfa", title: "Add multifactor authentication", duration: "4 min", illustration: "shield",
        paragraphs: [
          "Multifactor authentication (MFA) adds another proof of identity beyond a password. A security key or passkey is generally resistant to phishing; an authenticator app is another useful option.",
          "Treat approval prompts and one-time codes as sensitive. Approve only a sign-in you initiated. Repeated unexpected prompts may signal that someone has your password—deny them and change it through the real service.",
          "Save recovery codes securely and separately from the account they protect. Never disclose a code to someone claiming to be support."
        ],
        questions: [
          q("You receive an MFA approval prompt that you did not initiate. What should you do?", ["Deny it and secure your account", "Approve it to stop notifications", "Send the prompt to a coworker"], 0, "An unexpected prompt may be an attempted login. Deny it and change your password through the official service."),
          q("How should you handle account recovery codes?", ["Keep them private in a secure place", "Post them in a team chat", "Read them to a caller who says they are support"], 0, "Recovery codes can grant account access; store them securely and do not disclose them.")
        ]
      },
      {
        id: "passwords-recovery", title: "Protect recovery options", duration: "4 min", illustration: "shield",
        paragraphs: [
          "Recovery email addresses, phone numbers, and backup codes can be used to regain control of an account. They need protection comparable to the account itself.",
          "Use an email account you control, keep its credentials unique, and enable MFA. Review recovery details for accuracy and remove old numbers or addresses you no longer control.",
          "If a recovery message arrives unexpectedly, do not follow its link. Open the service using its official app or a saved address, check recent security activity, and report suspicious changes."
        ],
        questions: [
          q("An unexpected password-reset email arrives. What should you do?", ["Open the service independently and review account security", "Click the email link to see where it goes", "Forward the reset link to a friend"], 0, "Navigate independently rather than trusting an unexpected link, and check whether any account changes occurred."),
          q("What should you do with an old recovery phone number you no longer control?", ["Remove it and replace it with a current, trusted method", "Leave it forever", "Share it publicly so the owner can contact you"], 0, "Outdated recovery options can let another person regain access. Keep them current.")
        ]
      }
    ],
    hardening: [
      {
        id: "hardening-updates", title: "Keep devices and apps updated", duration: "4 min", illustration: "device",
        paragraphs: [
          "Software updates often fix security weaknesses as well as bugs. Delaying important updates leaves known issues uncorrected.",
          "Turn on automatic updates where practical and install updates through the device's built-in settings or the software maker's official channel. Do not install an update file sent by an unexpected caller or message.",
          "Remove apps and browser extensions you no longer need. If a device is no longer supported, plan to replace it or avoid using it for sensitive accounts."
        ],
        questions: [
          q("Your phone offers an operating-system update in its settings. What is a good practice?", ["Install it through the built-in updater", "Ignore all updates indefinitely", "Download a file from an unsolicited message"], 0, "Use official update channels and install security fixes promptly."),
          q("What should you do with a browser extension you no longer use?", ["Remove it", "Give it access to all sites just in case", "Share your account password with its developer"], 0, "Reducing unused software reduces unnecessary access and exposure.")
        ]
      },
      {
        id: "hardening-lock", title: "Lock and protect your devices", duration: "4 min", illustration: "device",
        paragraphs: [
          "A screen lock helps protect information when a device is unattended or lost. Use a strong PIN or password and enable automatic locking after a short period.",
          "Keep device encryption and built-in security protections enabled. On shared or public devices, do not save credentials; sign out and close private sessions when finished.",
          "Set up the manufacturer's official find/lock feature before a device is lost. For work equipment, follow your organization's device-handling policy."
        ],
        questions: [
          q("You need to step away from a shared computer. What should you do?", ["Lock the screen and sign out when finished", "Leave your accounts open", "Save your passwords for the next person"], 0, "Locking protects an active session; sign out of shared devices when you finish."),
          q("Where should you configure a lost-device lock feature?", ["Through the device maker's official settings", "Through a link from an unknown text", "In a public social post"], 0, "Use built-in, official tools and configure them before a device goes missing.")
        ]
      },
      {
        id: "hardening-network", title: "Use networks and downloads safely", duration: "4 min", illustration: "network",
        paragraphs: [
          "Public Wi-Fi can be operated by people you do not know. Confirm the network name with the venue, avoid sensitive actions on untrusted networks, and use your organization's approved secure connection for work.",
          "HTTPS protects the connection to a site but does not prove that the site itself is trustworthy. Check the address and use a known bookmark or official app.",
          "Download software only from official stores or the maker's site. Treat unexpected pop-ups, unknown USB drives, and requests to disable security settings as warning signs."
        ],
        questions: [
          q("A public Wi-Fi sign-in page appears to request your bank password. What should you do?", ["Do not enter it; use the bank's official app only on a trusted connection", "Enter it if the network name seems familiar", "Disable MFA before connecting"], 0, "A Wi-Fi portal should not need your bank credentials. Avoid sensitive account use on untrusted networks."),
          q("You find an unknown USB drive. What is safest?", ["Give it to the appropriate IT or security team", "Plug it in to learn who owns it", "Use it to transfer personal files"], 0, "Unknown removable media can be unsafe; follow your organization's reporting process.")
        ]
      },
      {
        id: "hardening-access", title: "Review account access", duration: "5 min", illustration: "controls",
        scenarioId: "identity-theft",
        paragraphs: [
          "Account security includes connected apps, signed-in devices, active sessions, and recovery methods—not just the password. Review these settings periodically.",
          "Remove sessions and third-party access you do not recognize or no longer need. Change a possibly exposed password through the genuine service and enable MFA.",
          "If someone may be using your identity, contact affected providers using official channels, secure your email first, and follow your local authority's identity-theft reporting guidance. Keep a factual record and do not share identity documents with unverified helpers."
        ],
        questions: [
          q("You see a device you do not recognize in account activity. What should you do?", ["End its session, change your password through the official site, and review recovery settings", "Ignore it if the account still opens", "Send your recovery code to the device owner"], 0, "Revoke unfamiliar access, secure credentials, and check recovery details and MFA."),
          q("A caller offers to fix an identity-theft problem if you give them your identity number. What is safest?", ["Verify the organization independently before sharing anything", "Provide it because the caller sounds confident", "Post it publicly to confirm your identity"], 0, "Do not provide sensitive identity information to an unverified caller; contact the relevant provider directly.")
        ]
      }
    ]
  };
  const scenarios = {
    "phishing-email": {
      title: "The payroll update email",
      intro: "You receive an unexpected email saying payroll details must be confirmed today. It links to a sign-in page and threatens a delayed paycheck.",
      start: "inspect",
      nodes: {
        inspect: {
          prompt: "What do you do before acting?",
          choices: [
            { label: "Open the link and check whether the form looks real", consequence: "The page may capture your sign-in details, even if its logo looks convincing.", expert: "Do not use the message link. Check the sender and verify the request through your known HR portal or a saved contact.", next: "exposed" },
            { label: "Ignore the pressure and check the request independently", consequence: "You avoid exposing credentials and create time to verify the claim.", expert: "Use the known HR portal or a directory number—not contact details supplied in the email.", next: "verify" },
            { label: "Reply asking the sender to prove who they are", consequence: "A scammer can simply claim to be legitimate and may learn that your address is active.", expert: "Verify through an independent, trusted channel rather than replying.", next: "verify" }
          ]
        },
        verify: {
          prompt: "HR confirms there is no payroll change request. How do you respond?",
          choices: [
            { label: "Report the email with the approved phishing process", consequence: "The security team can investigate and warn other people who received it.", expert: "Report the message, preserve only what the reporting process requests, and delete it when appropriate.", next: null },
            { label: "Forward it to coworkers as a warning", consequence: "More people may click the link, and forwarding can obscure reporting details.", expert: "Use the approved report-phishing control or security contact; avoid broad forwarding.", next: null },
            { label: "Click again to capture a screenshot", consequence: "Reopening the page creates another chance to disclose information or download content.", expert: "Do not revisit the link. Include the original message in the approved report.", next: null }
          ]
        },
        exposed: {
          prompt: "You entered your password before noticing the suspicious address. What now?",
          choices: [
            { label: "Open the real HR portal independently and change the exposed password", consequence: "Acting quickly through a known route can limit account access using the exposed password.", expert: "Change the password from the genuine service, replace any reused password, revoke unfamiliar sessions, and alert security.", next: "verify" },
            { label: "Wait to see whether a sign-in alert arrives", consequence: "An attacker may use the credentials before you receive an alert.", expert: "Do not wait. Secure the account immediately using its official app or typed address, then report the exposure.", next: "verify" }
          ]
        }
      }
    },
    "online-scam": {
      title: "The too-good-to-be-true marketplace deal",
      intro: "A buyer offers extra money for an item, sends a payment screenshot, and asks you to pay a small release fee to receive the funds.",
      start: "payment",
      nodes: {
        payment: {
          prompt: "What should you check before sending or shipping anything?",
          choices: [
            { label: "Check the payment inside your own payment account", consequence: "You avoid relying on a screenshot that could be edited or fabricated.", expert: "Open the provider using its official app or typed address and confirm settled funds and the recipient details.", next: "fee" },
            { label: "Ship because the screenshot shows a completed payment", consequence: "A screenshot is not proof that funds reached your account; a transfer may be fake or reversible.", expert: "Verify the transaction directly with the payment provider before handing over the item.", next: "shipped" },
            { label: "Pay the release fee to unlock the transfer", consequence: "The fee may be the scam; the promised payment may never arrive.", expert: "Do not pay an unexpected fee to receive money. Check with the provider using an official channel.", next: "fee" }
          ]
        },
        fee: {
          prompt: "The buyer now pressures you to act within five minutes. What next?",
          choices: [
            { label: "Stop the transaction and report the account to the marketplace", consequence: "You reduce further exposure and give the platform a chance to investigate.", expert: "Keep communications on-platform, do not share verification codes or financial details, and report the suspicious account.", next: null },
            { label: "Move the conversation to a private messaging app", consequence: "You lose platform protections and make it harder to report the interaction.", expert: "Keep the transaction on-platform and use its safety/reporting process.", next: null },
            { label: "Send a one-time code to prove you are the seller", consequence: "A code may authorize account access or a payment; sharing it can lead to account takeover.", expert: "Never share a one-time code. End contact and secure the account if a code was exposed.", next: null }
          ]
        },
        shipped: {
          prompt: "You shipped the item, but the payment is not in your account. What should you do?",
          choices: [
            { label: "Contact the marketplace and payment provider through official channels", consequence: "Prompt reporting may help the providers review the transaction and protect your account.", expert: "Keep transaction records, report the buyer, and do not pay additional fees or disclose verification codes.", next: null },
            { label: "Pay another fee to reverse the shipment", consequence: "A second unexpected payment can increase the loss without recovering the item.", expert: "Do not send more money. Contact the carrier, marketplace, and payment provider using their official channels.", next: null }
          ]
        }
      }
    },
    cyberbullying: {
      title: "A cruel post in a group chat",
      intro: "A group chat is sharing a humiliating image and encouraging people to pile on. The person targeted is also in the group.",
      start: "respond",
      nodes: {
        respond: {
          prompt: "What is the safest way to respond?",
          choices: [
            { label: "Forward the image to another group to ask what happened", consequence: "Even well-meant forwarding increases the audience and may deepen the harm.", expert: "Do not reshare it. Offer private support to the targeted person and use the platform's reporting tools.", next: "amplified" },
            { label: "Avoid resharing and privately check in with the targeted person", consequence: "You avoid amplifying the material and give the person a chance to say what support they need.", expert: "Be supportive without blaming them; ask what help they want and respect their privacy.", next: "support" },
            { label: "Post the target's contact details to defend them", consequence: "Exposing personal details can invite further harassment and put the person at risk.", expert: "Never publish identifying information. Report the harmful content and involve a trusted adult or safety contact if needed.", next: "amplified" }
          ]
        },
        support: {
          prompt: "The post continues and includes threats. What should you do?",
          choices: [
            { label: "Use the platform's report/block tools and tell a trusted safety contact", consequence: "The platform and an appropriate trusted person can help address ongoing threats.", expert: "Keep a minimal record of the report if safe, do not engage with threats, and seek urgent local help if someone is in immediate danger.", next: null },
            { label: "Organize a public argument with the people posting", consequence: "A public confrontation can escalate the situation and draw more attention to the target.", expert: "Use reporting and support channels rather than escalating in the group.", next: null },
            { label: "Save and redistribute every copy as evidence", consequence: "Redistribution causes further harm and can expose private material to more people.", expert: "Do not circulate the content. Follow platform guidance and preserve only information needed for a safe report.", next: null }
          ]
        },
        amplified: {
          prompt: "The image has now spread beyond the original chat. What can you do?",
          choices: [
            { label: "Stop resharing, report the posts, and privately check what support is wanted", consequence: "You avoid further amplification and help the person access support and reporting options.", expert: "Respect the person's choices, report harmful content, and involve a trusted safety contact if threats continue.", next: "support" },
            { label: "Ask others to repost it with a correction", consequence: "More reposts still spread the private image, even when accompanied by criticism.", expert: "Do not repeat or quote-share the image. Report it and use a separate message to correct misinformation if needed.", next: "support" }
          ]
        }
      }
    },
    "identity-theft": {
      title: "A new account you did not open",
      intro: "You receive a notice about a financial account you did not create. A caller then offers to fix it if you confirm your identity number and a one-time code.",
      start: "secure",
      nodes: {
        secure: {
          prompt: "What is your first safe step?",
          choices: [
            { label: "Give the caller the code so they can close the account", consequence: "The code may let the caller access or authorize changes to one of your accounts.", expert: "Do not share one-time codes. End the call and contact the provider using the number on its official site or card.", next: "compromised" },
            { label: "End the call and contact the provider through an official channel", consequence: "You avoid disclosing sensitive data and reach an independently verified support channel.", expert: "Ask the provider to verify the account and explain its identity-theft process; secure your email account too.", next: "report" },
            { label: "Reply to the notice with a photo of your identity document", consequence: "The notice may be fake, and the image could be misused if sent to an unverified recipient.", expert: "Verify the notice independently before sharing documents; do not use its reply link or phone number.", next: "compromised" }
          ]
        },
        report: {
          prompt: "The provider confirms possible identity misuse. What now?",
          choices: [
            { label: "Follow the provider's official fraud steps and keep a factual record", consequence: "The provider can secure its account, and a clear record helps you track what happened.", expert: "Contact affected providers using verified channels, follow local identity-theft reporting guidance, and monitor relevant accounts.", next: null },
            { label: "Pay an unsolicited recovery service that guarantees a fix", consequence: "The offer may be another scam and could collect more money or personal data.", expert: "Use official providers and recognized local reporting resources; be cautious of guaranteed recovery claims.", next: null },
            { label: "Post your identity number online to ask for help", consequence: "Public disclosure can make further impersonation easier.", expert: "Keep identity documents and numbers private; share them only when independently verified and necessary.", next: null }
          ]
        },
        compromised: {
          prompt: "You already shared a code or identity document with the caller. What now?",
          choices: [
            { label: "End contact, secure affected accounts, and call the real provider", consequence: "You prevent more disclosures and give the provider a chance to block unauthorized activity.", expert: "Change exposed credentials through official services, revoke unfamiliar sessions, contact affected institutions, and report what was shared.", next: "report" },
            { label: "Keep talking so the caller can finish the recovery", consequence: "The caller may request more codes, documents, or money while impersonating support.", expert: "Stop the conversation. Independently verify the provider and follow its official fraud-response steps.", next: "report" }
          ]
        }
      }
    }
  };
  window.CyberGuardLessons = { modules: lessons, scenarios };
})();
