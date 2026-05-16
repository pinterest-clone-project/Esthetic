import logo from "../../../src/assets/logo.png"
import searchIcon from "../../../src/assets/search-vector.svg"

const Header: React.FC = () =>{
    return (
        <header className={"header"}>
            <img className="logo " src={logo}></img>
            <div className={"logo-title "}>Esthetic</div>
            <div className={"search"}>
                <img src={searchIcon} className={"search-icon"}></img>
                <div className={"search-text"}>Search</div>
            </div>
        </header>
    )
}
export default Header;