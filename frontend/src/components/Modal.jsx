import { X } from 'lucide-react'
import { Button } from './FormElements'

export const Modal = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <div className="p-6">{children}</div>
        {footer && <div className="p-6 border-t border-gray-200 flex space-x-2">{footer}</div>}
      </div>
    </div>
  )
}

export const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, isDangerous = false }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p className="text-gray-700 mb-6">{message}</p>
      <div className="flex space-x-2">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant={isDangerous ? 'danger' : 'primary'} onClick={onConfirm}>
          {isDangerous ? 'Delete' : 'Confirm'}
        </Button>
      </div>
    </Modal>
  )
}
