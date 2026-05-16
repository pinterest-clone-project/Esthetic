import logo from "../../../src/assets/logo.png"
import searchIcon from "../../../src/assets/search-vector.svg"

const Header: React.FC = () =>{
    return (
        <header className={"header"}>
            <img className="logo " src={logo}></img>
            <div className={"logo-title "}>Esthetic</div>
            <div className={"search"}>
                <img src={searchIcon} className={"search-icon"}></img>
                <input className={"search-input"} type={"text"} placeholder={"Search"}></input>
            </div>
            <nav className={"nav-header"}>
                <a className={"nav-link"}>About Us</a>
                <a className={"nav-link"}>For Business</a>
                <a className={"nav-link"}>News</a>
            </nav>
        </header>
    )
}
export default Header;