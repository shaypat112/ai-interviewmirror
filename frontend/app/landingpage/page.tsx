export default function PlanPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
  };

  return (
    <div>
      <form
        inputMode="none"
        className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-10"
      >
        <input
          type="text"
          placeholder="Enter your name"
          className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Get Started
        </button>
      </form>
    </div>
  );
}
