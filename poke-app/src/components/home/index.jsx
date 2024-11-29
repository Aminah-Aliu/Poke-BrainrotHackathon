import React from 'react'
import { useAuth } from '../../contexts/authContext'

const Home = () => {
    const { currentUser } = useAuth()
    if (!currentUser) {
        return <div>Loading...</div>; // Handle null state gracefully
      }
    
    return (
        <div className='text-2xl font-bold pt-14'>Hello {currentUser?.displayName || 'Guest'}, you are now logged in.</div>
    )
}

export default Home