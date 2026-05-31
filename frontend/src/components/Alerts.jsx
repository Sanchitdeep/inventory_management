export const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  )
}

export const ErrorAlert = ({ message }) => {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
      <p className="font-semibold">Error</p>
      <p>{message}</p>
    </div>
  )
}

export const SuccessAlert = ({ message }) => {
  return (
    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4">
      <p className="font-semibold">Success</p>
      <p>{message}</p>
    </div>
  )
}

export const WarningAlert = ({ message }) => {
  return (
    <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg mb-4">
      <p className="font-semibold">Warning</p>
      <p>{message}</p>
    </div>
  )
}
