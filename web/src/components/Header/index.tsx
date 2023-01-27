import { Plus, X } from 'phosphor-react'
import * as Dialog from '@radix-ui/react-dialog'
import Logo from '@/assets/logo.svg'
import { NewHabitForm } from '../NewHabitForm'
import './styles.css'

export const Header = () => {
  return (
    <header className='header'>
      <img src={Logo} alt='habits tracker logo' />
      <Dialog.Root>
        <Dialog.Trigger className='dialog-trigger'>
          <button className='header__add-button' type='button'>
            <Plus size={20} className='header__add-button-icon' />
            New habit
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className='dialog__overlay'>
            <Dialog.Content className='dialog__content'>
              <Dialog.Close className='dialog__close'>
                <X
                  size={24}
                  aria-label='close modal'
                />
              </Dialog.Close>
              <Dialog.Title className='dialog__header'>
                Create Habit
              </Dialog.Title>
              <NewHabitForm />
            </Dialog.Content>
          </Dialog.Overlay>
        </Dialog.Portal>
      </Dialog.Root>
    </header>
  )
}
