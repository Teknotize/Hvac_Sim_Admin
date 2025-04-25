
import useEmailToastStore from '../../store/userEmailToastStore';

const ToastButtons = () => {
  const { showToast, startProgress, updateProgress, completeProgress } = useEmailToastStore();

  const handleProgressToast = () => {
    const totalEmails = 10; // Example total
    let completedEmails = 0;

    // Start the progress toast
    startProgress(totalEmails);

    // Simulate progress updates
    const interval = setInterval(() => {
      completedEmails += 1;
      updateProgress(completedEmails);

      if (completedEmails >= totalEmails) {
        clearInterval(interval);
        completeProgress(true); // Mark as success when done
      }
    }, 500); // Update every 500ms
  };

  return (
    <div>
      <button
        onClick={() => {showToast('Emails sent successfully!', 'success');}}
        className="btn btn-success"
      >
        Success Toast
      </button>
      <button
        onClick={() => showToast('An error occurred while sending emails!', 'error')}
        className="btn btn-danger"
      >
        Error Toast
      </button>
      <button
        onClick={handleProgressToast}
        className="btn btn-primary"
      >
        Open Toast Progress
      </button>
    </div>
  );
};

export default ToastButtons;