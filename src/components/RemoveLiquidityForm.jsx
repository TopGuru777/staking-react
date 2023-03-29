import React, { useState } from 'react'
import { useBalance, useAddress } from '@thirdweb-dev/react'
import { showBalance } from '../utils/helper'
import { unstakeLp } from '../contracts/stake'
import { usePersonalInfo } from '../hooks/usePersonalInfo'
import { pairTokenAddress } from '../utils/constants'
import { toast } from 'react-hot-toast'

const RemoveLiquidityForm = ({ setIsModalVisible }) => {
  const address = useAddress()
  const { data } = useBalance(pairTokenAddress)
  const [amount, setAmount] = useState()
  const { stakedLp } = usePersonalInfo()

  const handleChange = (e) => {
    setAmount(e.target.value)
  }

  const handleMaxClick = () => {
    setAmount(stakedLp)
  }

  const handleUnstakeClick = async () => {
    try {
      if (amount > 0 && amount <= data.displayValue) {
        const response = await unstakeLp(amount)
        if (response.status === 'Success') {
          toast.success('Succeed.')
        } else {
          if (response.status === 'Error')
            toast.error(`${response.status}: ${response.error}.`)
          else
            toast.error('Transaction failed by unknown reason.')
        }
      } else {
        console.log(amount)
        if (amount === '0')
          toast.error('Error: Invalid Input')
        else
          toast.error('Error: Insufficient Balance')
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <form className='stake-window__form'>
      <div className='stake-window__form-wrapper'>
        <label htmlFor="unstake-input">LP-Token</label>
        <p>
          Balance: <span>{showBalance(data?.displayValue)} LP</span>
        </p>
        <input type="number" placeholder='Enter an amount' id='unstake-input' value={amount} onChange={handleChange} />
      </div>
      <div className='stake-window__total'>
        <span className='stake-window__subtitle'>Staked amount of LP token</span>
        <button type='button' className='stake-window__max-btn' onClick={handleMaxClick}>Max</button>
        <b className='stake-window__total-amount'>{stakedLp || 0}</b>
      </div>
      <footer className='stake-window__footer'>
        <button type='button' className='gray' onClick={() => setIsModalVisible(false)}>Cancel</button>
        <button type='button' className='purple' onClick={handleUnstakeClick}>Unstake</button>
      </footer>
    </form>
  )
}

export default RemoveLiquidityForm;