import { motion } from "framer-motion"
import { ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"


const BackButton = () => {
    const router = useRouter();
    const handleClickPreview = ()=>{
        router.back();
    }
  return (
   <div onClick={handleClickPreview} className="inline-block mb-6 cursor-pointer">
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex items-center text-sm font-medium text-zinc-400 hover:text-purple-500 transition-colors"
    >
      <ChevronLeft size={16} className="mr-1" />
      Back
    </motion.div>
  </div>
  )
}

export default BackButton