import { Link } from "react-router-dom";

export default function LoginForm() {
    return (
        <div className="flex flex-col items-center gap-3 p-4">
            <label className="text-lg font-medium">
                Please enter your email
            </label>
            <input
                type="text"
                className="rounded-lg text-lg border-gray border-opacity-60 border-2 sm:w-3/4 w-full p-2"
                placeholder="you@example.com"
            />

            <Link to="/Chargers" className="bg-accent text-white p-2 rounded-lg text-center text-lg font-bold sm:w-3/4 w-full">
                Log In
            </Link>
        </div>
    )
}
