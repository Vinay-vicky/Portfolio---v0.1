import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loadPortfolio } from './portfolioSlice'

const usePortfolioData = () => {
  const dispatch = useDispatch()
  const portfolio = useSelector((state) => state.portfolio)

  const refreshData = () => dispatch(loadPortfolio())

  useEffect(() => {
    if (!portfolio.profile && !portfolio.loading) {
      dispatch(loadPortfolio())
    }
  }, [dispatch, portfolio.profile, portfolio.loading])

  return {
    ...portfolio,
    refreshData,
  }
}

export default usePortfolioData
