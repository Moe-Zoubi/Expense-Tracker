import {auth, provider} from "../../config/firebase-config";
import {signInWithPopup} from "firebase/auth";
import {useNavigate} from "react-router-dom";
import { useGetUserInfo } from "../../hooks/useUserGetInfo";
import trackerLogo from "../../images/trackerLogo.png";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faArrowRightLong} from "@fortawesome/free-solid-svg-icons";
import "./style.css"




export const Authorication = () => {
    const navigate = useNavigate();
    const { isAuth } = useGetUserInfo();
  
    const signInWithGoogle = async () => {
      try {
        const results = await signInWithPopup(auth, provider);
        const authinfo = {
          userID: results.user.uid,
          name: results.user.displayName,
          profilePhoto: results.user.photoURL,
          isAuth: true,
        };
        localStorage.setItem("auth", JSON.stringify(authinfo));
  
        navigate("/dashboard");
      } catch (error) {
        // Handle any errors during sign-in
        console.error("Sign-in error:", error.message);
      }
    };

    

    return (
        <div className="landing-page">
          <img className="logo" src={trackerLogo} alt="icon" />
          <div className="center-login">
            <h3 className="heading">Personal finance simplified</h3>
            <p className="intro">
                Welcome to ExpenseTrack, your financial ally. Empower yourself with easy income and expense tracking,
                budget control, and future planning. Use our Expense Budget Tracker for a secure financial future.
            </p>
            <button className="login-btn" onClick={signInWithGoogle}>Get Started <FontAwesomeIcon icon={faArrowRightLong}/></button>
          </div>
          <div className="wave-bg">
            <div className="circle"></div>
          </div>
        </div>
    )
}