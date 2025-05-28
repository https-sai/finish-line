import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

export default function Home() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-20 bg-white">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Race to Complete Your Tasks
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
          Challenge your friends to a productivity race. Set 5 tasks, complete
          them, and be the first to reach the finish line!
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/races/new"
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Start a Race
          </Link>
          <Link
            href="/races"
            className="text-sm font-semibold leading-6 text-gray-900 flex items-center"
          >
            Join a Race <ArrowRightIcon className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              How It Works
            </h2>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">
                Set Your Tasks
              </h3>
              <p className="mt-2 text-gray-600">
                Choose 5 tasks that will help you reach your goals. Make them
                challenging but achievable!
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">
                Race with Friends
              </h3>
              <p className="mt-2 text-gray-600">
                Invite friends to join your race. Compete against each other
                while supporting one another's progress.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">
                Track Progress
              </h3>
              <p className="mt-2 text-gray-600">
                Watch your progress on the race track. Complete tasks to move
                forward and be the first to finish!
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
