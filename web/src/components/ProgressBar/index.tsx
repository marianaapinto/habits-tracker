import './style.css'

interface ProgressBarProps {
  progress: number
}

export const ProgressBar = ({ progress }: ProgressBarProps) => {
  return (
    <div className='progress-bar'>
      <div
        role='progressbar'
        aria-label='progress of completed habits in this day'
        aria-valuenow={progress}
        className='progress-bar__inner'
        style={{
          width: `${progress}%`,
        }}
      />
    </div>
  )
}
