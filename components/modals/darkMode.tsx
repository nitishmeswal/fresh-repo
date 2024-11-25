const DarkButton = ({
  handler,
  currentTheme,
}: {
  handler: () => void;
  currentTheme: boolean;
}) => {
  return (
    <button
      onClick={handler}
      title="Toggle Theme"
      aria-label="Toggle Theme"
      className={`theme-toggle px-4 py-2 border-none rounded-full ${
        currentTheme ? "bg-gray-950 text-white" : "bg-white text-black"
      } hover:bg-gray-800 hover:text-white`}
    >
      {currentTheme ? "Dark" : "Light"}
    </button>
  );
};

export default DarkButton;
