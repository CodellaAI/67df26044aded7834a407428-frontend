
export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-[80vh]">
      <div className="relative">
        <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-primary animate-spin"></div>
        <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-4 border-b-4 border-secondary animate-spin animation-delay-500"></div>
      </div>
    </div>
  )
}
