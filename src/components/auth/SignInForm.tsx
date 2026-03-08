// "use client"

// import { Button } from '@/src/components/ui/button'
// import AuthBg from '@/public/loginbg.jpg'
// import Image from 'next/image'
// import { Alert, AlertDescription } from '@/src/components/ui/alert'
// import { AlertCircle, LoaderCircle } from 'lucide-react'
// import { GitHubIcon } from '@/src/components/icons/Icons'
// import { useHandleAuth } from '@/src/lib/auth/handleAuth'


// export default function CustomSignInForm() {

//   const { oauthLoading,
//     error,
//     handleOAuth } = useHandleAuth();

//   return (
//     <div className="relative min-h-screen overflow-hidden flex items-center justify-center px-4 sm:px-6 py-14 sm:py-20">

//       <Image
//         src={AuthBg}
//         alt="Authentication background"
//         fill
//         priority
//         sizes="100vw"
//         className="absolute inset-0 -z-20 object-cover"
//       />

//       <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/25 via-black/15 to-black/35" />


//       <div
//         className='bg-white/20  backdrop-blur-xl rounded-2xl 
//       shadow-2xl
//       m-18
//       px-15
//       py-8
//       sm:px-8
//       sm:py-10
//       space-y-6'>

//         <div className="flex justify-center
//           h-12  items-center border-2 border-blue-900 rounded-2xl px-6 ">
//           <h1 className="text-xl font-geom  tracking-tight  text-blue-900">RepoLens</h1>
//         </div>
//         <div
//           className='grid grid-cols-1 '>
//           <Button
//             type="button"
//             className="w-full h-12 bg-white/70 hover:bg-blue-400"
//             onClick={() => handleOAuth("github")}
//             disabled={!!oauthLoading}>
//             {oauthLoading === "github" ? (
//               <LoaderCircle />
//             ) : (<GitHubIcon />)}
//             Continue with GitHub
//           </Button>
//         </div>

//         {error && (
//           <Alert variant="destructive">
//             <AlertCircle className="h-4 w-4" />
//             <AlertDescription>{error}</AlertDescription>
//           </Alert>
//         )}

//         {/* After */}
//         <div
//           id="clerk-captcha"
//           data-cl-theme="auto"
//           data-cl-size="normal"
//           data-cl-language="auto"
//         />

//         <p className="pt-1 text-center font-nunito text-sm text-muted-foreground">
//           BE THE PART OF THE{" "}<span className='font-geom underline cursor-pointer'><a href="/"></a>RepoLens</span>
//         </p>

//       </div>



//     </div >
//   )
// }

"use client"

import { Button } from '@/src/components/ui/button'
import AuthBg from '@/public/signinbg.jpg'
import Image from 'next/image'
import { Alert, AlertDescription } from '@/src/components/ui/alert'
import { AlertCircle, LoaderCircle } from 'lucide-react'
import { GitHubIcon } from '@/src/components/icons/Icons'
import { useHandleAuth } from '@/src/lib/auth/handleAuth'
import RotatingText from '@/src/components/ui/RotatingText'


export default function AuthInterface() {


  const { oauthLoading,
    error,
    handleOAuth } = useHandleAuth();


  return (
    <div
      className="relative w-full h-screen overflow-hidden flex items-center justify-center"

    >

      <Image
        src={AuthBg}
        alt="Authentication background"
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 -z-20 object-cover"
      />
      {/* Overlay */}

      {/* Main Panel */}
      <div className='relative z-10 bg-white/20 backdrop-blur-xl rounded-2xl shadow-2xl m-4 px-6 py-12 sm:px-8 sm:py-10 space-y-9 w-full max-w-xl'>

        {/* Header */}
        <div className='text-center space-y-4'>
          <div className="flex justify-center">
            <h1 className="text-2xl font-bold font-geom tracking-tight text-blue-900">RepoLens</h1>
          </div>
          <div className="flex justify-center items-center">
            <p className="text-md text-blue-800 flex items-center gap-1">
              Welcome back ✨

              <span className="inline-flex items-center">
                <RotatingText
                  texts={[
                    "developer",
                    "builder",
                    "creator",
                    "vibe coder",
                    "contributer",
                    "innovator",
                    "engineer",
                  ]}
                  mainClassName="inline-flex text-xl text-white font-courgette font-bold overflow-hidden"
                  staggerFrom="last"
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "-120%" }}
                  staggerDuration={0.065}
                  splitLevelClassName="overflow-hidden"
                  transition={{ type: "spring", damping: 60, stiffness: 600 }}
                  rotationInterval={3000}
                />
              </span>
            </p>
          </div>
        </div>

        {/* GitHub Button */}
        <div className='grid grid-cols-1'>
          <Button
            type="button"
            className="w-full h-12 bg-white/70 hover:bg-blue-700/60 text-blue-900 font-semibold rounded-lg flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50"
            onClick={() => handleOAuth("github")}
            disabled={!!oauthLoading}
          >
            {oauthLoading === "github" ? (
              <LoaderCircle className="w-5 h-5 animate-spin" />
            ) : (
              <GitHubIcon />
            )}
            Continue with GitHub
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Clerk Captcha */}
        <div
          id="clerk-captcha"
          data-cl-theme="auto"
          data-cl-size="normal"
          data-cl-language="auto"
        />

        {/* Footer Text */}
        <p className="pt-1 text-center font-light text-sm text-blue-800">
          Be part of the{" "}
          <span className='font-semibold underline cursor-pointer text-blue-900'>
            <a href="/">RepoLens</a>
          </span>
          {" "}community
        </p>

      </div>


    </div>
  );
}
