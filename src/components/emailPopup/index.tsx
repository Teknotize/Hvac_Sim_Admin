import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { Field, Input, Label, Button } from '@headlessui/react';
import Editor from 'react-simple-wysiwyg';
import useEmailToastStore from '../../store/userEmailToastStore';
import { apiClient } from '../../config';

interface EmailPopupProps {
  isOpen: boolean;
  onClose: () => void;
  recipients?: Array<{
    [key: string]: any; 
  }>;
}

interface Recipient {
  [key: string]: any;
}

export default function EmailPopup({ isOpen, onClose, recipients = [] }: EmailPopupProps) {
  const [html, setHtml] = useState('');
  const [subject, setSubject] = useState('');
  const [to, setTo] = useState('');
  const [tempRecipients, setTempRecipients] = useState<Recipient[]>([]);
  const [progress, setProgress] = useState({
    current: 0,
    total: 0,
    percentage: 0,
    lastEmail: ''
  });
  
  const { startProgress, updateProgress, completeProgress } = useEmailToastStore();

  useEffect(() => {
    setTempRecipients(recipients);
  }, [recipients]);

  const removeRecipient = (user: any) => {
    setTempRecipients((prev) => prev.filter((recipient) => recipient !== user));
  };

  function onChange(e: any) {
    setHtml(e.target.value);
  }

  const handleSendEmail = async () => {
    if (!html || !subject || tempRecipients.length === 0) return;
    
    const emailList = tempRecipients.map(r => r.email);
    const totalEmails = emailList.length;
    
    // Start progress tracking before closing modal
    startProgress(totalEmails);
    
    // Close the modal immediately
    onClose();
    
    try {
      const eventSource = new EventSource(
        `${apiClient.defaults.baseURL}/admin/send-mails?emails=${encodeURIComponent(JSON.stringify(emailList))}&subject=${encodeURIComponent(subject)}&content=${encodeURIComponent(html)}`
      );

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        if (data.completed) {
          eventSource.close();
          completeProgress(true);
          return;
        }
        
        updateProgress(data.step);
      };

      eventSource.onerror = () => {
        eventSource.close();
        completeProgress(false);
        onClose()
      };
      
    } catch (error) {
      console.error('Error sending emails:', error);
      completeProgress(false);
      onClose()
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`sendEmailPop active`}>
      <div className='sendEmailPop-wrapper shadow-lg'>
        <Button className='closeBtn' onClick={onClose}>
          <FontAwesomeIcon icon={faXmark} />
        </Button>
        <h2>Send Email</h2>
        
          <div className="email-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progress.percentage}%` }}
              ></div>
            </div>
            <div className="progress-text">
              Sending {progress.current} of {progress.total} emails...
              {progress.lastEmail && (
                <span className="last-email">(Last: {progress.lastEmail})</span>
              )}
            </div>
          </div>
        
        <Field className='fieldDv'>
          <Label>To</Label>
          <div className='emailInputCol'>
            {tempRecipients?.map((recipient) => (
              <div className='emailItem' key={recipient.email}>
                <figure><span>{recipient.name.charAt(0)}</span></figure>
                <span>{recipient.name}</span>
                <i onClick={() => removeRecipient(recipient)}>
                  <FontAwesomeIcon icon={faXmark} />
                </i>
              </div>
            ))}
            <div className='textInput'>
              <span>{to}</span>
              <Input 
                name="to" 
                placeholder='Type email address' 
                value={to} 
                onChange={(e) => setTo(e.target.value)} 
              />
            </div>
          </div>
        </Field>
        
        <Field className='fieldDv'>
          <Label>Subject</Label>
          <Input 
            name="subject" 
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </Field>
        
        <Field className='fieldDv'>
          <Label>Message</Label>
          <Editor value={html} onChange={onChange} />
        </Field>
        
        <div className='btnRow'>
          <Button 
            className='btn btn-primary' 
            onClick={handleSendEmail}
            disabled={!html.trim() || !subject.trim()}

          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}