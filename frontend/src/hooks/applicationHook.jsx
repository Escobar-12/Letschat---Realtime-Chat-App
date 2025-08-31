import { useContext } from 'react'
import applicationContext from '../context/applicationContext'

const useApplication = () => useContext(applicationContext);
export default useApplication;