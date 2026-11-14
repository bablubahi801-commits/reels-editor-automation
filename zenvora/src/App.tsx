import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { StoreProvider } from '@/context/store'
import { Layout } from '@/components/Layout'
import Home from '@/pages/Home'
import Shop from '@/pages/Shop'
import Product from '@/pages/Product'
import Checkout from '@/pages/Checkout'
import { About, Shipping } from '@/pages/Info'

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="shop" element={<Shop />} />
            <Route path="product/:slug" element={<Product />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="about" element={<About />} />
            <Route path="shipping" element={<Shipping />} />
            <Route path="*" element={<Shop />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  )
}
