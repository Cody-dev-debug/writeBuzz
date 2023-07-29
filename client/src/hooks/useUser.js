import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react"

const useUser = () => {
    const [user,setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(getAuth(), user => {
            setUser(user);
        })
        
        return unsubscribe;
    },[])

    return { user,setUser };
}

export default useUser;