export const loadRazorpayScript = () => {
  if (typeof window === 'undefined') {
    return Promise.resolve(false)
  }

  if (typeof window.Razorpay === 'function') {
    return Promise.resolve(true)
  }

  if (window.__razorpayScriptPromise) {
    return window.__razorpayScriptPromise
  }

  window.__razorpayScriptPromise = new Promise(resolve => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })

  return window.__razorpayScriptPromise
}
