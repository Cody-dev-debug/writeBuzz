import { Link } from "react-router-dom";
import { useUser } from "../../hooks";
import { getAuth, signOut } from "firebase/auth";

const Navbar = () => {
  const { user,setUser } = useUser();
  const signout = () => signOut(getAuth()).then(() => {setUser(""); console.log("User Logged Out")});
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/articles">Articles</Link>
        </li>
      </ul>
      <div
        style={{
          position: "absolute",
          top: "0",
          paddingTop: "1.5rem",
          right: "0",
        }}
      >
        {!user ? (
          <div>
            <Link to={`/auth/login`}>Login</Link>
            <Link to={`/auth/sign-up`}>Sign Up</Link>
          </div>
        ) : (
          <div style={{ display:"flex"}}>
            <div style={{ padding: "1.5rem", paddingTop: "0" }}>
              {user?.displayName}
            </div>
            <div style={{ padding: "1.5rem", paddingTop: "0" }}>
                <Link to={`/`} onClick={signout}>Sign Out</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
