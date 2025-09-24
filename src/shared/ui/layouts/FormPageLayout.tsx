import  { type ReactNode } from 'react'

export const FormPageLayout = ({title,form}:{title:string;form:ReactNode}) => {
  return (   <div className="min-h-screen flex justify-center items-center bg-black">
        <main className="rounded-xl border border-zinc-500 bg-blue-200/10 px-14 py-8 pb-14 max-w-[400px]">
          <h1 className="text-4xl mb-6 text-white">{title}</h1>
        {form}
        </main>
      </div>
  )
}
