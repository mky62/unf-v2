"use client"

import { Button } from '@/src/components/ui/button'
import AuthBg from '@/public/loginbg.jpg'
import Image from 'next/image'
import Logo from '@/public/logoapp.svg'
import { Alert, AlertDescription } from '@/src/components/ui/alert'
import { AlertCircle, LoaderCircle } from 'lucide-react'
import { GitHubIcon } from '@/src/components/icons/Icons'
import { useHandleAuth } from '@/src/lib/auth/handleAuth'


export default function CustomSignInForm() {

  const { oauthLoading,
    error,
    handleOAuth } = useHandleAuth();

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center px-4 sm:px-6 py-14 sm:py-20">

      <Image
        src={AuthBg}
        alt="Authentication background"
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 -z-20 object-cover"
      />

      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/25 via-black/15 to-black/35" />


      <div
        className='bg-white/20 backdrop-blur-xl rounded-2xl 
      shadow-2xl
      m-4
      px-6
      py-8
      sm:px-8
      sm:py-10
      space-y-6'>
        <div
          className='text-center space-y-4'>
          <div className="flex justify-center">
            <h1 className="text-xl font-geom tracking-tight  text-blue-900">RepoLens</h1>
          </div>
        </div>
        <div
          className='grid grid-cols-1 '>
          <Button
            type="button"
            className="w-full h-12 bg-white/70 hover:bg-blue-400/20"
            onClick={() => handleOAuth("github")}
            disabled={!!oauthLoading}>
            {oauthLoading === "github" ? (
              <LoaderCircle />
            ) : (<GitHubIcon />)}
            Continue with GitHub
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* After */}
        <div
          id="clerk-captcha"
          data-cl-theme="auto"
          data-cl-size="normal"
          data-cl-language="auto"
        />

        <p className="pt-1 text-center font-nunito text-sm text-muted-foreground">
          BE THE PART OF THE{" "}<span className='font-geom underline cursor-pointer'><a href="/"></a>RepoLens</span>
        </p>

      </div>

    </div >
  )
}
