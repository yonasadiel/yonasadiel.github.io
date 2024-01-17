import { useState } from 'react'
import { FormLabel, Modal, ModalDialog, Input, Button } from '@mui/joy'

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