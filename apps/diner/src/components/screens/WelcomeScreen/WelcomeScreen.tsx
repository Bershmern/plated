"use client"

import * as React from "react"
import { motion } from "framer-motion"
import Image from "next/image"

interface WelcomeScreenProps {
  orderCount: number
  tableLabel: string | null
  orderNo: string
  onContinue: () => void
}

export function WelcomeScreen({
  orderCount,
  tableLabel,
  orderNo,
  onContinue,
}: WelcomeScreenProps) {
  // Add suffix to order count
  const visitSuffix =
    orderCount === 1
      ? "1st"
      : orderCount === 2
      ? "2nd"
      : orderCount === 3
      ? "3rd"
      : `${orderCount}th`

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="absolute inset-0 w-full h-full z-50 flex flex-col bg-surface-primary"
      onClick={onContinue} // Clicking anywhere on the screen proceeds to menu
    >
      <div className="flex-1 p-6 pt-16 flex flex-col justify-between relative overflow-hidden">
        {/* Header Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="z-10 absolute top-[62px] left-0 px-4 w-full flex flex-col gap-4"
        >
          <h1 className="text-[64px] leading-[1] font-bold text-text-primary tracking-tight">
            Welcome
            <br />
            Back
          </h1>
          <p className="text-14 font-medium text-text-primary">
            <span className="text-text-secondary">This is your {visitSuffix} order with us ❤️ - </span>
            <span className="text-16 font-bold text-text-primary">Plated</span>
          </p>
        </motion.div>

        {/* Hero Image (Table & Plates Composition) */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <motion.div 
            className="absolute top-[15%] -right-[60%] w-[140%] aspect-square"
            initial={{ opacity: 0, rotate: 45 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ delay: 0.2, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Wooden Table Base */}
            <img
              src="/brand/table/table.svg"
              alt="Table Base"
              className="absolute inset-0 w-full h-full object-contain drop-shadow-2xl"
            />

            {/* Food Plates ON TOP of the table */}
            <motion.img
              src="/brand/table/plate1.png"
              className="absolute top-[12%] left-[55%] w-[40%] h-[40%] object-contain"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
            />
            <motion.img
              src="/brand/table/plate4.png"
              className="absolute top-[42%] left-[12%] w-[45%] h-[45%] object-contain"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, duration: 0.8, type: "spring" }}
            />
            <motion.img
              src="/brand/table/plate7.png"
              className="absolute top-[45%] left-[65%] w-[40%] h-[40%] object-contain"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.7, duration: 0.8, type: "spring" }}
            />
            <motion.img
              src="/brand/table/plate5.png"
              className="absolute top-[75%] left-[18%] w-[42%] h-[42%] object-contain"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, duration: 0.8, type: "spring" }}
            />
            <motion.img
              src="/brand/table/plate2.png"
              className="absolute top-[82%] left-[65%] w-[40%] h-[40%] object-contain"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.9, duration: 0.8, type: "spring" }}
            />
          </motion.div>
        </div>

        {/* Footer Info / Order Details */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="absolute top-[75%] left-6 z-10 flex flex-col gap-2"
        >
          <div className="text-14 text-text-tertiary flex items-center gap-1">
            Table: <span className="font-bold text-text-primary text-16">{tableLabel || 'N/A'}</span>
          </div>
          <div className="text-14 text-text-tertiary flex items-center gap-1">
            Order No: <span className="font-bold text-text-primary text-16">#{orderNo}</span>
          </div>
        </motion.div>

        {/* Powered by Plated watermark */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-6 left-0 right-0 flex justify-center z-10"
        >
          <div className="text-[12px] font-medium flex items-center gap-[2px]">
            <span 
              className="bg-clip-text text-transparent uppercase tracking-wider" 
              style={{ backgroundImage: 'linear-gradient(90deg, rgba(255, 248, 240, 0.45) 0%, rgba(23, 23, 23, 0.45) 100%)' }}
            >
              powered by 
            </span>
            <span className="text-action-primary font-bold uppercase tracking-wider">Plated.</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
