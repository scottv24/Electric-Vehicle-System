import { useState } from 'react'
import { login } from '../../data/login'
import Spinner from '../Spinner'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelopeCircleCheck } from '@fortawesome/free-solid-svg-icons'

export default function LoginForm({ message }) {
    const [email, setEmail] = useState('')
    const [loggingIn, setLoggingIn] = useState(false)
    const [emailSent, setEmailSent] = useState(false)

    async function submit() {
        setLoggingIn(true)
        const { status } = await login(email)
        if (status === 200) {
            setEmailSent(true)
        }
    }

    if (loggingIn) {
        return (
            <div className="flex flex-col items-center gap-3 p-4">
                <p className="text-lg font-medium text-accent">
                    {emailSent
                        ? 'Please check your email to finish logging in.'
                        : 'Logging in...'}
                </p>
                {emailSent ? (
                    <p className="text-accent text-3xl">
                        <FontAwesomeIcon icon={faEnvelopeCircleCheck} />
                    </p>
                ) : (
                    <Spinner />
                )}
            </div>
        )
    }
    return (
        <div className="flex flex-col items-center gap-3 p-4">
            <label className="text-lg font-medium">
                Please enter your email {message ? message : ''}
            </label>
            <input
                type="text"
                className="rounded-lg text-lg border-gray border-opacity-60 border-2 sm:w-3/4 w-full p-2"
                placeholder="you@example.com"
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') submit()
                }}
            />

            <button
                to="/Chargers"
                className="bg-accent text-white p-2 rounded-lg text-center text-lg font-bold sm:w-3/4 w-full"
                onClick={() => submit()}
            >
                Log In
            </button>
            <p className="w-2/3 text-center text-gray">
                By logging in you consent to your email being stored, and the
                use of functional cookies.
            </p>
        </div>
    )
}
