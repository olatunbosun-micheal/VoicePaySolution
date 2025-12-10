import { LoginForm } from "@/components/login-form"
import LoginCue from "@/components/login-cue"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <LoginCue />
        <LoginForm />
      </div>
    </div>
  )
}
