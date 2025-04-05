import { ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessageProps {
  content: ReactNode;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  onClose?: () => void;
}

const iconMap = {
  success: <CheckCircle className="h-5 w-5" />,
  error: <X className="h-5 w-5" />,
  info: <Info className="h-5 w-5" />,
  warning: <AlertTriangle className="h-5 w-5" />,
};

const bgColorMap = {
  success: 'bg-green-50 border-green-500 text-green-700',
  error: 'bg-red-50 border-red-500 text-red-700',
  info: 'bg-blue-50 border-blue-500 text-blue-700',
  warning: 'bg-yellow-50 border-yellow-500 text-yellow-700',
};

const iconColorMap = {
  success: 'text-green-500',
  error: 'text-red-500',
  info: 'text-blue-500',
  warning: 'text-yellow-500',
};

const MessageNotification = ({ content, type, duration = 3000, onClose }: MessageProps) => {
  // Close the notification after duration
  setTimeout(() => {
    if (onClose) onClose();
  }, duration);

  return (
    <div
      className={cn(
        'flex items-center p-4 mb-4 text-sm border-l-4 rounded-lg shadow-md',
        bgColorMap[type]
      )}
      role="alert"
    >
      <div className={cn('mr-3', iconColorMap[type])}>
        {iconMap[type]}
      </div>
      <div>{content}</div>
      <button
        type="button"
        className="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex h-8 w-8 focus:ring-2 focus:ring-gray-300"
        onClick={onClose}
        aria-label="Close"
      >
        <span className="sr-only">Close</span>
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};

const createNotification = (props: MessageProps) => {
  // Create container if not exists
  let container = document.getElementById('message-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'message-container';
    container.className = 'fixed top-4 right-4 z-50 flex flex-col items-end';
    document.body.appendChild(container);
  }

  // Create unique id for this notification
  const id = `message-${Date.now()}`;
  const notificationNode = document.createElement('div');
  notificationNode.id = id;
  container.appendChild(notificationNode);

  // Render notification
  const root = createRoot(notificationNode);
  
  const onClose = () => {
    // Fade out effect
    notificationNode.style.opacity = '0';
    setTimeout(() => {
      root.unmount();
      notificationNode.remove();
      
      // Remove container if it's empty
      if (container && container.childNodes.length === 0) {
        container.remove();
      }
      
      if (props.onClose) props.onClose();
    }, 300);
  };

  root.render(<MessageNotification {...props} onClose={onClose} />);
};

export const message = {
  success: (content: ReactNode, duration?: number) => 
    createNotification({ content, type: 'success', duration }),
  
  error: (content: ReactNode, duration?: number) => 
    createNotification({ content, type: 'error', duration }),
  
  info: (content: ReactNode, duration?: number) => 
    createNotification({ content, type: 'info', duration }),
  
  warning: (content: ReactNode, duration?: number) => 
    createNotification({ content, type: 'warning', duration }),
}; 