const Loader = () => {
  return (
    <div className="flex justify-center items-center">
      <div
        className="w-8 h-8 border-4 border-gray-300 rounded-full animate-spin"
        style={{ borderTopColor: "#b92825" }} // Custom red color
      ></div>
    </div>
  );
};

export default Loader;
