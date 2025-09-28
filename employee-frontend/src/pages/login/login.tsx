import LoginForm from "@/pages/login/components/login-form";

export default function Login() {
  // In a real app, you might have a dark mode toggle state here
  // For now, it respects the system preference via Tailwind's 'class' strategy
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-gray-800 ">
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-sm mx-auto">
          <header className="text-center mb-10">
            <h1 className="text-3xl font-bold text-background-dark dark:text-background-light">
              Welcome Back
            </h1>
            <p className="text-red-600/80 dark:text-red-500/70 mt-2">
              Sign in to record your attendance
            </p>
          </header>

          <LoginForm />

          <footer className="text-center mt-12">
            <p className="text-sm text-red-600/60">
              Need help?{" "}
              <a href="#" className="font-medium hover:underline">
                Contact Support
              </a>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
