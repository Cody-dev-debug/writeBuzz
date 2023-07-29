import { useState } from "react";
import "./styles.css";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../../lib/firebase.config";
import { useNavigate, useParams } from "react-router-dom";
import { loginForm, createAccountForm } from "./constants";

const Authorization = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const [errorMessages, setErrorMessages] = useState();
  const [isSubmitted, setIsSubmitted] = useState(false);

  if(!( type === "login" || type === "sign-up"))
  navigate("/*",{replace:true})
  const goToHome = () =>
    setTimeout(() => {
      console.log("delayed for 2 seconds");
      navigate("/");
    }, 2000);

  const login = (email, pass) => {
    signInWithEmailAndPassword(auth, email, pass)
      .then((userCredentials) => {
        const { user } = userCredentials;
        if (user && user.emailVerified) {
          setIsSubmitted(true);
          console.log("User Logged In");
          goToHome();
        } else {
          setErrorMessages("Please verify your email");
        }
      })
      .catch((err) => {
        setErrorMessages(err.message);
      });
  };

  const createAccount = (email, pass, username) => {
    createUserWithEmailAndPassword(auth, email, pass)
      .then((userCredentials) => {
        const { user } = userCredentials;
        if (user) {
          updateProfile(user, { displayName: username });
          sendEmailVerification(user).then(() => {
            console.log("Verification email sent");
          });
          setIsSubmitted(true);
          goToHome();
        }
      })
      .catch((err) => {
        setErrorMessages(err.message);
      });
  };

  const handleSubmit = (event) => {
    //Prevent page reload
    event.preventDefault();

    var { email, password, username, cPassword } = document.forms[0];

    if (type === "login") {
      login(email.value, password.value);
    } else if (type === "sign-up") {
      if (cPassword.value === password.value)
        createAccount(email.value, password.value, username.value);
      else setErrorMessages("Password Mismatch");
    } 
  };

  // Generate JSX code for error message
  const renderErrorMessage = () =>
    errorMessages && <div className="error">{errorMessages}</div>;

  // JSX code for login form
  const renderForm = (form) => (
    <div className="form">
      <form onSubmit={handleSubmit}>
        {form.map((element) => (
          <div className="input-container" key={element.id}>
            <label>{element.label} </label>
            <input
              type={element.type ? element.type : "text"}
              name={element.id}
              required
            />
          </div>
        ))}
        <div className="button-container">
          <input type="submit" />
        </div>
        {renderErrorMessage()}
      </form>
    </div>
  );

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div className="login-form">
        <div className="title">
          {type === "login" ? "Log In" : "Create Account"}
        </div>
        {isSubmitted ? (
          <div>
            {type === "login"
              ? "User is successfully logged in"
              : "User account created and verification email"}
          </div>
        ) : type === "login" ? (
          renderForm(loginForm)
        ) : (
          renderForm(createAccountForm)
        )}
      </div>
    </div>
  );
};

export default Authorization;
