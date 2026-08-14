'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BlockWorldLandscape } from '~/components/register/block-world-landscape'
import { SignInRightPanel } from '~/components/signin/signin-form'
import { useGetLoggedInUserInfo } from '~/hooks/api/auth'

export default function SigninPage() {
  const router = useRouter()
  const { user, isLoading, isError } = useGetLoggedInUserInfo()

  useEffect(() => {
    if (!isLoading && !isError && user) {
      router.push('/dashboard')
    }
  }, [user, isLoading, isError, router])

  if (user && !isLoading && !isError) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center text-[#6e7a8a] font-['Outfit']">
        Redirecting to dashboard...
      </div>
    )
  }

  return (
    <div className="register-split min-h-screen flex bg-[#0d1117] font-['Outfit']">
      {/* LEFT — World landscape */}
      <div className="register-left flex-[0_0_58%] relative overflow-hidden">
        <BlockWorldLandscape />
      </div>

      {/* RIGHT — Sign in card */}
      <SignInRightPanel />
    </div>
  )
}
