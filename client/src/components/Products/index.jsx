import AllProductsSection from '../AllProductsSection'

import Header from '../Header'

import './index.css'
import PrimeDealsSectionWrapper from '../PrimeDealsSection'

const Products = () => (
  <>
    <Header />
    <div className="product-sections">
      <PrimeDealsSectionWrapper />
      <AllProductsSection />
    </div>
  </>
)

export default Products
