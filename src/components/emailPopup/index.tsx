// components/EmailPopup.tsx
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { Field, Input, Label, Button } from '@headlessui/react';
import Editor from 'react-simple-wysiwyg';

interface EmailPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EmailPopup({ isOpen, onClose }: EmailPopupProps) {
  const [html, setHtml] = useState('');

  function onChange(e: any) {
    setHtml(e.target.value);
  }

  const handleSendEmail = () => {
    // Add your email sending logic here
    console.log('Sending email with content:', html);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={`sendEmailPop active`}>
      <div className='sendEmailPop-wrapper'>
        <Button className='closeBtn' onClick={onClose}>
          <FontAwesomeIcon icon={faXmark} />
        </Button>
        <h2>Send Email</h2>
        <Field className='fieldDv'>
          <Label>To</Label>
          <Input name="to" />
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