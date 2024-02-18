import Logo from '../components/Logo'
import Card from '../components/Card'
import LoginForm from '../components/forms/Login'

export default function Login() {
  return (
    <Card className='lg:w-1/3 min-h-[200px] p-8'>
      <Logo hw={true} />
      <LoginForm />
    </Card>
  )
}
