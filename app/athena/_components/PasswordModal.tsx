import { Button, FormLabel, Input, Modal, ModalDialog } from '@mui/joy'
import { useState } from 'react'

interface PasswordModalProps {
  isOpen: boolean
  onSubmit: (password: string | null) => void
}

const PasswordModal = (props: PasswordModalProps) => {
  const { isOpen, onSubmit } = props
  const [password, setPassword] = useState('')
  return (
    <Modal open={isOpen} onClose={() => onSubmit(null)}>
      <ModalDialog>
        <FormLabel>Password</FormLabel>
        <Input onChange={(e) => setPassword(e.currentTarget.value)} autoFocus />
        <Button onClick={() => onSubmit(password)}>Submit</Button>
      </ModalDialog>
    </Modal>
  )
}

export default PasswordModal
