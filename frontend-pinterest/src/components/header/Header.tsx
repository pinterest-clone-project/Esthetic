import logo from "../../../src/assets/logo.png"
import searchIcon from "../../../src/assets/search-vector.svg"

const Header: React.FC = () =>{
    return (
        <header className={"header"}>
            <img className="logo" src={logo}></img>
            <a className={"logo-title "} href={"/"}>Esthetic</a>
            <div className={"search"}>
                <img src={searchIcon} className={"search-icon"}></img>
                <input className={"search-input"} type={"text"} placeholder={"Search"}></input>
            </div>
            <nav className={"nav-header"}>
                <a className={"nav-link"}>About Us</a>
                <a className={"nav-link"}>For Business</a>
                <a className={"nav-link"}>News</a>

                <button className={"header-sign-up-btn"}>
                    <a className={"nav-link"} href="/sign-up">Sign Up</a>
                </button>

                <button className={"header-log-in-btn"}>
                    <a className={"nav-link"} href="/log-in">Login</a>
                </button>
            </nav>
        </header>
    )
}
export default Header;