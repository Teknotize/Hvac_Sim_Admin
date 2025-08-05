import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { Field, Input, Label, Button } from "@headlessui/react";
import Editor from "react-simple-wysiwyg";
import useEmailToastStore from "../../store/userEmailToastStore";
import { apiClient } from "../../config";

interface EmailPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  recipients?: Array<{
    [key: string]: any;
  }>;
}

interface Recipient {
  [key: string]: any;
}

export default function EmailPopup({
  isOpen,
  onClose,
  recipients = [],
  onSuccess,
}: EmailPopupProps) {
  const [html, setHtml] = useState("");
  const [subject, setSubject] = useState("");
  // const [to, setTo] = useState('');
  const [tempRecipients, setTempRecipients] = useState<Recipient[]>([]);

  const { startProgress, updateProgress, completeProgress, hideToast } =
    useEmailToastStore();

  useEffect(() => {
    setTempRecipients(recipients);
    console.log("hi", tempRecipients.length);
  }, [recipients,tempRecipients]);

  const removeRecipient = (user: any) => {
    setTempRecipients((prev) =>
      prev.filter((recipient) => recipient._id !== user._id)
    );
  };

  function onChange(e: any) {
    setHtml(e.target.value);
  }
const handleSendEmail = async () => {
  if (!html || !subject || tempRecipients.length === 0) return;

  const emailList = tempRecipients.map((r) => r.email);
  const totalEmails = emailList.length;

  startProgress(totalEmails);
  onClose();
  setHtml("");
  setSubject("");

  try {
    const response = await fetch(`${apiClient.defaults.baseURL}/admin/send-mails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        emails: emailList,
        subject,
        content: html,
      }),
    });

    if (!response.ok || !response.body) {
      throw new Error("Failed to send email.");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split("\n\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = JSON.parse(line.slice(6));
          if (data.completed) {
            completeProgress(true);
            if (onSuccess) onSuccess();
            setTimeout(() => hideToast(), 5000);
            return;
          }
          updateProgress(data.step);
        }
      }
    }
  } catch (error) {
    console.error("Email sending failed:", error);
    completeProgress(false);
    onClose();
    setHtml("");
    setSubject("");
  }
};

  if (!isOpen) return null;

  return (
    <div className={`sendEmailPop active`}>
      <div className="sendEmailPop-wrapper shadow-lg">
        <Button className="closeBtn" onClick={onClose}>
          <FontAwesomeIcon icon={faXmark} />
        </Button>
        <h2>Send Email</h2>
        <Field className="fieldDv">
          <Label>
            To 
          </Label>
          <div className="emailInputCol">
            {tempRecipients?.length < 9 ? (
              <>

              {tempRecipients?.map((recipient) => (
              <div className={`emailItem type0${Math.floor(Math.random() * 3) + 1}`}>
                <figure>
                  <span>{recipient.name?.charAt(0)}</span>
                </figure>
                <span>{recipient.name}</span>
                <i onClick={() => removeRecipient(recipient)}>
                  <FontAwesomeIcon icon={faXmark} />
                </i>
              </div>
            ))}

              </>
            ) : (
              <>
              {tempRecipients?.slice(0, 9).map((recipient) => (
                <div className={`emailItem shrinked type0${Math.floor(Math.random() * 3) + 1}`}>
                  <figure>
                    <span>{recipient.name?.charAt(0)}</span>
                  </figure>
                </div>
              ))}
              <div className={`emailItem shrinked type0${Math.floor(Math.random() * 3) + 1}`}>
                  <figure>
                    <span>+{tempRecipients.length - 9}</span>
                  </figure>
                </div>
                
              </>
            )}
            

            {/* <div className='textInput'>
              <span>{to}</span><Input name="to" placeholder='Type email address' value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
            {to && <div className='emailDroplist'>
              <ul>
                <li>user01@gmail.com</li>
                <li>user02@gmail.com</li>
                <li>user03@gmail.com</li>
                <li>user04@gmail.com</li>
                <li>user05@gmail.com</li>
                <li>user06@gmail.com</li>
                <li>user07@gmail.com</li>
              </ul>
            </div>} */}
          </div>
        </Field>

        <Field className="fieldDv">
          <Label>Subject</Label>
          <Input
            name="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </Field>

        <Field className="fieldDv">
          <Label>Message</Label>
          <Editor value={html} onChange={onChange} />
        </Field>

        <div className="btnRow">
          <Button
            className="btn btn-primary"
            onClick={handleSendEmail}
            disabled={
              !html.trim() || !subject.trim() || tempRecipients.length === 0
            }
            style={{
              ...(!html.trim() || !subject.trim()
                ? {
                    opacity: 0.6,
                    cursor: "not-allowed",
                  }
                : {}),
            }}
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
