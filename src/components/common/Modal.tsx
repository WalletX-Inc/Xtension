import {GrClose} from 'react-icons/gr'

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  headerText?: React.ReactNode;
  footerData?: React.ReactNode;
}

const Modal:React.FC<ModalProps> = ({ isOpen, onClose, children,headerText,footerData }) => {
    if(!isOpen) {return null}
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="modal-overlay fixed inset-0 bg-black opacity-50"></div>
      <div className="modal-container bg-white w-96 p-6 rounded-lg shadow-lg relative">
        <div className="flex justify-between mb-4">
          <div className="modal-header text-sm font-bold m-auto">{headerText}</div>
          <button
            className="modal-close-button hover:text-gray-700"
            onClick={onClose}
          >
            <GrClose/>
          </button>
        </div>
        <div className="modal-content">{children}</div>
        {footerData && <div className="modal-footer">{footerData}</div>}
      </div>
    </div>
  );
};

export default Modal;
