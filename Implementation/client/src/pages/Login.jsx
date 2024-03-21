import Logo from '../components/Logo'
import Card from '../components/Card'
import LoginForm from '../components/forms/Login'
import { useEffect } from 'react'
import { loggedInCheck } from '../data/login'

export default function Login() {
    useEffect(() => {
        async function checkLogin() {
            await loggedInCheck()
        }
        checkLogin()
    }, [])

    return (
        <div className="flex justify-center items-center h-screen bg-bg">
            <Card className="min-h-[400px] p-8 grid grid-cols-1 sm:w-auto w-full sm:h-auto h-full content-around">
                <Logo hw={true} titleStyle="landing" />
                <LoginForm />
            </Card>
        </div>
    )
}
