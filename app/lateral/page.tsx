'use client'

import { useState } from 'react'
import questionsData from '../../data/lateral/questions.json'
import styles from './page.module.scss'
import { ThemeProvider, useTheme } from './ThemeContext'

interface Question {
  question: string
  answer: string
  episode: number
}

function LateralPageContent() {
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null)
  const [showModal, setShowModal] = useState(false)
  const { theme, colors, toggleTheme } = useTheme()

  const handleQuestionClick = (question: Question) => {
    setSelectedQuestion(question)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedQuestion(null)
  }

  return (
    <div 
      className={styles.container}
      style={{
        backgroundColor: colors.bgPrimary,
        color: colors.textPrimary,
        transition: 'background-color 0.3s ease, color 0.3s ease'
      }}
    >
      <header className={styles.header}>
         <div className={styles.headerContent}>
           <h1>Lateral Thinking Questions</h1>
         </div>
         <small>Click on any question to reveal the answer</small>
       </header>

      <main className={styles.main}>
        <div className={styles.questionsGrid}>
            {questionsData.map((question, index) => (
                     <div
                        key={index}
                        className={styles.questionCard}
                        onClick={() => handleQuestionClick(question)}
                        style={{
                          backgroundColor: colors.bgSecondary,
                          border: `1px solid ${colors.borderSecondary}`,
                          boxShadow: `0 2px 4px ${colors.shadowLight}`,
                          color: colors.textPrimary
                        }}
                      >
                        <p><span style={{ fontWeight: 'bold', marginRight: '0.5rem' }}>{index + 1}.</span>{question.question}</p>
                      </div>
                   ))}
          </div>
      </main>

      {showModal && selectedQuestion && (
        <div className={styles.modal} onClick={closeModal}>
           <div 
             className={styles.modalContent} 
             onClick={(e) => e.stopPropagation()}
             style={{
               backgroundColor: colors.bgPrimary,
               border: `1px solid ${colors.borderColor}`,
               boxShadow: `0 10px 25px ${colors.shadowHeavy}`
             }}
           >
             <button 
               className={styles.closeButton} 
               onClick={closeModal}
               style={{
                 color: colors.textSecondary
               }}
             >
               ×
             </button>
             <div className={styles.modalBody}>
               <h3 style={{ color: colors.textPrimary, borderBottomColor: colors.borderColor }}>Question</h3>
               <p className={styles.question} style={{ color: colors.textTertiary }}>{selectedQuestion.question}</p>
               <h3 style={{ color: colors.textPrimary, borderBottomColor: colors.borderColor }}>Answer</h3>
               <p 
                 className={styles.answer} 
                 style={{ 
                   color: colors.textQuaternary,
                   backgroundColor: colors.bgSecondary,
                   borderLeftColor: colors.accentColor
                 }}
               >{selectedQuestion.answer}</p>
               <p className={styles.episode} style={{ color: colors.textMuted }}>Episode {selectedQuestion.episode}</p>
             </div>
           </div>
         </div>
       )}
       
       {/* Floating theme toggle button */}
       <button 
         className={styles.themeToggle} 
         onClick={toggleTheme}
         style={{
           backgroundColor: colors.bgTertiary,
           border: `2px solid ${colors.borderColor}`,
           color: colors.textPrimary
         }}
       >
         {theme === 'light' ? '🌙' : '☀️'}
       </button>
     </div>
   )
 }

export default function LateralPage() {
  return (
    <ThemeProvider>
      <LateralPageContent />
    </ThemeProvider>
  )
}
