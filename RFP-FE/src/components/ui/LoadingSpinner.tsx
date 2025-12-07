function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="relative flex gap-2">
        <div className="w-4 h-4 bg-black rounded-full animate-bounce"></div>

        <div className="w-4 h-4 bg-black rounded-full animate-bounce [animation-delay:0.3s]"></div>
        <div className="w-4 h-4 bg-black rounded-full animate-bounce [animation-delay:0.3s]"></div>
      </div>
    </div>
  );
}

export default LoadingSpinner;
