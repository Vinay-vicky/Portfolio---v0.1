import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loadPortfolio } from './portfolioSlice'

const usePortfolioData = () => {
  const dispatch = useDispatch()
  const portfolio = useSelector((state) => state.portfolio)

  useEffect(() => {
    if (!portfolio.profile && !portfolio.loading) {
      dispatch(loadPortfolio())
    }
  }, [dispatch, portfolio.profile, portfolio.loading])

  return portfolio
}

export default usePortfolioData
