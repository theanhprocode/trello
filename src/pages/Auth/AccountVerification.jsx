import { useState, useEffect } from 'react'
import { useSearchParams, Navigate } from 'react-router-dom'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import { verifyUserApi } from '~/apis/index.js'


// Lấy giá trị email và token từ url

function AccountVerification() {
  let [searchParams] = useSearchParams()
  // console.log(searchParams)

  const { email, token } = Object.fromEntries([...searchParams])
  // console.log(email, token)

  // tạo một state để hiển thị trạng thái xác thực
  const [verified, setVerified] = useState(false)

  // gọi api để verify account
  useEffect(() => {
    if (email || token) {
      verifyUserApi({ email, token })
        .then(() => {
          setVerified(true)
        })
    }
  }, [email, token])

  // Nếu Url có vấn đề (thiếu email hoặc token) thì ra trang 404
  if (!email || !token) {
    return <Navigate to='/404' replace={true} />
  }

  // Nếu chưa verify xong thì hiện loading
  if (!verified) {
    return <PageLoadingSpinner caption="Verifying your account..." />
  }

  // Nếu verify xong thì về trang login cùng giá trị verifiedEmail
  return <Navigate to={`/login?verifiedEmail=${email}`} />

}

export default AccountVerification
