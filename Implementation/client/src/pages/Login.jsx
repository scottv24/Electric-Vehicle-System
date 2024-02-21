import Logo from '../components/Logo'
import Card from '../components/Card'
import LoginForm from '../components/forms/Login'

export default function Login() {
    return (
        <div className="flex justify-center items-center h-screen ">
            <Card className="min-h-[400px] p-8 grid grid-cols-1 sm:w-auto w-full sm:h-auto h-full content-around">
                <Logo hw={true} />
                <LoginForm />
            </Card>
        </div>
    )
}
