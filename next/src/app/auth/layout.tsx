// childrenが渡しているのは例えば <SignUpPage />のような具体的なコンポーネントであるため、その中にはたくさんの要素が入っている。それをカバーするために包括的なReact.ReactNode型を使わされている
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        {children}
      </div>
    </div>
  )
}