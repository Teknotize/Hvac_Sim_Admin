
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { Field, Input, Label, Button } from '@headlessui/react';
import Editor from 'react-simple-wysiwyg';
import useEmailToastStore from '../../store/userEmailToastStore';
interface EmailPopupProps {
  isOpen: boolean;
  onClose: () => void;
  recipients?: Array<{
    [key: string]: any; 
  }>;
}

const contact = {
  name: "John Doe",
  email: "john.doe@example.com"
}

export default function EmailPopup({ isOpen, onClose ,recipients}: EmailPopupProps) {
  const [html, setHtml] = useState('');
  const [to, setTo] = useState('');
  const { startProgress, updateProgress, completeProgress } = useEmailToastStore();
const removeReciepent=()=>{

}
  function onChange(e: any) {
    setHtml(e.target.value);
  }
useEffect(()=>{
  console.log('recipients',recipients)
},[recipients])
  const handleSendEmail = () => {
    // Add your email sending logic here
    console.log('Sending email with content:', html);
    testEmailProgress()
    onClose();
  };

  if (!isOpen) return null;

  const testEmailProgress = () => {
      
      const totalEmails = 10;
      let currentProgress = 0;

      startProgress(totalEmails);
      
      const interval = setInterval(() => {
        currentProgress += 1;
        updateProgress(currentProgress);
        console.log(`Progress: ${currentProgress}/${totalEmails}`);

        
        if (currentProgress >= totalEmails) {
          clearInterval(interval);
          completeProgress(true);
        }
      }, 2000);

      return () => clearInterval(interval);
  };
  return (
    <div className={`sendEmailPop active`}>
      <div className='sendEmailPop-wrapper shadow-lg'>
        <Button className='closeBtn' onClick={onClose}>
          <FontAwesomeIcon icon={faXmark} />
        </Button>
        <h2>Send Email</h2>
        <Field className='fieldDv'>
          <Label>To</Label>
          {/* <Input name="to" /> */}
          <div className='emailInputCol'>
            {recipients?.map((recipient)=>
            <div className='emailItem'>
            <figure><span>{recipient.name.charAt(0)}</span></figure>
            <span>{recipient.name}</span>
            <i onClick={removeReciepent}><FontAwesomeIcon icon={faXmark} /></i>
          </div>)}
            
            <div className='textInput'>
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
            </div>}
          </div>
        </Field>
        <Field className='fieldDv'>
          <Label>Subject</Label>
          <Input name="subject" />
        </Field>
        <Field className='fieldDv'>
          <Label>Message</Label>
          <Editor value={html} onChange={onChange} />
        </Field>
        <div className='btnRow'>
          <Button className='btn btn-primary' onClick={handleSendEmail}>Send</Button>
        </div>
      </div>
    </div>
  );
}

