import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, subtitle, children, maxWidth = '520px', className = '', variant = 'modal' }) {
  const ref = useRef(null);
  const titleId = useId();
  const subtitleId = useId();
  useEffect(() => {
    const dialog = ref.current;
    if (!isOpen || !dialog) return;
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
      if (previous?.isConnected) previous.focus();
    };
  }, [isOpen]);
  if (!isOpen) return null;
  return createPortal(<dialog ref={ref} className={`modal-dialog dialog-${variant} ${className}`} style={{ '--dialog-width': maxWidth }} aria-labelledby={title ? titleId : undefined} aria-describedby={subtitle ? subtitleId : undefined} onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => {
    if (event.target !== event.currentTarget) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose();
  }}>
    <header className="modal-header"><div><span className="modal-edition">UNIBUDDY / THE CAMPUS EDITION</span>{title && <h2 id={titleId} className="modal-title">{title}</h2>}{subtitle && <p id={subtitleId} className="modal-subtitle">{subtitle}</p>}</div><button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close dialog"><X size={20} /></button></header>
    <div className="modal-body">{children}</div>
  </dialog>, document.body);
}
